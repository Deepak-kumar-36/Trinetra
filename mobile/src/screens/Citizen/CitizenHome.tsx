import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../core/lib/supabase';
import { useAudioRecorder, AudioModule, RecordingOptions, RecordingPresets } from 'expo-audio';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { useVoiceDistress } from '../../core/hooks/useVoiceDistress';
import { useAuth } from '../../core/contexts/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

export function CitizenHomeScreen({ navigation }: any) {
  const [silentSosEnabled, setSilentSosEnabled] = useState(true);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [sosActive, setSosActive] = useState(false); // UI state for button press down
  const [isSosTriggered, setIsSosTriggered] = useState(false); // Has the 3s hold completed?
  const [manualCountdown, setManualCountdown] = useState<number | null>(null); // 5s cancel window
  const [showVoicePrompt, setShowVoicePrompt] = useState(false); // Voice memo modal
  const [incidentId, setIncidentId] = useState<string | null>(null); // Track the created incident
  const [isUploading, setIsUploading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  const { user } = useAuth();

  // Audio Recorder State
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  
  // Timer Refs
  const holdTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const { isListening, countdown, cancelCountdown, isSupported } = useVoiceDistress(silentSosEnabled);

  // Request Location Permissions on mount
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  // 1. User holds button for 3 seconds
  const handleSosStart = () => {
    if (isSosTriggered) return;
    setSosActive(true);
    
    holdTimerRef.current = setTimeout(() => {
      setIsSosTriggered(true);
      setSosActive(false);
      startManualCountdown();
    }, 3000);
  };

  const handleSosEnd = () => {
    if (isSosTriggered) return;
    setSosActive(false);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  // 2. 5-second cancel window
  const startManualCountdown = () => {
    setManualCountdown(5);
    countdownIntervalRef.current = setInterval(() => {
      setManualCountdown((prev) => {
        if (prev && prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          dispatchManualSos();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  // Cancel before dispatch
  const cancelManualSos = () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setIsSosTriggered(false);
    setManualCountdown(null);
  };

  // 3. Dispatch the SOS
  const dispatchIncident = async (category = 'general') => {
    try {
      // Get fresh location if possible, otherwise use last known
      let currentLoc = location;
      try {
        currentLoc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation(currentLoc);
      } catch (e) {
        console.warn('Could not get fresh location, using last known');
      }

      const pointStr = currentLoc 
        ? `POINT(${currentLoc.coords.longitude} ${currentLoc.coords.latitude})`
        : `POINT(77.2090 28.6139)`; // Fallback to New Delhi

      const { data, error } = await supabase.from('incidents').insert({
        reporter_id: user?.id,
        status: 'reported',
        category: category.toLowerCase(),
        trigger_source: 'manual',
        trigger_confirmed: true,
        raw_transcript: `${category === 'general' ? 'Manual SOS' : category + ' incident'} triggered. Awaiting voice context.`,
        location: pointStr
      }).select().single();
      
      if (error) throw error;
      
      if (data) setIncidentId(data.id);
      
      // Move to voice prompt phase
      setManualCountdown(null);
      setIsSosTriggered(false);
      setShowVoicePrompt(true);
      
      // Request audio permission
      await AudioModule.requestRecordingPermissionsAsync();
    } catch (e) {
      console.error('Failed to dispatch manual SOS', e);
    }
  };

  const dispatchManualSos = () => {
    dispatchIncident('general');
  };

  // 4. Voice Recording Actions
  const toggleRecording = async () => {
    if (audioRecorder.isRecording) {
      await audioRecorder.stop();
    } else {
      try {
        await audioRecorder.prepareToRecordAsync();
        audioRecorder.record();
      } catch (err) {
        console.error("Failed to start recording", err);
      }
    }
  };

  const handleTileClick = (feature: string) => {
    if (feature === 'Photo Report') navigation.navigate('PhotoReport');
    else if (feature === 'Triage Protocol') navigation.navigate('TriageProtocol');
    else if (feature === 'Medical Profile') navigation.navigate('MedicalProfile');
    else if (feature === 'Nearby Shelters') navigation.navigate('NearbyShelters');
  };

  const handleIncidentSelect = (type: string) => {
    dispatchIncident(type);
  };

  const submitVoiceReport = async () => {
    if (!incidentId || !audioRecorder.uri) {
      setShowVoicePrompt(false);
      return;
    }
    
    setIsUploading(true);
    try {
      const fileData = await FileSystem.readAsStringAsync(audioRecorder.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileName = `incident_${incidentId}_${Date.now()}.m4a`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('incident_audio')
        .upload(fileName, decodeURIComponent(escape(atob(fileData))), {
          contentType: 'audio/m4a',
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('incident_audio')
        .getPublicUrl(fileName);

      await supabase.from('incidents').update({
        raw_transcript: publicUrlData.publicUrl
      }).eq('id', incidentId);

    } catch (e) {
      console.error('Failed to upload voice report', e);
    } finally {
      setIsUploading(false);
      setShowVoicePrompt(false);
      setIncidentId(null);
    }
  };

  const skipVoiceReport = () => {
    setShowVoicePrompt(false);
    setIncidentId(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }} className="flex-1">
        
        {/* Top Bar with Silent SOS Toggle */}
        <View className="flex-row justify-between items-center w-full mb-2">
          <Text className="font-bold text-primary opacity-0">Emergency</Text>
          {isSupported ? (
            <TouchableOpacity 
              onPress={() => {
                if (!silentSosEnabled) setShowConsentModal(true);
                else setSilentSosEnabled(false);
              }}
              className={`flex-row items-center justify-center gap-2 px-4 py-2 rounded-full border ${silentSosEnabled ? 'bg-error/10 border-error/30' : 'bg-surface border-outline-variant'}`}
            >
              <MaterialIcons 
                name={silentSosEnabled ? 'mic' : 'mic-off'} 
                size={18} 
                color={silentSosEnabled ? '#ba1a1a' : '#434843'} 
              />
              <Text className={`text-sm font-bold ${silentSosEnabled ? 'text-error' : 'text-on-surface-variant'}`}>
                {silentSosEnabled ? (isListening ? 'Silent SOS: Listening' : 'Silent SOS: Active') : 'Silent SOS: Off'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View className="flex-row items-center justify-center gap-2 px-4 py-2 rounded-full border bg-surface border-outline-variant">
              <MaterialIcons name="mic-off" size={18} color="#434843" />
              <Text className="text-sm font-bold text-on-surface-variant">Silent SOS: Key Missing</Text>
            </View>
          )}
        </View>

        {/* Voice Trigger Countdown Banner */}
        {countdown !== null && (
          <View className="w-full bg-error/10 border border-error/30 rounded-2xl p-4 mt-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="record-voice-over" size={24} color="#ba1a1a" className="animate-pulse" />
              <View>
                <Text className="text-error font-bold uppercase tracking-wider text-xs">Wake Word Detected</Text>
                <Text className="text-on-surface font-bold">Auto-reporting in {countdown}s</Text>
              </View>
            </View>
            <TouchableOpacity onPress={cancelCountdown} className="bg-error px-4 py-2 rounded-xl">
              <Text className="text-white font-bold text-sm">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Manual SOS Countdown Banner */}
        {manualCountdown !== null && (
          <View className="w-full bg-error/10 border border-error/30 rounded-2xl p-4 mt-4 flex-row items-center justify-between z-20">
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="warning" size={24} color="#ba1a1a" className="animate-pulse" />
              <View>
                <Text className="text-error font-bold uppercase tracking-wider text-xs">Emergency Triggered</Text>
                <Text className="text-on-surface font-bold">Dispatching in {manualCountdown}s</Text>
              </View>
            </View>
            <TouchableOpacity onPress={cancelManualSos} className="bg-error px-4 py-2 rounded-xl">
              <Text className="text-white font-bold text-sm">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SOS Distinction Disclaimer */}
        <View className="w-full bg-surface-container-highest px-4 py-3 rounded-xl mt-4 border border-outline-variant/50">
          <Text className="text-[11px] text-on-surface-variant leading-4 text-center font-bold">
            For immediate police/fire/ambulance, use your phone's SOS or dial 112. This alerts nearby TriNetra volunteers and coordinators.
          </Text>
        </View>

        {/* Massive SOS Button */}
        <View className="w-full flex items-center justify-center min-h-[353px] relative mb-8 mt-4">
          {manualCountdown !== null && (
            <View className="absolute top-0 w-full items-center z-10">
              <View className="bg-error/10 px-4 py-2 rounded-full border border-error/30">
                <Text className="text-error font-bold uppercase tracking-widest text-xs">Preparing Dispatch</Text>
              </View>
            </View>
          )}
          <TouchableOpacity 
            className={`
              w-[280px] h-[280px] rounded-full flex items-center justify-center border
              ${isSosTriggered 
                ? 'bg-error border-error shadow-lg' 
                : 'bg-stone-bg border-outline-variant/50 shadow-sm'
              }
              ${sosActive && !isSosTriggered ? 'bg-secondary-container' : ''}
            `}
            onPressIn={handleSosStart}
            onPressOut={handleSosEnd}
            onPress={isSosTriggered ? cancelManualSos : undefined}
            activeOpacity={0.9}
          >
            <Text className={`text-[72px] font-extrabold tracking-tighter ${isSosTriggered ? 'text-white' : 'text-sage-primary'}`}>
              SOS
            </Text>
            <Text className={`text-xs uppercase mt-4 ${isSosTriggered ? 'text-white font-bold' : 'text-sage-primary opacity-80'}`}>
              {isSosTriggered ? 'Release & Wait' : (sosActive ? 'Hold...' : 'Hold for 3s')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Select Incident Type */}
        <View className="w-full flex flex-col items-center mb-4 mt-2">
          <Text className="text-xs text-on-surface-variant uppercase tracking-widest mb-6 font-bold">Select Incident Type</Text>
          <View className="flex-row flex-wrap justify-between w-full">
            <TouchableOpacity onPress={() => handleIncidentSelect('Fire')} className="w-[48%] bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 flex items-center justify-center mb-4">
              <MaterialIcons name="local-fire-department" size={36} color="#4A5D4E" />
              <Text className="text-xs uppercase tracking-wide text-charcoal-text mt-4 font-bold">Fire</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleIncidentSelect('Medical')} className="w-[48%] bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 flex items-center justify-center mb-4">
              <MaterialIcons name="monitor-heart" size={36} color="#4A5D4E" />
              <Text className="text-xs uppercase tracking-wide text-charcoal-text mt-4 font-bold">Medical</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleIncidentSelect('Flood')} className="w-[48%] bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 flex items-center justify-center mb-4">
              <MaterialIcons name="water-drop" size={36} color="#4A5D4E" />
              <Text className="text-xs uppercase tracking-wide text-charcoal-text mt-4 font-bold">Flood</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleIncidentSelect('Security')} className="w-[48%] bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 flex items-center justify-center mb-4">
              <MaterialIcons name="shield" size={36} color="#4A5D4E" />
              <Text className="text-xs uppercase tracking-wide text-charcoal-text mt-4 font-bold">Security</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleIncidentSelect('Other')} className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 flex items-center justify-center">
              <MaterialIcons name="more-horiz" size={36} color="#4A5D4E" />
              <Text className="text-xs uppercase tracking-wide text-charcoal-text mt-4 font-bold">Other</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Predictive Grid */}
        <View className="w-full flex-row flex-wrap justify-between mt-8">
          {/* Triage Tile */}
          <TouchableOpacity onPress={() => handleTileClick('Triage Protocol')} className="w-[48%] bg-stone-bg border border-outline-variant/30 rounded-xl p-5 min-h-[160px] mb-4">
            <MaterialIcons name="file-download" size={32} color="#4A5D4E" style={{ marginBottom: 20 }} />
            <Text className="text-xl font-bold text-charcoal-text">Triage Protocol</Text>
            <Text className="text-[10px] text-on-surface-variant uppercase mt-2 font-bold">Initiate Assessment</Text>
          </TouchableOpacity>

          {/* Photo Report Tile */}
          <TouchableOpacity onPress={() => handleTileClick('Photo Report')} className="w-[48%] bg-stone-bg border border-outline-variant/30 rounded-xl p-5 min-h-[160px] mb-4">
            <MaterialIcons name="photo-camera" size={32} color="#4A5D4E" style={{ marginBottom: 20 }} />
            <Text className="text-xl font-bold text-charcoal-text">Photo Report</Text>
            <Text className="text-[10px] text-on-surface-variant uppercase mt-2 font-bold">Send visual context</Text>
          </TouchableOpacity>

          {/* Medical ID Tile */}
          <TouchableOpacity onPress={() => handleTileClick('Medical Profile')} className="w-[48%] bg-stone-bg border border-outline-variant/30 rounded-xl p-5 min-h-[160px]">
            <MaterialIcons name="medical-services" size={32} color="#4A5D4E" style={{ marginBottom: 20 }} />
            <Text className="text-xl font-bold text-charcoal-text">Medical Profile</Text>
            <Text className="text-[10px] text-on-surface-variant uppercase mt-2 font-bold">Critical Data</Text>
          </TouchableOpacity>

          {/* Show Map Tile */}
          <TouchableOpacity onPress={() => handleTileClick('Nearby Shelters')} className="w-[48%] bg-stone-bg border border-outline-variant/30 rounded-xl p-5 min-h-[160px]">
            <MaterialIcons name="map" size={32} color="#4A5D4E" style={{ marginBottom: 20 }} />
            <Text className="text-xl font-bold text-charcoal-text">Show Map</Text>
            <Text className="text-[10px] text-on-surface-variant uppercase mt-2 font-bold">Shelters & Supplies</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Consent Modal for Silent SOS */}
      {showConsentModal && (
        <View className="absolute inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
          <View className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-xl">
            <MaterialIcons name="privacy-tip" size={36} color="#4A5D4E" className="mb-4" />
            <Text className="text-2xl font-bold text-charcoal-text mb-4">Passive Distress Detection</Text>
            
            <Text className="text-gray-600 mb-4 text-sm leading-5">
              When enabled, TriNetra listens securely on-device for specific trigger phrases (e.g., "Help", "Bachao"). 
              <Text className="font-bold"> No continuous audio ever leaves your phone.</Text>
            </Text>

            <View className="bg-orange-50 p-3 rounded-xl border border-orange-200 mb-6">
              <Text className="text-orange-800 text-xs font-bold mb-1">Platform Limitations</Text>
              <Text className="text-orange-700 text-[11px] leading-4">
                On iOS, this feature only works while the app is open or recently used. Android supports persistent background running (coming soon).
              </Text>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity 
                className="flex-1 bg-gray-200 p-4 rounded-xl items-center"
                onPress={() => setShowConsentModal(false)}
              >
                <Text className="font-bold text-gray-700">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 bg-primary p-4 rounded-xl items-center"
                onPress={() => {
                  setSilentSosEnabled(true);
                  setShowConsentModal(false);
                }}
              >
                <Text className="font-bold text-white">Enable</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Voice Prompt Modal */}
      {showVoicePrompt && (
        <View className="absolute inset-0 bg-white flex items-center justify-center p-6 z-50 h-full w-full">
          <MaterialIcons name="record-voice-over" size={64} color="#ba1a1a" className="mb-6" />
          <Text className="text-3xl font-bold text-charcoal-text mb-4 text-center">Add Voice Context</Text>
          <Text className="text-gray-600 mb-12 text-base text-center px-4">
            Your SOS has been dispatched. Please describe your situation, injuries, or hazards to help responders.
          </Text>
          
          <TouchableOpacity 
            onPress={toggleRecording}
            className={`w-32 h-32 rounded-full flex items-center justify-center mb-12 shadow-lg border-4 ${
              audioRecorder.isRecording 
                ? 'bg-white border-error shadow-error/30' 
                : 'bg-error border-error shadow-error/50'
            }`}
          >
            <MaterialIcons 
              name={audioRecorder.isRecording ? 'stop' : 'mic'} 
              size={48} 
              color={audioRecorder.isRecording ? '#ba1a1a' : 'white'} 
            />
          </TouchableOpacity>
          
          {audioRecorder.isRecording && (
            <Text className="text-error font-bold mb-8 text-lg">Recording in progress...</Text>
          )}

          {!audioRecorder.isRecording && audioRecorder.uri && (
            <Text className="text-primary font-bold mb-8 text-lg">Audio Recorded Successfully</Text>
          )}

          <View className="flex-row gap-4 w-full px-4 absolute bottom-12">
            <TouchableOpacity 
              className="flex-1 bg-gray-200 p-5 rounded-2xl items-center"
              onPress={skipVoiceReport}
              disabled={isUploading}
            >
              <Text className="font-bold text-gray-700 text-lg">Skip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className={`flex-1 p-5 rounded-2xl items-center ${(audioRecorder.isRecording || !audioRecorder.uri || isUploading) ? 'bg-primary/50' : 'bg-primary'}`}
              onPress={submitVoiceReport}
              disabled={audioRecorder.isRecording || !audioRecorder.uri || isUploading}
            >
              <Text className="font-bold text-white text-lg">
                {isUploading ? 'Sending...' : 'Send Voice'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}
