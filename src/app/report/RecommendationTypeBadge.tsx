"use client";

import { useState, useRef, useEffect } from "react";

const TYPE_CONFIG = {
  core: {
    symbol: "◆",
    label: "Core",
    tooltip: "Essential operational AI—niche-specific solutions that address clear operational pain points with proven ROI.",
  },
  connect: {
    symbol: "🔗",
    label: "Connect",
    tooltip: "Company-wide collaboration AI—levels up productivity across the whole organization and benefits all employees.",
  },
  create: {
    symbol: "✨",
    label: "Create",
    tooltip: "New revenue or product AI—bold, transformative ideas that can completely change your game, often customer-facing.",
  },
} as const;

type TypeKey = keyof typeof TYPE_CONFIG;

const LEGACY_MAP: Record<string, TypeKey> = {
  dot: "core",
  dash: "connect",
  star: "create",
};

export function RecommendationTypeBadge({
  type,
}: {
  type?: string | null;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const raw = (type ?? "").toLowerCase();
  const key: TypeKey =
    raw === "core" || raw === "connect" || raw === "create"
      ? raw
      : LEGACY_MAP[raw] ?? "core";
  const config = TYPE_CONFIG[key];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    }
    if (showTooltip) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showTooltip]);

  return (
    <div className="relative inline-flex" ref={wrapRef}>
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip((v) => !v)}
        className="recommendation-type-badge inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-[#00D9FF]/50 bg-[#00D9FF]/10 px-3 py-1.5 text-sm font-semibold text-[#00D9FF] transition-colors hover:border-[#00D9FF] hover:bg-[#00D9FF]/20 focus:outline-none focus:ring-2 focus:ring-[#00D9FF] focus:ring-offset-2 focus:ring-offset-[#0A0E27]"
        aria-label={`Recommendation type: ${config.label}. ${config.tooltip}`}
      >
        <span aria-hidden>{config.symbol}</span>
        <span>{config.label}</span>
      </button>

      {showTooltip && (
        <div
          className="absolute left-1/2 top-full z-50 mt-2 min-w-[200px] max-w-[min(320px,calc(100vw-2rem))] -translate-x-1/2 rounded-xl border border-white/10 bg-[#0A0E27] p-4 shadow-xl shadow-black/40"
          role="tooltip"
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
            🎨 Core–Connect–Create
          </p>
          <p className="text-sm font-semibold text-[#00D9FF] mb-1">
            {config.symbol} {config.label}
          </p>
          <p className="text-xs leading-relaxed text-[#E8EAED] break-words">
            {config.tooltip}
          </p>
        </div>
      )}
    </div>
  );
}
