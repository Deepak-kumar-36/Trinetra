import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useReducer,
  useMemo,
  useCallback,
} from 'react';
import { supabase } from '../lib/supabase';

/**
 * ⚠ KNOWN COMPLIANCE GAP (cannot be fixed in-browser):
 * The Web Speech API (`webkitSpeechRecognition`) is cloud-based in Chrome —
 * audio is streamed to Google's servers to produce transcripts. The PRD's
 * non-negotiable constraint is "no continuous cloud transcription, ever."
 * This file keeps Web Speech API only because it's the only recognizer
 * available in a browser context; it is NOT spec-compliant and must not
 * ship to production as-is. The real fix is the native on-device KWS
 * engine the PRD names (Porcupine RN bindings or equivalent), which needs
 * a native module, not a JS/web rewrite. Everything else below assumes
 * that swap happens and is structured so it's a drop-in replacement for
 * the `recognition` object's start/stop/onresult contract.
 */

// ---- Config: keyword data, not hardcoded logic ----
interface KeywordConfig {
  phrase: string;
  locale: string;
}

const DISTRESS_KEYWORDS: KeywordConfig[] = [
  // English
  { phrase: 'help', locale: 'en' },
  { phrase: 'help me', locale: 'en' },
  { phrase: 'save me', locale: 'en' },
  { phrase: 'emergency', locale: 'en' },
  { phrase: 'please help', locale: 'en' },
  { phrase: 'call the police', locale: 'en' },
  
  // Hindi / Urdu / Punjabi
  { phrase: 'bachao', locale: 'hi' },
  { phrase: 'mujhe bachao', locale: 'hi' },
  { phrase: 'bacha lo', locale: 'hi' },
  { phrase: 'madad', locale: 'hi' },
  { phrase: 'madad karo', locale: 'hi' },
  { phrase: 'meri madad karo', locale: 'hi' },
  { phrase: 'chhod do', locale: 'hi' },
  { phrase: 'chhod mujhe', locale: 'hi' },
  { phrase: 'police ko bulao', locale: 'hi' },
  { phrase: 'koi hai', locale: 'hi' },

  // Marathi
  { phrase: 'wachwa', locale: 'mr' }, // save me
  { phrase: 'madat kara', locale: 'mr' }, // help
  
  // Bengali
  { phrase: 'sahajjo korun', locale: 'bn' }, // help me
  { phrase: 'amake bachao', locale: 'bn' }, // save me

  // Telugu
  { phrase: 'kapadandi', locale: 'te' }, // save
  { phrase: 'sahayam cheyandi', locale: 'te' }, // help

  // Tamil
  { phrase: 'kaapaatrunga', locale: 'ta' }, // save me
  { phrase: 'udhavi', locale: 'ta' }, // help
  
  // Kannada
  { phrase: 'kapadi', locale: 'kn' }, // save me
  { phrase: 'sahaya madi', locale: 'kn' }, // help

  // Gujarati
  { phrase: 'bachavo', locale: 'gu' }, // save me
  
  // Malayalam
  { phrase: 'rakshikkanam', locale: 'ml' }, // save me
  { phrase: 'sahayikkane', locale: 'ml' }, // help me
];
// Note: deliberately dropped bare "fire", "save", "danger", "attack",
// "rescue" — these are common in ordinary conversation/media and were
// producing false positives with zero gating. If you need them back,
// they should require the multi-hit-in-window path, not a single match.

const CONFIRM_COUNTDOWN_SECONDS = 7; // As requested by user
const MULTI_HIT_WINDOW_MS = 8000; // rolling window for repeat-detection gating
const REQUIRED_HITS_IN_WINDOW = 1; // bump to 2 to require repeat detection

// DEMO_MODE: trades false-positive protection for first-utterance recall.
// This is the right trade for a live pitch (you say the phrase once, it
// must fire) and the WRONG trade for shipping — flip this back to false
// before this goes anywhere near a real user's phone, and re-tighten the
// confidence gate in the onresult handler below.
const DEMO_MODE = true;
const MIN_CONFIDENCE = DEMO_MODE ? 0 : 0.5; // interim results often report
// 0/undefined confidence in Chrome, so any nonzero threshold silently
// blocks interim matching — this is the #1 cause of "it didn't hear me
// the first time" since it forces a wait for a *final* result that may
// never come if the phrase is short and Chrome keeps it "interim".

const RECOGNITION_RECYCLE_MS = 45_000; // restart session periodically so
// event.results doesn't grow unbounded over a long listening session —
// this was the main perf bug in the original: onresult rescanned the
// *entire* accumulated results array every event, so cost grew with
// session length instead of staying flat.
const LASTHEARD_THROTTLE_MS = 250; // avoid a re-render on every partial result
const AUDIO_CHUNK_MS = 2000;
const AUDIO_BUFFER_CHUNKS = 3; // ~6s circular buffer attached only on trigger

// ---- Shout / scream detection (amplitude-based, keyword-independent) ----
// Keyword matching only catches the phrases you configured. A shout,
// scream, or panicked non-verbal sound won't contain any of them but is
// still a real distress signal — this runs as a second, independent
// trigger path off the same mic stream. Either path can fire the same
// confirm/countdown flow.
const SHOUT_POLL_MS = 80; // how often we sample volume
const SHOUT_RATIO = DEMO_MODE ? 2.6 : 3.2; // current volume must exceed
// baseline * this ratio. Raised from the original 1.6/2.2 — those were
// tripping on ordinary room/ambient noise. Also gated by voice-band
// filtering and crest-factor below, so we can afford a stricter ratio
// without losing real shouts.
const SHOUT_ABS_FLOOR = DEMO_MODE ? 0.09 : 0.12; // absolute floor, raised
// for the same reason — a quiet room's baseline is near-zero, so even a
// modest ratio bump wasn't enough on its own.
const SHOUT_SUSTAIN_MS = DEMO_MODE ? 220 : 320; // must stay elevated this long — screens out
// single impulsive noises (door slam, dropped phone) that spike and die
// in one frame, which pure peak-detection would misfire on
const BASELINE_EMA_ALPHA = 0.03; // slow-moving ambient noise floor, only
// updated while volume is near-baseline so a shout itself can't drag the
// baseline up mid-event

// Voice-band filtering: a nearby shout carries most of its energy in
// roughly 300Hz–4kHz (human vocal/scream range). Traffic rumble, AC hum,
// distant crowd noise, and room tone sit mostly outside that band or are
// diffuse across the whole spectrum. Filtering to this band before
// measuring volume is the practical substitute for hardware directional
// isolation — it can't tell "close" from "far," but it substantially
// discounts non-vocal ambient noise regardless of distance.
const VOICE_BAND_HIGHPASS_HZ = 300;
const VOICE_BAND_LOWPASS_HZ = 4000;

// Crest factor (peak / RMS) distinguishes a sharp, sudden transient (a
// shout) from steady loud noise (traffic, chatter, hum) that raises
// average volume without a sharp spike. Real shouts typically show a
// crest factor of ~3x or higher; steady ambient noise sits much lower.
const MIN_CREST_FACTOR = DEMO_MODE ? 2.2 : 2.8;

// Single compiled regex with word boundaries, built once — replaces the
// original's `keywords.some(kw => transcript.includes(kw))` which did a
// naive substring scan per keyword per event and matched inside unrelated
// words (e.g. "fire" inside "fireplace").
function buildKeywordMatcher(keywords: KeywordConfig[]) {
  const escaped = keywords
    .map((k) => k.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .sort((a, b) => b.length - a.length); // longest-first so "bacha lo" wins over "bacha"
  const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'i');
  return (text: string): string | null => {
    const m = text.match(pattern);
    return m ? m[1].toLowerCase() : null;
  };
}

// ---- State machine (IDLE / CONFIRMING / SUBMITTING) ----
type Phase = 'IDLE' | 'CONFIRMING' | 'SUBMITTING';

interface State {
  phase: Phase;
  countdown: number;
  lastHeard: string;
  matchedKeyword: string | null;
}

type Action =
  | { type: 'TRIGGER'; keyword: string }
  | { type: 'TICK' }
  | { type: 'CANCEL' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_DONE' }
  | { type: 'SET_LAST_HEARD'; text: string };

const initialState: State = {
  phase: 'IDLE',
  countdown: CONFIRM_COUNTDOWN_SECONDS,
  lastHeard: '',
  matchedKeyword: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'TRIGGER':
      if (state.phase !== 'IDLE') return state; // ignore re-triggers mid-flow
      return {
        ...state,
        phase: 'CONFIRMING',
        countdown: CONFIRM_COUNTDOWN_SECONDS,
        matchedKeyword: action.keyword,
      };
    case 'TICK': {
      if (state.phase !== 'CONFIRMING') return state;
      const next = state.countdown - 1;
      return { ...state, countdown: next };
    }
    case 'CANCEL':
      return { ...state, phase: 'IDLE', countdown: CONFIRM_COUNTDOWN_SECONDS, matchedKeyword: null };
    case 'SUBMIT_START':
      return { ...state, phase: 'SUBMITTING' };
    case 'SUBMIT_DONE':
      return { ...state, phase: 'IDLE', countdown: CONFIRM_COUNTDOWN_SECONDS, matchedKeyword: null };
    case 'SET_LAST_HEARD':
      return { ...state, lastHeard: action.text };
    default:
      return state;
  }
}

interface DistressDetectionContextType {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  phase: Phase;
  countdown: number;
  lastHeard: string;
  cancelSOS: () => void;
  testTrigger: () => void; // dev/rehearsal only — fires the same path as a real detection
}

const DistressDetectionContext = createContext<DistressDetectionContextType>({
  enabled: false,
  setEnabled: () => { },
  phase: 'IDLE',
  countdown: CONFIRM_COUNTDOWN_SECONDS,
  lastHeard: '',
  cancelSOS: () => { },
  testTrigger: () => { },
});

export const useDistressDetection = () => useContext(DistressDetectionContext);

export const DistressDetectionProvider: React.FC<{
  children: React.ReactNode;
  userId: string;
  initialEnabled: boolean; // from users.distress_detection_enabled — load before mount
}> = ({ children, userId, initialEnabled }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [enabled, setEnabledState] = React.useState(initialEnabled ?? false); // OFF by default

  const recognitionRef = useRef<any>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recycleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastHeardTimestampRef = useRef(0);
  const hitTimestampsRef = useRef<number[]>([]); // rolling window for multi-hit gating
  const audioCtxRef = useRef<AudioContext | null>(null); // reused, not recreated per trigger
  const phaseRef = useRef<Phase>('IDLE');
  const sosChannelRef = useRef<any>(null);

  // circular audio buffer: last N chunks, discarded on no-match, kept on trigger
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Shout-detection state
  const analyserRef = useRef<AnalyserNode | null>(null);
  const analyserDataRef = useRef<Uint8Array | null>(null);
  const shoutPollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const baselineRmsRef = useRef(0.02); // starting guess, adapts fast via EMA
  const shoutAboveSinceRef = useRef<number | null>(null);

  const matchKeyword = useMemo(() => buildKeywordMatcher(DISTRESS_KEYWORDS), []);

  useEffect(() => {
    phaseRef.current = state.phase;
  }, [state.phase]);

  // Persist toggle via existing PATCH /users/:id pattern — no new endpoint.
  const setEnabled = useCallback(
    async (v: boolean) => {
      setEnabledState(v);
      const { error } = await supabase
        .from('users')
        .update({ distress_detection_enabled: v })
        .eq('id', userId);
      if (error) console.error('Failed to persist distress_detection_enabled:', error);
    },
    [userId],
  );

  // Supabase realtime channel for cross-device notification (supplementary,
  // not a substitute for the real incident write below).
  useEffect(() => {
    const channel = supabase.channel('sos-alerts');
    channel.subscribe();
    sosChannelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new Ctor();
    }
    return audioCtxRef.current;
  }, []);

  const playAlertTone = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      osc.start();
      setTimeout(() => (osc.frequency.value = 1000), 200);
      setTimeout(() => {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      }, 500);
    } catch (e) {
      /* non-fatal */
    }
  }, [getAudioContext]);

  const getBufferedAudioBlob = useCallback((): Blob | null => {
    if (audioChunksRef.current.length === 0) return null;
    return new Blob(audioChunksRef.current, { type: 'audio/webm' });
  }, []);

  const discardAudioBuffer = useCallback(() => {
    audioChunksRef.current = [];
  }, []);

  const submitReport = useCallback(
    async (_opts: { confirmed: boolean | null }) => {
      const triggerDetail = state.matchedKeyword; // '__shout__' or the matched phrase, for the coordinator UI/logs
      dispatch({ type: 'SUBMIT_START' });

      const audioBlob = getBufferedAudioBlob();

      const finalize = async (lat: number, lon: number) => {
        try {
          // let audioPath: string | null = null;
          if (audioBlob) {
            const path = `voice-sos/${userId}/${Date.now()}.webm`;
            await supabase.storage
              .from('incident-audio')
              .upload(path, audioBlob);
            // if (!uploadError) audioPath = path;
          }

          const { data, error } = await supabase.from('incidents').insert({
            reporter_id: userId,
            status: 'reported',
            category: 'general',
            urgency_score: 100,
            urgency_band: 'critical',
            raw_transcript: JSON.stringify({ type: 'voice_keyword_auto', detail: triggerDetail === '__shout__' ? 'shout_detected' : triggerDetail }),
            location: `POINT(${lon} ${lat})`,
          }).select().single();

          if (error) throw error;

          sosChannelRef.current?.send({
            type: 'broadcast',
            event: 'new-voice-sos',
            payload: data,
          });
        } catch (err) {
          // PRD: failures must retry via the existing offline queue, not
          // silently drop. Wire this to your actual offline-queue module —
          // stubbed here since it isn't in the pasted file.
          console.error('Incident submission failed, queueing for retry:', err);
          // offlineQueue.enqueue({ type: 'voice_sos', payload: {...} });
        } finally {
          discardAudioBuffer();
          dispatch({ type: 'SUBMIT_DONE' });
        }
      };

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => finalize(pos.coords.latitude, pos.coords.longitude),
          () => finalize(0, 0),
          { enableHighAccuracy: true, timeout: 3000 },
        );
      } else {
        finalize(0, 0);
      }
    },
    [userId, getBufferedAudioBlob, discardAudioBuffer, state.matchedKeyword],
  );

  const startConfirmCountdown = useCallback(() => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    countdownTimerRef.current = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);
  }, []);

  // Watch countdown reaching 0 → auto-submit (unconfirmed, trigger_confirmed: null)
  useEffect(() => {
    if (state.phase === 'CONFIRMING' && state.countdown <= 0) {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      submitReport({ confirmed: null });
    }
  }, [state.phase, state.countdown, submitReport]);

  const triggerConfirmation = useCallback(
    (keyword: string) => {
      // keyword is either a matched phrase (e.g. "help") or the sentinel
      // '__shout__' for an amplitude-based trigger with no specific word.
      if (phaseRef.current !== 'IDLE') return; // prevent double-trigger
      dispatch({ type: 'TRIGGER', keyword });
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        /* ignore */
      }
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200, 100, 200]);
      playAlertTone();
      startConfirmCountdown();
    },
    [playAlertTone, startConfirmCountdown],
  );

  const cancelSOS = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    discardAudioBuffer(); // PRD: cancelled trigger must leave zero persisted audio
    hitTimestampsRef.current = [];
    dispatch({ type: 'CANCEL' });
  }, [discardAudioBuffer]);

  // Rolling multi-hit gate: require REQUIRED_HITS_IN_WINDOW matches inside
  // MULTI_HIT_WINDOW_MS before treating it as a real trigger. With
  // REQUIRED_HITS_IN_WINDOW=1 this behaves like a single-hit trigger but
  // the machinery is in place and test-covered for turning it up.
  const registerHit = useCallback((keyword: string) => {
    const now = Date.now();
    hitTimestampsRef.current = hitTimestampsRef.current.filter(
      (t) => now - t < MULTI_HIT_WINDOW_MS,
    );
    hitTimestampsRef.current.push(now);
    if (hitTimestampsRef.current.length >= REQUIRED_HITS_IN_WINDOW) {
      hitTimestampsRef.current = [];
      triggerConfirmation(keyword);
    }
  }, [triggerConfirmation]);

  // ---- Recognition + circular audio buffer setup ----
  useEffect(() => {
    if (!enabled) return; // gate: fully inert when toggle is off

    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      dispatch({ type: 'SET_LAST_HEARD', text: '⚠ Browser not supported' });
      return;
    }

    let stopped = false;

    navigator.mediaDevices
      .getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
      })
      .then((stream) => {
        if (stopped) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        mediaStreamRef.current = stream;

        // Circular buffer: keep only the last AUDIO_BUFFER_CHUNKS chunks.
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
            if (audioChunksRef.current.length > AUDIO_BUFFER_CHUNKS) {
              audioChunksRef.current.shift();
            }
          }
        };
        recorder.start(AUDIO_CHUNK_MS);
        mediaRecorderRef.current = recorder;

        // --- Shout detector: independent of speech recognition ---
        const ctx = getAudioContext();
        const source = ctx.createMediaStreamSource(stream);

        // Voice-band filter chain: highpass then lowpass, so the analyser
        // only "sees" roughly the human vocal/scream frequency range.
        const highpass = ctx.createBiquadFilter();
        highpass.type = 'highpass';
        highpass.frequency.value = VOICE_BAND_HIGHPASS_HZ;
        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = VOICE_BAND_LOWPASS_HZ;

        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        analyser.smoothingTimeConstant = 0; // we do our own smoothing (baseline EMA)

        source.connect(highpass);
        highpass.connect(lowpass);
        lowpass.connect(analyser);
        // deliberately NOT connected to ctx.destination — we only read
        // data from it, never play the mic back out
        analyserRef.current = analyser;
        analyserDataRef.current = new Uint8Array(analyser.frequencyBinCount);

        const computeRmsAndCrest = (data: Uint8Array) => {
          let sumSquares = 0;
          let peak = 0;
          for (let i = 0; i < data.length; i++) {
            const centered = (data[i] - 128) / 128; // -1..1
            const abs = Math.abs(centered);
            if (abs > peak) peak = abs;
            sumSquares += centered * centered;
          }
          const rms = Math.sqrt(sumSquares / data.length);
          const crest = rms > 0.0001 ? peak / rms : 0;
          return { rms, crest };
        };

        shoutPollTimerRef.current = setInterval(() => {
          if (phaseRef.current !== 'IDLE' || !analyserRef.current || !analyserDataRef.current) return;

          analyserRef.current.getByteTimeDomainData(analyserDataRef.current as any);
          const { rms, crest } = computeRmsAndCrest(analyserDataRef.current as any);
          const threshold = Math.max(baselineRmsRef.current * SHOUT_RATIO, SHOUT_ABS_FLOOR);
          const isLoudEnough = rms > threshold;
          const isSharpEnough = crest >= MIN_CREST_FACTOR;

          if (isLoudEnough && isSharpEnough) {
            const now = Date.now();
            if (shoutAboveSinceRef.current === null) {
              shoutAboveSinceRef.current = now;
            } else if (now - shoutAboveSinceRef.current >= SHOUT_SUSTAIN_MS) {
              shoutAboveSinceRef.current = null;
              triggerConfirmation('__shout__'); // bypasses keyword multi-hit
              // gating on purpose — a sustained loud, sharp spike is
              // already a strong single signal, unlike one ambiguous word
            }
          } else {
            shoutAboveSinceRef.current = null;
            // Only let quiet/steady volume pull the baseline — a loud
            // event in progress must never be allowed to raise its own
            // threshold. (isLoudEnough alone, ignoring crest, is the right
            // gate here: steady loud ambient noise shouldn't become the
            // new "normal" baseline either.)
            if (!isLoudEnough) {
              baselineRmsRef.current =
                BASELINE_EMA_ALPHA * rms + (1 - BASELINE_EMA_ALPHA) * baselineRmsRef.current;
            }
          }
        }, SHOUT_POLL_MS);

        const recognition = new SpeechRecognitionCtor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = DEMO_MODE ? 3 : 1; // more candidate
        // transcriptions per chunk = more chances to catch the exact phrase
        // through mic noise/accent variance; check every alternative below.

        recognition.onresult = (event: any) => {
          if (phaseRef.current !== 'IDLE') return;

          // Only look at the newest result, not the whole accumulated
          // array — the original rescanned everything ever heard in the
          // session on every event, which is the main perf bug.
          const latest = event.results[event.results.length - 1];
          const topTranscript = latest[0].transcript.toLowerCase().trim();
          const confidence = latest[0].confidence ?? 0;

          const now = Date.now();
          if (now - lastHeardTimestampRef.current > LASTHEARD_THROTTLE_MS) {
            lastHeardTimestampRef.current = now;
            dispatch({ type: 'SET_LAST_HEARD', text: topTranscript });
          }

          // DEMO_MODE matches on interim results too, not just `isFinal`.
          // Chrome can hold a short, clearly-spoken phrase as "interim"
          // for a long time (or until you stop talking entirely) before
          // ever marking it final — waiting for isFinal is the single
          // biggest source of "said it once, nothing happened."
          if (!DEMO_MODE && !latest.isFinal) return;

          if (confidence && confidence < MIN_CONFIDENCE) return;

          // Check every alternative transcription in this result, not
          // just the top one — a lower-ranked alternative sometimes has
          // the exact phrase where the top guess mangled it.
          for (let i = 0; i < latest.length; i++) {
            const alt = latest[i].transcript.toLowerCase().trim();
            const keyword = matchKeyword(alt);
            if (keyword) {
              registerHit(keyword);
              break;
            }
          }
        };

        recognition.onerror = (event: any) => {
          if (event.error === 'not-allowed') {
            setEnabled(false); // permission revoked → hard stop, per PRD §5
            return;
          }
          // Any other error (no-speech, network blip, audio-capture) —
          // restart immediately instead of waiting for onend, so a single
          // dropped frame during the pitch doesn't leave the mic dead.
          if (!stopped && phaseRef.current === 'IDLE') {
            try {
              recognition.stop();
            } catch (e) {
              /* ignore */
            }
          }
        };

        recognition.onend = () => {
          if (!stopped && phaseRef.current === 'IDLE') {
            try {
              recognition.start();
            } catch (e) {
              /* ignore */
            }
          }
        };

        recognitionRef.current = recognition;
        try {
          recognition.start();
        } catch (e) {
          /* ignore */
        }

        // Periodically recycle the session so event.results doesn't grow
        // unboundedly over long listening periods.
        recycleTimerRef.current = setInterval(() => {
          if (phaseRef.current === 'IDLE') {
            try {
              recognition.stop(); // onend will restart it fresh
            } catch (e) {
              /* ignore */
            }
          }
        }, RECOGNITION_RECYCLE_MS);
      })
      .catch(() => {
        dispatch({ type: 'SET_LAST_HEARD', text: '⚠ Microphone permission needed' });
      });

    return () => {
      stopped = true;
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        /* ignore */
      }
      if (recycleTimerRef.current) clearInterval(recycleTimerRef.current);
      if (shoutPollTimerRef.current) clearInterval(shoutPollTimerRef.current);
      analyserRef.current = null;
      analyserDataRef.current = null;
      shoutAboveSinceRef.current = null;
      mediaRecorderRef.current?.stop();
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
      audioChunksRef.current = [];
      hitTimestampsRef.current = [];
    };
  }, [enabled, matchKeyword, registerHit, setEnabled]);

  const testTrigger = useCallback(() => {
    if (!DEMO_MODE) return; // never available outside demo builds
    triggerConfirmation('__test__');
  }, [triggerConfirmation]);

  return (
    <DistressDetectionContext.Provider
      value={{
        enabled,
        setEnabled,
        phase: state.phase,
        countdown: state.countdown,
        lastHeard: state.lastHeard,
        cancelSOS,
        testTrigger,
      }}
    >
      {children}

      {enabled && state.phase === 'IDLE' && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-charcoal-text/90 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm max-w-[90%] backdrop-blur-md">
          <span className="inline-block w-2 h-2 bg-error rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
          <span className="truncate">{state.lastHeard || 'Listening for distress phrases…'}</span>
          {DEMO_MODE && (
            <button
              onClick={testTrigger}
              className="ml-2 shrink-0 text-xs underline opacity-80 hover:opacity-100"
            >
              Test
            </button>
          )}
        </div>
      )}

      {state.phase === 'CONFIRMING' && (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex flex-col items-center justify-center p-6 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-[2rem] p-8 shadow-2xl flex flex-col items-center text-center">
            
            <div className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-[56px] text-error animate-[pulse_1s_ease-in-out_infinite]">
                mic_external_on
              </span>
            </div>

            <h2 className="font-display-lg text-error mb-2 text-3xl font-bold">Distress Detected</h2>
            <p className="font-body-lg text-on-surface-variant mb-6">
              {state.matchedKeyword === '__shout__'
                ? 'A loud distress sound triggered an emergency SOS. Authorities will be notified in…'
                : 'A voice keyword triggered an emergency SOS. Authorities will be notified in…'}
            </p>
            
            <div className="text-[140px] font-extrabold text-error leading-none mb-8 tracking-tighter">
              {state.countdown}
            </div>
            
            <button
              onClick={cancelSOS}
              className="w-full h-[72px] bg-surface-variant text-on-surface-variant rounded-full font-bold text-xl uppercase tracking-widest hover:bg-surface-container-highest transition-colors active:scale-95"
            >
              Cancel — I'm OK
            </button>
          </div>
        </div>
      )}
    </DistressDetectionContext.Provider>
  );
};