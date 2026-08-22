import React, { useRef, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const CitizenPhoto = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (file: File) => {
    if (!user) return;
    setIsUploading(true);
    setError(null);

    try {
      // 1. Get Location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // 2. Compress Photo to Base64 (Bypassing Supabase Storage Bucket)
      const base64DataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height = Math.round((height * MAX_WIDTH) / width);
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width = Math.round((width * MAX_HEIGHT) / height);
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.6));
          };
          img.onerror = () => reject(new Error('Failed to load image for compression'));
          if (typeof e.target?.result === 'string') {
            img.src = e.target.result;
          } else {
            reject(new Error('Failed to read file as string'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      });

      // 3. Create Incident with trigger_source = 'photo_report'
      const { data, error: insertError } = await supabase
        .from('incidents')
        .insert({
          reporter_id: user.id,
          status: 'reported',
          category: 'general',
          urgency_score: 100,
          urgency_band: 'critical',
          raw_transcript: JSON.stringify({ type: 'photo_report', url: base64DataUrl }),
          location: `POINT(${lon} ${lat})`,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // 4. Broadcast to other devices
      const channel = supabase.channel('sos-alerts');
      channel.send({
        type: 'broadcast',
        event: 'new-voice-sos', // Reusing the same realtime event name so we don't have to rewrite listeners
        payload: data,
      });
      supabase.removeChannel(channel);

      // Successfully uploaded! Show success bubble and then navigate
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/citizen', { replace: true });
      }, 3000);

    } catch (err: any) {
      console.error('Photo upload failed:', err);
      setError(err.message || 'Failed to send photo alert. Please check location permissions and try again.');
      setIsUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handlePhotoUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest overflow-hidden relative">
      {/* Header */}
      <div className="bg-primary text-on-primary p-6 rounded-b-[2rem] shadow-md z-10 flex flex-col pt-12">
        <h1 className="font-display-lg text-[2.5rem] leading-tight mb-2">Photo SOS</h1>
        <p className="font-body-lg text-primary-container/80">
          Capture an emergency to instantly dispatch volunteers to your exact location.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6 relative z-0">
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-10 bg-surface-container rounded-3xl w-full max-w-sm text-center shadow-lg animate-pulse">
            <span className="material-symbols-outlined text-[64px] text-primary animate-spin mb-4">refresh</span>
            <h3 className="font-headline-sm text-on-surface font-bold">Uploading Alert...</h3>
            <p className="font-body-md text-on-surface-variant mt-2">Sending location and photo to the Coordinator.</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="w-full bg-error-container text-on-error-container p-4 rounded-xl border border-error/30 mb-2 flex items-start gap-3">
                <span className="material-symbols-outlined text-error mt-0.5">error</span>
                <p className="font-body-md font-medium text-sm">{error}</p>
              </div>
            )}
            
            <button 
              onClick={() => cameraInputRef.current?.click()}
              className="w-full max-w-sm aspect-[4/3] bg-error text-white rounded-[2rem] shadow-[0_8px_30px_rgba(200,50,50,0.3)] hover:bg-error/90 active:scale-95 transition-all flex flex-col items-center justify-center gap-4 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="material-symbols-outlined text-[72px] drop-shadow-md">photo_camera</span>
              <span className="font-display-sm text-2xl font-bold uppercase tracking-wider drop-shadow-md">Click Photo</span>
              <span className="font-label-sm opacity-80 uppercase tracking-widest text-xs">Live Capture</span>
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-sm h-[100px] bg-surface-container text-on-surface rounded-2xl shadow-sm border border-outline-variant/50 hover:bg-surface-container-high active:scale-95 transition-all flex items-center justify-center gap-4 relative overflow-hidden"
            >
              <span className="material-symbols-outlined text-[32px] text-primary">collections</span>
              <div className="flex flex-col text-left">
                <span className="font-headline-sm font-bold tracking-tight">Select from Gallery</span>
                <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Upload existing image</span>
              </div>
            </button>
          </>
        )}

        {/* Hidden inputs */}
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          ref={cameraInputRef} 
          className="hidden" 
          onChange={onFileChange} 
        />
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={onFileChange} 
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-error text-white p-4 rounded-xl shadow-lg z-50 animate-fade-in flex items-start gap-3">
          <span className="material-symbols-outlined">error</span>
          <p className="font-body-md flex-1">{error}</p>
          <button onClick={() => setError(null)} className="text-white/80 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Success Overlay */}
      {isSuccess && (
        <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-sage-primary text-white flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(74,93,78,0.4)] animate-[bounce_1s_ease-in-out]">
              <span className="material-symbols-outlined text-[40px]">check_circle</span>
            </div>
            <h2 className="font-display-lg text-on-surface mb-2 text-2xl font-bold">Photo Sent!</h2>
            <p className="font-body-lg text-on-surface-variant">
              Your photo and precise location have been successfully transmitted to the Coordinator. Help is on the way.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
