"use client";

interface DemoVideoProps {
  src?: string;
  embedUrl?: string;
  poster?: string;
}

export function DemoVideo({ src, embedUrl, poster }: DemoVideoProps) {
  // Embed mode (Loom, YouTube, Vimeo, etc.)
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

  // MP4 mode — autoplay, muted, loop, playsInline for mobile compatibility
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.4)] bg-[#0A0A0A]">
      <video
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="metadata"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
