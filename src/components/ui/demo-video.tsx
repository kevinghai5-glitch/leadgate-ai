"use client";

import { useState, useRef } from "react";
import { Play } from "lucide-react";

interface DemoVideoProps {
  src?: string;
  embedUrl?: string;
  poster?: string;
}

export function DemoVideo({ src, embedUrl, poster }: DemoVideoProps) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  // Embed mode (Loom, YouTube, etc.)
  if (embedUrl) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Demo video"
        />
      </div>
    );
  }

  // MP4 mode
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.4)] bg-[#0A0A0A]">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls={playing}
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {!playing && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center group cursor-pointer"
          aria-label="Play video"
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
          {/* Play button */}
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-gradient-to-br from-[#D2AC47] to-[#B08B73] flex items-center justify-center shadow-[0_0_30px_rgba(210,172,71,0.3)] group-hover:shadow-[0_0_40px_rgba(210,172,71,0.5)] group-hover:scale-105 transition-all duration-300">
            <Play className="h-7 w-7 sm:h-8 sm:w-8 text-black fill-black ml-1" />
          </div>
        </button>
      )}
    </div>
  );
}
