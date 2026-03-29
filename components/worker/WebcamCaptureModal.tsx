"use client";

import { useRef, useCallback } from "react";
import Webcam from "react-webcam";

type Props = {
  onCapture: (dataUrl: string) => void;
  onClose: () => void;
};

export default function WebcamCaptureModal({ onCapture, onClose }: Props) {
  const ref = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const shot = ref.current?.getScreenshot?.() ?? null;
    if (shot) {
      onCapture(shot);
      onClose();
    }
  }, [onCapture, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-4 shadow-xl">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">Take a photo</h3>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
          <Webcam
            audio={false}
            ref={ref}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={capture}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Use photo
          </button>
        </div>
      </div>
    </div>
  );
}
