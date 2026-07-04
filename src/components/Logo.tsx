import React from "react";

export default function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Dark Navy Background */}
      <rect width="100" height="100" rx="16" fill="#0B1628" />
      {/* Left Leg of A — Electric Blue */}
      <path d="M50 15 L20 85 L32 85 L50 35 L68 85 L80 85 Z" fill="#2979FF" />
      {/* Dynamic Upward Swoosh Arrow — Golden Amber */}
      <path
        d="M25 72 C40 55, 60 48, 82 32 L75 30 L85 28 L82 40 Z"
        fill="#F5A623"
        stroke="#0B1628"
        strokeWidth="2"
      />
    </svg>
  );
}
