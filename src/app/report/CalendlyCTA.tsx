"use client";

import Script from "next/script";
import { useEffect, useCallback } from "react";

const CALENDLY_URL = "https://calendly.com/oli-3jx4/ai-strategy-session";
const WIDGET_CSS = "https://assets.calendly.com/assets/external/widget.css";
const WIDGET_JS = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

export function CalendlyCTA() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = WIDGET_CSS;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (typeof window !== "undefined" && window.Calendly) {
        window.Calendly.initPopupWidget({ url: CALENDLY_URL });
      }
    },
    []
  );

  return (
    <>
      <Script src={WIDGET_JS} strategy="lazyOnload" />
      <a
        href={CALENDLY_URL}
        onClick={handleClick}
        className="calendly-cta inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#00D9FF]/50 bg-[#00D9FF]/10 px-5 py-3 text-sm font-semibold text-[#00D9FF] no-underline transition-all hover:border-[#00D9FF] hover:bg-[#00D9FF]/20 focus:outline-none focus:ring-2 focus:ring-[#00D9FF] focus:ring-offset-2 focus:ring-offset-[#0A0E27]"
        aria-label="Schedule your free 1-2-1 AI strategy session"
      >
        Schedule your free 1-2-1 strategy session
      </a>
    </>
  );
}
