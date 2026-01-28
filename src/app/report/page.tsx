import { supabaseServer } from "@/lib/supabase.server";

type ReportPageProps = {
  searchParams: Promise<{
    requestId?: string;
  }>;
};

export default async function ReportPage(props: ReportPageProps) {
  const { requestId } = await props.searchParams;

  if (!requestId) {
    return (
      <main className="w-full max-w-5xl rounded-3xl bg-white shadow-xl border border-slate-200 px-6 py-6 sm:px-10 sm:py-10">
        <header className="mb-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Are You AI Ready?
          </p>
          <h1 className="text-2xl font-semibold sm:text-3xl text-slate-900">
            Report not found
          </h1>
        </header>
        <p className="text-sm text-slate-600">
          This link is missing a report ID. Please open the link from your email
          again, or request a new report.
        </p>
      </main>
    );
  }

  const { data: report, error } = await supabaseServer
    .from("ai_readiness_reports")
    .select(
      "business_summary, recommendations, implementation_roadmap, priority_matrix, strategic_summary, competitors"
    )
    .eq("request_id", requestId)
    .single();

  if (error || !report) {
    return (
      <main className="w-full max-w-5xl rounded-3xl bg-white shadow-xl border border-slate-200 px-6 py-6 sm:px-10 sm:py-10">
        <header className="mb-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Are You AI Ready?
          </p>
          <h1 className="text-2xl font-semibold sm:text-3xl text-slate-900">
            We couldn&apos;t load your report
          </h1>
        </header>
        <p className="text-sm text-slate-600">
          It looks like this report is not available yet. If you just submitted
          your details, please wait a few minutes while we generate your AI
          readiness report, then try the link again.
        </p>
      </main>
    );
  }

  const {
    business_summary,
    recommendations,
    implementation_roadmap,
    priority_matrix,
    strategic_summary,
    competitors,
  } =
    report as {
      business_summary: any;
      recommendations: any;
      implementation_roadmap: any;
      priority_matrix: any;
      strategic_summary: string | null;
      competitors: any;
    };

  const companyName = business_summary?.company_name ?? "Your business";
  const goalsCount = Array.isArray(business_summary?.key_goals)
    ? business_summary.key_goals.length
    : 0;
  const quickWinsCount = Array.isArray(implementation_roadmap?.quick_wins)
    ? implementation_roadmap.quick_wins.length
    : 0;

  const recommendationIndex: Record<string, any> = {};
  let roadmapStep = 1;
  if (Array.isArray(recommendations)) {
    for (const rec of recommendations) {
      if (rec?.solution_id) {
        recommendationIndex[rec.solution_id] = rec;
      }
    }
  }

  return (
    <div className="report-page-root relative">
      <div className="report-grain-overlay" />

      <div className="relative z-10 mx-auto flex max-w-7xl justify-center px-4 py-10 sm:px-10 sm:py-12">
        <main className="w-full max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A0E27] via-[#111633] to-[#1A1F3A] shadow-xl border border-[#1F2645]">
          <div className="relative z-10 px-8 pt-10 pb-6 sm:px-12 sm:pt-12">
            {/* Hero */}
            <header className="hero">
              <div className="inline-block rounded-full bg-gradient-to-r from-[#00D9FF] to-[#A594F9] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0A0E27] mb-6 report-slide-in-left">
            {companyName}
          </div>
          <h1 className="font-[system-ui] text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight mb-4 bg-gradient-to-r from-white to-[#00D9FF] bg-clip-text text-transparent report-slide-in-left-delay-1">
            AI Opportunities
            <br />
            Strategic Report
          </h1>
          <p className="subtitle text-base sm:text-lg text-[#D1D5DB] max-w-2xl mb-6 report-slide-in-left-delay-2">
            A comprehensive analysis of high-impact AI solutions to drive
            revenue growth, operational efficiency, and competitive advantage.
          </p>

          {/* Stats bar */}
          <div className="stats-bar flex flex-wrap gap-8 mt-2 report-fade-in-up">
            <div className="stat min-w-[140px]">
              <div className="stat-number text-3xl sm:text-4xl font-semibold text-[#00D9FF]">
                {Array.isArray(recommendations) ? recommendations.length : 0}
              </div>
              <div className="stat-label text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">
                Solutions Identified
              </div>
            </div>
            <div className="stat min-w-[140px]">
              <div className="stat-number text-3xl sm:text-4xl font-semibold text-[#00D9FF]">
                {quickWinsCount}
              </div>
              <div className="stat-label text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">
                Quick Wins
              </div>
            </div>
            <div className="stat min-w-[140px]">
              <div className="stat-number text-3xl sm:text-4xl font-semibold text-[#00D9FF]">
                High
              </div>
              <div className="stat-label text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">
                Revenue Impact
              </div>
            </div>
          </div>
        </header>

        {/* Executive summary */}
        <section className="mt-12 mb-14 report-fade-in-up">
          <div className="rounded-2xl border border-[#00D9FF4D] bg-gradient-to-br from-[#00D9FF1A] via-[#A594F91A] to-transparent px-6 py-6 sm:px-8 sm:py-7 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#00D9FF] via-[#A594F9] to-[#FFB800]" />
            <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-[#00D9FF] mb-3">
              Executive Summary
            </h2>
            <p className="text-sm sm:text-base text-[#E8EAED] leading-relaxed">
              {strategic_summary ??
                "This report highlights the most impactful AI opportunities across your business, prioritising rapid wins in lead capture and response, while laying the groundwork for deeper automation and differentiation over time."}
            </p>

            {/* Impact cards */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="impact-card rounded-xl border border-white/10 bg-gradient-to-br from-[#A594F91A] to-[#00D9FF1A] px-4 py-4 text-center">
                <div className="impact-label text-[11px] uppercase tracking-[0.18em] text-[#9CA3AF] mb-1">
                  Primary Goal
                </div>
                <div className="impact-value text-xl font-semibold text-[#00D9FF] mb-1">
                  Revenue Growth
                </div>
                <div className="impact-description text-xs text-[#E8EAEDCC]">
                  Direct lead-to-sale conversion improvement
                </div>
              </div>
              <div className="impact-card rounded-xl border border-white/10 bg-gradient-to-br from-[#A594F91A] to-[#00D9FF1A] px-4 py-4 text-center">
                <div className="impact-label text-[11px] uppercase tracking-[0.18em] text-[#9CA3AF] mb-1">
                  Key Advantage
                </div>
                <div className="impact-value text-xl font-semibold text-[#00D9FF] mb-1">
                  24/7 Capture
                </div>
                <div className="impact-description text-xs text-[#E8EAEDCC]">
                  Zero missed opportunities from inbound demand
                </div>
              </div>
              <div className="impact-card rounded-xl border border-white/10 bg-gradient-to-br from-[#A594F91A] to-[#00D9FF1A] px-4 py-4 text-center">
                <div className="impact-label text-[11px] uppercase tracking-[0.18em] text-[#9CA3AF] mb-1">
                  Response Time
                </div>
                <div className="impact-value text-xl font-semibold text-[#00D9FF] mb-1">
                  &lt; 5 minutes
                </div>
                <div className="impact-description text-xs text-[#E8EAEDCC]">
                  21x higher qualification rate vs. same-day responses
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Competitive landscape */}
        {Array.isArray(competitors) && competitors.length > 0 && (
          <section className="mb-16 report-fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-[#FFB800] to-[#FF6B6B] bg-clip-text text-transparent mb-2">
                Competitive Landscape
              </h2>
              <p className="text-sm sm:text-base text-[#D1D5DB]">
                How your competitors currently show up in your market.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {competitors.map((comp: any, idx: number) => (
                <article
                  key={comp.name ?? idx}
                  className="competitor-card rounded-3xl border-2 border-white/10 bg-white/5 px-6 py-6 sm:px-7 sm:py-7 shadow-[0_18px_40px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4 mb-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1">
                        {comp.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#D1D5DB]">
                        <span>📍</span>
                        <span>
                          {comp.location}
                          {comp.service_area ? ` • ${comp.service_area}` : ""}
                        </span>
                      </div>
                    </div>
                    {comp.ai_readiness_score && (
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                          comp.ai_readiness_score === "advanced"
                            ? "bg-gradient-to-r from-[#4ECDC4] to-[#00D9FF] text-[#0A0E27]"
                            : "bg-gradient-to-r from-[#FF6B6B] to-[#FFB800] text-[#0A0E27]"
                        }`}
                      >
                        {comp.ai_readiness_score === "advanced"
                          ? "Advanced AI"
                          : "Basic AI"}
                      </span>
                    )}
                  </div>

                  {/* Services overview */}
                  {comp.services_description && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00D9FF] mb-1 flex items-center gap-2">
                        <span className="inline-block h-4 w-[3px] rounded-full bg-[#00D9FF]" />
                        Services overview
                      </p>
                      <p className="text-xs sm:text-sm text-[#E5E7EBCC]">
                        {comp.services_description}
                      </p>
                    </div>
                  )}

                  {/* Key capabilities (24/7, chat, booking, response time) */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00D9FF] mb-2 flex items-center gap-2">
                      <span className="inline-block h-4 w-[3px] rounded-full bg-[#00D9FF]" />
                      Key capabilities
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs text-[#E5E7EB]">
                      <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                        <span className="text-[#9CA3AF] font-semibold">
                          24/7 Available
                        </span>
                        <span
                          className={
                            comp.twenty_four_seven_capabilities?.booking_available
                              ? "font-semibold text-[#4ECDC4]"
                              : "font-semibold text-[#FF6B6B]"
                          }
                        >
                          {comp.twenty_four_seven_capabilities
                            ?.booking_available
                            ? "Yes"
                            : "No"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                        <span className="text-[#9CA3AF] font-semibold">
                          Live chat
                        </span>
                        <span
                          className={
                            comp.communication_channels?.live_chat
                              ? "font-semibold text-[#4ECDC4]"
                              : "font-semibold text-[#FF6B6B]"
                          }
                        >
                          {comp.communication_channels?.live_chat ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                        <span className="text-[#9CA3AF] font-semibold">
                          Online booking
                        </span>
                        <span
                          className={
                            comp.booking_scheduling?.online_booking_available
                              ? "font-semibold text-[#4ECDC4]"
                              : "font-semibold text-[#FF6B6B]"
                          }
                        >
                          {comp.booking_scheduling?.online_booking_available
                            ? "Yes"
                            : "No"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                        <span className="text-[#9CA3AF] font-semibold">
                          Response time
                        </span>
                        <span className="font-semibold text-[#F9FAFB]">
                          {comp.response_capabilities?.response_time_indicators ??
                            comp.review_management?.response_speed ??
                            "Unknown"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Strengths */}
                  {Array.isArray(comp.competitive_advantages) &&
                    comp.competitive_advantages.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00D9FF] mb-1 flex items-center gap-2">
                          <span className="inline-block h-4 w-[3px] rounded-full bg-[#00D9FF]" />
                          Their strengths
                        </p>
                        <ul className="list-none space-y-1 text-[11px] sm:text-xs text-[#E5E7EBCC]">
                          {comp.competitive_advantages.map((s: string) => (
                            <li key={s} className="pl-4 relative">
                              <span className="absolute left-0 text-[#4ECDC4]">
                                ✓
                              </span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {/* Weaknesses (derived from key_differences / opportunity_summary) */}
                  {(comp.key_differences || comp.opportunity_summary) && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00D9FF] mb-1 flex items-center gap-2">
                        <span className="inline-block h-4 w-[3px] rounded-full bg-[#00D9FF]" />
                        Their weaknesses
                      </p>
                      <ul className="list-none space-y-1 text-[11px] sm:text-xs text-[#E5E7EBCC]">
                        {comp.key_differences && (
                          <li className="pl-4 relative">
                            <span className="absolute left-0 text-[#FF6B6B]">
                              ×
                            </span>
                            {comp.key_differences}
                          </li>
                        )}
                        {comp.opportunity_summary && (
                          <li className="pl-4 relative">
                            <span className="absolute left-0 text-[#FF6B6B]">
                              ×
                            </span>
                            {comp.opportunity_summary}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Priority matrix */}
        {priority_matrix && (
          <section className="priority-matrix mb-16 report-fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-[#FFB800] to-[#FF6B6B] bg-clip-text text-transparent mb-2">
                Priority Matrix
              </h2>
              <p className="text-sm sm:text-base text-[#D1D5DB]">
                Solutions mapped by impact and implementation effort.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border-2 border-[#4ECDC4] bg-gradient-to-br from-[#4ECDC41A] to-[#4ECDC40D] px-5 py-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#E5E7EB] mb-4">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[#4ECDC4]" />
                  🎯 Quick Wins – High Impact, Low Effort
                </div>
                {Array.isArray(priority_matrix.high_impact_low_effort) &&
                priority_matrix.high_impact_low_effort.length > 0 ? (
                  priority_matrix.high_impact_low_effort.map((item: string) => (
                    <div
                      key={item}
                      className="mb-2 last:mb-0 cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#F9FAFB] hover:border-white/40 hover:bg-white/10 transition"
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <p className="text-xs italic text-[#9CA3AF] text-center py-3">
                    No solutions in this quadrant yet.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border-2 border-[#FFB800] bg-gradient-to-br from-[#FFB8001A] to-[#FFB8000D] px-5 py-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#E5E7EB] mb-4">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[#FFB800]" />
                  🚀 Strategic – High Impact, High Effort
                </div>
                {Array.isArray(priority_matrix.high_impact_high_effort) &&
                priority_matrix.high_impact_high_effort.length > 0 ? (
                  priority_matrix.high_impact_high_effort.map((item: string) => (
                    <div
                      key={item}
                      className="mb-2 last:mb-0 cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#F9FAFB] hover:border-white/40 hover:bg-white/10 transition"
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <p className="text-xs italic text-[#9CA3AF] text-center py-3">
                    No solutions in this quadrant yet.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border-2 border-[#9CA3AF] bg-gradient-to-br from-[#9CA3AF1A] to-[#9CA3AF0D] px-5 py-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#E5E7EB] mb-4">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[#9CA3AF]" />
                  ⚡ Low Priority – Low Impact, Low Effort
                </div>
                {Array.isArray(priority_matrix.low_impact_low_effort) &&
                priority_matrix.low_impact_low_effort.length > 0 ? (
                  priority_matrix.low_impact_low_effort.map((item: string) => (
                    <div
                      key={item}
                      className="mb-2 last:mb-0 cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#F9FAFB] hover:border-white/40 hover:bg-white/10 transition"
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <p className="text-xs italic text-[#9CA3AF] text-center py-3">
                    No solutions in this quadrant.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border-2 border-[#FF6B6B] bg-gradient-to-br from-[#FF6B6B1A] to-[#FF6B6B0D] px-5 py-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#E5E7EB] mb-4">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[#FF6B6B]" />
                  ⚠️ Reconsider – Low Impact, High Effort
                </div>
                {Array.isArray(priority_matrix.low_impact_high_effort) &&
                priority_matrix.low_impact_high_effort.length > 0 ? (
                  priority_matrix.low_impact_high_effort.map((item: string) => (
                    <div
                      key={item}
                      className="mb-2 last:mb-0 cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-[#F9FAFB] hover:border-white/40 hover:bg-white/10 transition"
                    >
                      {item}
                    </div>
                  ))
                ) : (
                  <p className="text-xs italic text-[#9CA3AF] text-center py-3">
                    No solutions in this quadrant.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Detailed recommendations */}
        {Array.isArray(recommendations) && recommendations.length > 0 && (
          <section className="mb-16 report-fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-[#FFB800] to-[#FF6B6B] bg-clip-text text-transparent mb-2">
                Detailed Recommendations
              </h2>
              <p className="text-sm sm:text-base text-[#D1D5DB]">
                {recommendations.length} strategic AI solution
                {recommendations.length > 1 ? "s" : ""} to move the needle.
              </p>
            </div>

            <div className="space-y-10">
              {recommendations.map((rec: any, idx: number) => (
                <article
                  key={rec.solution_id ?? rec.title ?? idx}
                  className="rounded-3xl border border-white/10 bg-white/5 px-6 py-6 sm:px-8 sm:py-8 shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-2">
                        {rec.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {rec.category && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-[#E5E7EB]">
                            <span>📊</span>
                            <span className="uppercase tracking-[0.16em]">
                              {rec.category}
                            </span>
                          </span>
                        )}
                        {rec.implementation?.implementation_time && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-[#E5E7EB]">
                            <span>⚡</span>
                            <span>
                              {rec.implementation.implementation_time}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`priority-badge inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] ${
                        rec.implementation?.priority_level === "high"
                          ? "bg-gradient-to-r from-[#4ECDC4] to-[#00D9FF] text-[#0A0E27]"
                          : "bg-gradient-to-r from-[#FFB800] to-[#FF6B6B] text-[#0A0E27]"
                      }`}
                    >
                      {rec.implementation?.priority_level
                        ? `${rec.implementation.priority_level} priority`
                        : "Priority"}
                    </span>
                  </div>

                  {/* Single top description: prefer solution_description, fall back to problem_opportunity */}
                  {(rec.solution_description || rec.problem_opportunity) && (
                    <div className="mb-6 rounded-xl border-l-4 border-[#00D9FF] bg-[#00D9FF0D] px-4 py-3 text-sm sm:text-base text-[#E8EAED]">
                      {rec.solution_description || rec.problem_opportunity}
                    </div>
                  )}

                  {/* Impact grid for this recommendation */}
                  {rec.business_impact && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                      <div className="impact-card rounded-xl border border-white/10 bg-gradient-to-br from-[#A594F91A] to-[#00D9FF1A] px-4 py-4 text-center">
                        <div className="impact-label text-[10px] uppercase tracking-[0.16em] text-[#9CA3AF] mb-1">
                          Revenue Impact
                        </div>
                        <div className="impact-value text-lg font-semibold text-[#00D9FF] mb-1">
                          {rec.business_impact.revenue_impact ?? "High"}
                        </div>
                        <div className="impact-description text-[11px] text-[#E8EAEDCC]">
                          {rec.business_impact.primary_benefit ??
                            "Direct contribution to growth."}
                        </div>
                      </div>
                      <div className="impact-card rounded-xl border border-white/10 bg-gradient-to-br from-[#A594F91A] to-[#00D9FF1A] px-4 py-4 text-center">
                        <div className="impact-label text-[10px] uppercase tracking-[0.16em] text-[#9CA3AF] mb-1">
                          ROI Example
                        </div>
                        <div className="impact-value text-lg font-semibold text-[#00D9FF] mb-1">
                          ROI
                        </div>
                        <div className="impact-description text-[11px] text-[#E8EAEDCC]">
                          {rec.business_impact.roi_indicators ??
                            "Strong return relative to tool cost."}
                        </div>
                      </div>
                      <div className="impact-card rounded-xl border border-white/10 bg-gradient-to-br from-[#A594F91A] to-[#00D9FF1A] px-4 py-4 text-center">
                        <div className="impact-label text-[10px] uppercase tracking-[0.16em] text-[#9CA3AF] mb-1">
                          Efficiency
                        </div>
                        <div className="impact-value text-lg font-semibold text-[#00D9FF] mb-1">
                          +
                        </div>
                        <div className="impact-description text-[11px] text-[#E8EAEDCC]">
                          {rec.business_impact.efficiency_gains ??
                            "Frees time for higher-value work."}
                        </div>
                      </div>
                      <div className="impact-card rounded-xl border border-white/10 bg-gradient-to-br from-[#A594F91A] to-[#00D9FF1A] px-4 py-4 text-center">
                        <div className="impact-label text-[10px] uppercase tracking-[0.16em] text-[#9CA3AF] mb-1">
                          Advantage
                        </div>
                        <div className="impact-value text-lg font-semibold text-[#00D9FF] mb-1">
                          +
                        </div>
                        <div className="impact-description text-[11px] text-[#E8EAEDCC]">
                          {rec.competitive_positioning?.notes ??
                            "Creates or protects an edge versus competitors."}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tools */}
                  {Array.isArray(rec.existing_tools) &&
                    rec.existing_tools.length > 0 && (
                      <div className="mt-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#00D9FF] mb-3">
                          Recommended Tools
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                          {rec.existing_tools.map((tool: any) => (
                            <div
                              key={tool.tool_name}
                              className="tool-card rounded-2xl border border-[#00D9FF4D] bg-gradient-to-br from-[#1A1F3ACC] to-[#0A0E27CC] px-4 py-4"
                            >
                              <div className="tool-name text-base font-semibold text-[#00D9FF] mb-1">
                                {tool.tool_name}
                              </div>
                              {tool.description && (
                                <p className="tool-description text-xs text-[#E5E7EBCC] mb-2">
                                  {tool.description}
                                </p>
                              )}
                              <div className="tool-meta mt-2 flex items-center justify-between border-t border-white/10 pt-2">
                                <span
                                  className={`complexity-badge text-[10px] font-semibold uppercase tracking-[0.16em] rounded-full px-2 py-1 ${
                                    tool.complexity_tier === "low"
                                      ? "bg-[#4ECDC433] text-[#4ECDC4]"
                                      : tool.complexity_tier === "medium"
                                      ? "bg-[#FFB80033] text-[#FFB800]"
                                      : "bg-[#FF6B6B33] text-[#FF6B6B]"
                                  }`}
                                >
                                  {tool.complexity_tier
                                    ? `${tool.complexity_tier} complexity`
                                    : "Complexity"}
                                </span>
                                {tool.approximate_cost_range && (
                                  <span className="tool-cost text-[11px] font-medium text-[#E5E7EBCC]">
                                    {tool.approximate_cost_range}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Competitive advantage pill */}
                  {rec.competitive_positioning?.notes && (
                    <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#4ECDC41A] via-[#A594F91A] to-transparent px-4 py-3 border border-white/10">
                      <p className="text-xs sm:text-sm font-semibold text-[#E5E7EB]">
                        <span className="mr-2">💡</span>
                        Competitive Advantage:
                        <span className="ml-2 font-normal text-[#E5E7EBCC]">
                          {rec.competitive_positioning.notes}
                        </span>
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Roadmap */}
        {implementation_roadmap && (
          <section className="roadmap mb-16 rounded-[28px] border-2 border-[#FFB800] bg-gradient-to-br from-[#FFB8000D] to-[#FF6B6B0D] px-6 py-6 sm:px-8 sm:py-8 report-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-semibold text-center bg-gradient-to-r from-[#FFB800] to-[#FF6B6B] bg-clip-text text-transparent mb-8">
              Implementation Roadmap
            </h2>
            <div className="relative pl-10">
              <div className="absolute left-2 top-0 bottom-0 w-1 rounded-full bg-gradient-to-b from-[#4ECDC4] via-[#FFB800] to-[#FF6B6B]" />

              {Array.isArray(implementation_roadmap.quick_wins) &&
                implementation_roadmap.quick_wins.length > 0 && (
                  <div className="relative mb-8 pl-6">
                    <div className="timeline-dot absolute left-[-30px] top-1 h-4 w-4 rounded-full border-2 border-[#4ECDC4] bg-[#0A0E27]" />
                    <div className="timeline-timeframe text-xs font-bold uppercase tracking-[0.16em] text-[#FFB800] mb-2">
                      Quick Wins (Weeks 1–2)
                    </div>
                    <div className="timeline-content rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      {implementation_roadmap.quick_wins.map((item: any) => {
                        const linked =
                          item.solution_id &&
                          recommendationIndex[item.solution_id];
                        const outcomes =
                          linked?.business_impact?.expected_outcomes;
                        const stepNumber = roadmapStep++;

                        const label = linked?.title ?? item.solution_id;

                        return (
                          <div
                            key={item.solution_id}
                            className="mb-4 last:mb-0"
                          >
                            <div className="timeline-solution text-base sm:text-lg font-semibold text-white">
                              {stepNumber}. {label}
                            </div>
                            {item.why_quick_win && (
                              <p className="timeline-why text-[13px] text-[#E5E7EBCC] mb-1.5">
                                {item.why_quick_win}
                              </p>
                            )}
                            {Array.isArray(outcomes) && outcomes.length > 0 && (
                              <ul className="mt-1 list-disc pl-4 text-[13px] text-[#E5E7EBCC] space-y-0.5">
                                {outcomes.slice(0, 2).map((o: string) => (
                                  <li key={o}>{o}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {Array.isArray(implementation_roadmap.medium_term) &&
                implementation_roadmap.medium_term.length > 0 && (
                  <div className="relative mb-8 pl-6">
                    <div className="timeline-dot absolute left-[-30px] top-1 h-4 w-4 rounded-full border-2 border-[#FFB800] bg-[#0A0E27]" />
                    <div className="timeline-timeframe text-xs font-bold uppercase tracking-[0.16em] text-[#FFB800] mb-2">
                      Medium Term (1–3 Months)
                    </div>
                    <div className="timeline-content rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      {implementation_roadmap.medium_term.map((item: any) => {
                        const linked =
                          item.solution_id &&
                          recommendationIndex[item.solution_id];
                        const outcomes =
                          linked?.business_impact?.expected_outcomes;
                        const stepNumber = roadmapStep++;

                        const label = linked?.title ?? item.solution_id;

                        return (
                          <div
                            key={item.solution_id}
                            className="mb-4 last:mb-0"
                          >
                            <div className="timeline-solution text-base sm:text-lg font-semibold text-white">
                              {stepNumber}. {label}
                            </div>
                            {item.why_medium_term && (
                              <p className="timeline-why text-[13px] text-[#E5E7EBCC] mb-1.5">
                                {item.why_medium_term}
                              </p>
                            )}
                            {Array.isArray(outcomes) && outcomes.length > 0 && (
                              <ul className="mt-1 list-disc pl-4 text-[13px] text-[#E5E7EBCC] space-y-0.5">
                                {outcomes.slice(0, 2).map((o: string) => (
                                  <li key={o}>{o}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {Array.isArray(implementation_roadmap.long_term) &&
                implementation_roadmap.long_term.length > 0 && (
                  <div className="relative mb-2 pl-6">
                    <div className="timeline-dot absolute left-[-30px] top-1 h-4 w-4 rounded-full border-2 border-[#FF6B6B] bg-[#0A0E27]" />
                    <div className="timeline-timeframe text-xs font-bold uppercase tracking-[0.16em] text-[#FFB800] mb-2">
                      Long Term (3–6+ Months)
                    </div>
                    <div className="timeline-content rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      {implementation_roadmap.long_term.map((item: any) => {
                        const linked =
                          item.solution_id &&
                          recommendationIndex[item.solution_id];
                        const outcomes =
                          linked?.business_impact?.expected_outcomes;
                        const stepNumber = roadmapStep++;

                        const label = linked?.title ?? item.solution_id;

                        return (
                          <div
                            key={item.solution_id}
                            className="mb-4 last:mb-0"
                          >
                            <div className="timeline-solution text-base sm:text-lg font-semibold text-white">
                              {stepNumber}. {label}
                            </div>
                            {item.why_long_term && (
                              <p className="timeline-why text-[13px] text-[#E5E7EBCC] mb-1.5">
                                {item.why_long_term}
                              </p>
                            )}
                            {Array.isArray(outcomes) && outcomes.length > 0 && (
                              <ul className="mt-1 list-disc pl-4 text-[13px] text-[#E5E7EBCC] space-y-0.5">
                                {outcomes.slice(0, 2).map((o: string) => (
                                  <li key={o}>{o}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-white/10 text-center report-fade-in-up">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#9CA3AF]">
            AI Opportunities Report • Generated for {companyName} • Strategic
            Implementation Guide
          </p>
        </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

