"use client";

import { useState, useEffect } from "react";

export function useDesktopDetect() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const w = window as unknown as Record<string, unknown>;
    setIsDesktop(
      ua.includes("electron") ||
      ua.includes("aioms-desktop") ||
      !!w.electron ||
      !!w.__TAURI__ ||
      !!w.__ELECTRON__
    );
  }, []);

  return isDesktop;
}

const WEB_PORTAL_BASE = "https://mobile-shop-os.vercel.app";

export function openInExternalBrowser(path: string) {
  window.open(`${WEB_PORTAL_BASE}${path}`, "_blank");
}
