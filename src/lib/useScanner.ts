"use client";

import { useEffect, useRef, useCallback } from "react";

type ScannerOptions = {
  onScan: (code: string) => void;
  minLength?: number;
  timeout?: number;
};

export function useScanner({ onScan, minLength = 8, timeout = 100 }: ScannerOptions) {
  const buffer = useRef("");
  const lastKeyTime = useRef(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const now = Date.now();
      const timeDiff = now - lastKeyTime.current;

      if (timeDiff > timeout && buffer.current.length > 0) {
        buffer.current = "";
      }

      lastKeyTime.current = now;

      if (e.key === "Enter") {
        const scanned = buffer.current.trim();
        if (scanned.length >= minLength) {
          onScan(scanned);
        }
        buffer.current = "";
        return;
      }

      if (e.key.length === 1) {
        buffer.current += e.key;
      }
    },
    [onScan, minLength, timeout]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
