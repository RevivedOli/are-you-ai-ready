"use client";

import { useState } from "react";

type Recommendation = any;

type Props = {
  items: Recommendation[];
};

export function RecommendationsCarousel({ items }: Props) {
  const [index, setIndex] = useState(0);

  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const current = items[Math.min(index, items.length - 1)];

  const goPrev = () => {
    setIndex((i) => (i <= 0 ? items.length - 1 : i - 1));
  };

  const goNext = () => {
    setIndex((i) => (i >= items.length - 1 ? 0 : i + 1));
  };

  return (
    <section className="mb-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recommendations
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            You have {items.length} focused recommendation
            {items.length > 1 ? "s" : ""}. Use the arrows to browse them.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-xs text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            aria-label="Previous recommendation"
          >
            ‹
          </button>
          <span className="text-xs font-medium text-slate-500">
            {index + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={goNext}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-xs text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            aria-label="Next recommendation"
          >
            ›
          </button>
        </div>
      </div>

      <article className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 shadow-sm shadow-slate-100">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-slate-900">
            {current.title}
          </h3>
          {current.category && (
            <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-500">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-500" />
              {current.category}
            </p>
          )}
          {current.problem_opportunity && (
            <p className="mt-1 text-sm text-slate-700">
              {current.problem_opportunity}
            </p>
          )}
          {current.solution_description && (
            <p className="mt-1 text-sm text-slate-700">
              {current.solution_description}
            </p>
          )}
        </div>

        <details className="mt-4 group">
          <summary className="cursor-pointer text-xs font-medium text-slate-600 hover:text-sky-700">
            View full breakdown
          </summary>
          <div className="mt-3 space-y-4 text-xs text-slate-700">
            {current.how_it_works && (
              <section>
                <p className="font-semibold text-slate-900">How it works</p>
                <p className="mt-1 whitespace-pre-wrap">
                  {current.how_it_works}
                </p>
              </section>
            )}

            {current.business_impact && (
              <section>
                <p className="font-semibold text-slate-900">
                  Business impact
                </p>
                <ul className="mt-1 list-disc pl-4 space-y-0.5">
                  {current.business_impact.primary_benefit && (
                    <li>
                      <span className="font-medium">Primary benefit:</span>{" "}
                      {current.business_impact.primary_benefit}
                    </li>
                  )}
                  {current.business_impact.revenue_impact && (
                    <li>
                      <span className="font-medium">Revenue impact:</span>{" "}
                      {current.business_impact.revenue_impact}
                    </li>
                  )}
                  {current.business_impact.roi_indicators && (
                    <li>
                      <span className="font-medium">ROI:</span>{" "}
                      {current.business_impact.roi_indicators}
                    </li>
                  )}
                  {current.business_impact.efficiency_gains && (
                    <li>
                      <span className="font-medium">Efficiency:</span>{" "}
                      {current.business_impact.efficiency_gains}
                    </li>
                  )}
                </ul>
              </section>
            )}

            {current.implementation && (
              <section>
                <p className="font-semibold text-slate-900">Implementation</p>
                <div className="mt-1 space-y-1">
                  {current.implementation.implementation_time && (
                    <p>
                      <span className="font-medium text-slate-900">Time:</span>{" "}
                      {current.implementation.implementation_time}
                    </p>
                  )}
                  {current.implementation.priority_level && (
                    <p>
                      <span className="font-medium text-slate-900">
                        Priority:
                      </span>{" "}
                      {current.implementation.priority_level}
                    </p>
                  )}
                </div>
                {Array.isArray(current.implementation.key_steps) &&
                  current.implementation.key_steps.length > 0 && (
                    <div className="mt-1">
                      <p className="font-medium text-slate-900">Key steps</p>
                      <ul className="mt-0.5 list-decimal pl-5 space-y-0.5">
                        {current.implementation.key_steps.map((step: string) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                {Array.isArray(current.implementation.prerequisites) &&
                  current.implementation.prerequisites.length > 0 && (
                    <div className="mt-1">
                      <p className="font-medium text-slate-900">
                        Prerequisites
                      </p>
                      <ul className="mt-0.5 list-disc pl-5 space-y-0.5">
                        {current.implementation.prerequisites.map(
                          (item: string) => (
                            <li key={item}>{item}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </section>
            )}

            {Array.isArray(current.existing_tools) &&
              current.existing_tools.length > 0 && (
                <section>
                  <p className="font-semibold text-slate-900">
                    Suggested tools
                  </p>
                  <ul className="mt-1 space-y-1">
                    {current.existing_tools.map((tool: any) => (
                      <li
                        key={tool.tool_name}
                        className="rounded border border-slate-200 bg-white px-2 py-1"
                      >
                        <p className="text-[11px] font-semibold text-slate-900">
                          {tool.tool_name}
                        </p>
                        {tool.why_suitable && (
                          <p className="text-[11px] text-slate-700">
                            {tool.why_suitable}
                          </p>
                        )}
                        {tool.approximate_cost_range && (
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            Cost: {tool.approximate_cost_range}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            {current.competitive_positioning && (
              <section>
                <p className="font-semibold text-slate-900">
                  Competitive positioning
                </p>
                <ul className="mt-1 list-disc pl-4 space-y-0.5">
                  {current.competitive_positioning.positioning_angle && (
                    <li>
                      <span className="font-medium text-slate-900">
                        Angle:
                      </span>{" "}
                      {current.competitive_positioning.positioning_angle}
                    </li>
                  )}
                  {current.competitive_positioning.competitor_status && (
                    <li>
                      <span className="font-medium text-slate-900">
                        Status:
                      </span>{" "}
                      {current.competitive_positioning.competitor_status}
                    </li>
                  )}
                  {current.competitive_positioning.notes && (
                    <li>{current.competitive_positioning.notes}</li>
                  )}
                </ul>
              </section>
            )}
          </div>
        </details>
      </article>
    </section>
  );
}

