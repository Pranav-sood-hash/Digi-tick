import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  onCancel: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onCancel,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    let active = true;

    async function startCamera() {
      setCameraError(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        if (active && videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      } catch (err: any) {
        if (active) {
          setCameraError(
            err.name === 'NotAllowedError'
              ? 'Camera permission was denied. Please allow camera access in browser settings.'
              : 'Could not connect to camera. Please use file upload instead.'
          );
        }
      }
    }

    startCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const handleTakePhoto = () => {
    if (!videoRef.current) return;

    setCapturing(true);
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          setCapturing(false);
          if (blob) {
            onCapture(blob);
          }
        },
        'image/jpeg',
        0.92
      );
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div className="relative w-full max-w-lg mx-auto bg-black rounded-2xl overflow-hidden aspect-[4/3] flex flex-col items-center justify-center border border-nature-border dark:border-darknature-border">
      {cameraError ? (
        <div className="p-6 text-center text-white">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <p className="text-xs font-semibold mb-2">{cameraError}</p>
          <Button variant="outline" size="sm" onClick={onCancel} className="mt-2 text-white border-white/40">
            Switch to File Upload
          </Button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Top Controls Overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="text-[11px] font-semibold bg-black/60 text-white px-2.5 py-1 rounded-md border border-white/20">
              Align note inside frame
            </span>
            <div className="flex space-x-1.5">
              <button
                onClick={toggleCamera}
                className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 border border-white/20 transition-colors"
                title="Switch Camera"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onCancel}
                className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 border border-white/20 transition-colors"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom Shutter Overlay */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center z-10">
            <button
              onClick={handleTakePhoto}
              disabled={capturing}
              className="w-14 h-14 rounded-full bg-white border-4 border-nature-primary flex items-center justify-center active:scale-95 transition-transform"
              aria-label="Capture photo"
            >
              <div className="w-10 h-10 rounded-full bg-nature-primary flex items-center justify-center text-white">
                <Camera className="w-5 h-5" />
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
