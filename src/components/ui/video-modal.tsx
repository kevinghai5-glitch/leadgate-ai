"use client";

import { useEffect, useState } from "react";
import { X, Play } from "lucide-react";

interface VideoModalProps {
  videoSrc?: string;
  embedUrl?: string;
  triggerLabel: string;
  triggerClassName?: string;
}

export function VideoModal({
  videoSrc,
  embedUrl,
  triggerLabel,
  triggerClassName,
}: VideoModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClassName}
      >
        <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#D2AC47]/15 mr-2">
          <Play className="h-3.5 w-3.5 text-[#F5D07A] fill-[#F5D07A] ml-0.5" />
        </span>
        {triggerLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_8px_60px_rgba(0,0,0,0.6)] bg-[#0A0A0A]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 flex items-center justify-center text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Demo video"
              />
            ) : (
              <video
                src={videoSrc}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
