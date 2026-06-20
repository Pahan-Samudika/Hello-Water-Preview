import React from "react";

export default function AdminRootLoading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-fadeIn">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing spin ring */}
        <div className="absolute size-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        
        {/* Inner brand logo container with soft pulsing glow */}
        <div className="size-12 bg-black rounded-full p-2.5 flex items-center justify-center shadow-2xl shadow-primary/30 animate-pulse">
          <img
            src="/logo.svg"
            alt="Hello Water"
            className="size-full object-contain"
          />
        </div>
      </div>
      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse mt-2">
        Loading admin panel...
      </p>
    </div>
  );
}
