import React from "react";

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <img
        src="/icon.png"
        alt="AIOMS Logo"
        className="w-full h-full object-contain drop-shadow-md"
      />
    </div>
  );
}
