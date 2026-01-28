"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type CompanySize = "small" | "medium" | "large";
type AiAdoption = "none" | "experimenting" | "few_places" | "mature";
type AiTalent = "in_house" | "consultants" | "none";

type FormState = {
  email: string;
  consent: boolean;
  industry: string;
  websiteUrl: string;
  companyName: string;
  companySize?: CompanySize;
  aiAdoption?: AiAdoption;
  aiTalent?: AiTalent;
  businessGoals: string[];
  responseSpeed?: string;
  missedCalls?: string;
  additionalContext: string;
};

const BUSINESS_GOAL_OPTIONS = [
  "Increase revenue",
  "Reduce costs",
  "Improve customer experience",
  "Accelerate product development",
  "Expand into new markets",
] as const;

const RESPONSE_SPEED_OPTIONS = [
  "Within 1 hour",
  "Same working day",
  "Within 2–3 days",
  "Longer than 3 days",
] as const;

const MISSED_CALL_OPTIONS = [
  "Rarely or never",
  "Sometimes",
  "Frequently",
] as const;

type StepId =
  | "intro"
  | "industry"
  | "website"
  | "companySize"
  | "aiAdoption"
  | "aiTalent"
  | "businessGoals"
  | "responseSpeed"
  | "missedCalls"
  | "additionalContext";

const STEPS: StepId[] = [
  "intro",
  "industry",
  "website",
  "companySize",
  "aiAdoption",
  "aiTalent",
  "businessGoals",
  "responseSpeed",
  "missedCalls",
  "additionalContext",
];

export default function Home() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    email: "",
    consent: false,
    industry: "",
    websiteUrl: "",
    companyName: "",
    companySize: undefined,
    aiAdoption: undefined,
    aiTalent: undefined,
    businessGoals: [],
    responseSpeed: undefined,
    missedCalls: undefined,
    additionalContext: "",
  });

  const currentStep = STEPS[stepIndex];
  const progress = useMemo(
    () => ((stepIndex + 1) / STEPS.length) * 100,
    [stepIndex]
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleGoal(goal: (typeof BUSINESS_GOAL_OPTIONS)[number]) {
    setForm((prev) => {
      const exists = prev.businessGoals.includes(goal);
      return {
        ...prev,
        businessGoals: exists
          ? prev.businessGoals.filter((g) => g !== goal)
          : [...prev.businessGoals, goal],
      };
    });
  }

  function canContinue(step: StepId) {
    switch (step) {
      case "intro":
        return (
          form.email.trim().length > 3 &&
          form.email.includes("@") &&
          form.consent
        );
      case "industry":
        return form.industry.trim().length > 1;
      case "website":
        return (
          form.websiteUrl.trim().length > 0 ||
          form.companyName.trim().length > 1
        );
      case "companySize":
        return Boolean(form.companySize);
      case "aiAdoption":
        return Boolean(form.aiAdoption);
      case "aiTalent":
        return Boolean(form.aiTalent);
      case "businessGoals":
        return form.businessGoals.length > 0;
      case "responseSpeed":
        return Boolean(form.responseSpeed);
      case "missedCalls":
        return Boolean(form.missedCalls);
      case "additionalContext":
        // Optional free-text; allow empty.
        return true;
      default:
        return true;
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/ai-readiness", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      router.push("/thank-you");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving your answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function goNext() {
    if (!canContinue(currentStep)) return;

    if (stepIndex === STEPS.length - 1) {
      void handleSubmit();
    } else {
      setStepIndex((i) => i + 1);
      setError(null);
    }
  }

  function goBack() {
    if (stepIndex === 0) return;
    setStepIndex((i) => i - 1);
    setError(null);
  }

  return (
    <div className="fixed inset-0 min-h-screen w-full overflow-y-auto overflow-x-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-onboarding-pulse-slow" />
        <div
          className="absolute bottom-1/4 -right-48 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-onboarding-pulse-slow"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl animate-onboarding-pulse-slow"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Grain overlay */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          {/* Progress block */}
          <div className="mb-8 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-indigo-300">
                Step {stepIndex + 1} of {STEPS.length}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ~2 minutes
              </span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-slate-800/50 backdrop-blur-sm">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-onboarding-shimmer" />
            </div>
          </div>

          {/* Main card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl transition duration-1000 group-hover:opacity-30" aria-hidden />
            <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
              {/* Header */}
              <div className="border-b border-white/5 px-8 py-8 sm:px-12">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Are You AI Ready?
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    AI Readiness Check
                  </h1>
                  <p className="text-base text-slate-300">
                    Answer a few focused questions about your business. The more detail you share, the more tailored your AI readiness report will be.
                  </p>
                </div>
              </div>

              {/* Form content */}
              <div className="px-8 py-10 sm:px-12">
                <div
                  key={currentStep}
                  className="min-h-[340px] space-y-6 animate-onboarding-fade-in-up"
                >
        {currentStep === "intro" && (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                First, let&apos;s start with your email
              </h2>
              <p className="text-slate-400">
                We&apos;ll use this to send your completed report and a magic link so you can come back to it any time.
              </p>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  Work email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3.5 text-white placeholder-slate-500 backdrop-blur-sm transition focus:border-indigo-500 focus:bg-slate-800/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </div>
              <label className="group flex cursor-pointer items-start gap-3 transition">
                <input
                  type="checkbox"
                  className="onboarding-checkbox mt-0.5 h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-white/20 bg-slate-800/50 transition checked:border-indigo-500 checked:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                  checked={form.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                />
                <span className="text-sm text-slate-400 transition group-hover:text-slate-300">
                  I agree to share this information so you can generate an AI readiness report for my business. You won&apos;t spam or sell my data.
                </span>
              </label>
            </div>
          </>
        )}

        {currentStep === "industry" && (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                What industry are you in?
              </h2>
              <p className="text-slate-400">
                A simple description is enough – for example &quot;B2B SaaS&quot;, &quot;retail ecommerce&quot;, or &quot;professional services&quot;.
              </p>
            </div>
            <input
              type="text"
              className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3.5 text-white placeholder-slate-500 backdrop-blur-sm transition focus:border-indigo-500 focus:bg-slate-800/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
              placeholder="e.g. B2B SaaS for finance"
              value={form.industry}
              onChange={(e) => update("industry", e.target.value)}
            />
          </>
        )}

        {currentStep === "website" && (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                Do you have a website we can look at?
              </h2>
              <p className="text-slate-400">
                Sharing your site lets the AI understand what you do, who you serve, and how you position yourself. If you don&apos;t have a site, just share your company name instead.
              </p>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  Website URL (preferred)
                </label>
                <input
                  type="url"
                  className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3.5 text-white placeholder-slate-500 backdrop-blur-sm transition focus:border-indigo-500 focus:bg-slate-800/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                  placeholder="https://yourcompany.com"
                  value={form.websiteUrl}
                  onChange={(e) => update("websiteUrl", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-px flex-1 bg-white/10" />
                or
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  Company name (if you don&apos;t have a website)
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3.5 text-white placeholder-slate-500 backdrop-blur-sm transition focus:border-indigo-500 focus:bg-slate-800/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
                  placeholder="e.g. Acme Consulting"
                  value={form.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        {currentStep === "companySize" && (
          <>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                How big is your company?
              </h2>
              <p className="text-slate-400">
                A rough range is fine – this just helps size recommendations.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { id: "small", label: "Small", hint: "Under 50 people", emoji: "👤" },
                { id: "medium", label: "Medium", hint: "50–500 people", emoji: "👥" },
                { id: "large", label: "Large", hint: "500+ people", emoji: "🏢" },
              ].map((option) => {
                const selected = form.companySize === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => update("companySize", option.id as CompanySize)}
                    className={`group relative overflow-hidden rounded-xl border p-5 text-left transition hover:border-white/20 hover:bg-slate-800/50 ${
                      selected
                        ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20"
                        : "border-white/10 bg-slate-800/30"
                    }`}
                  >
                    <div className="relative z-10 space-y-2">
                      <div className="text-2xl">{option.emoji}</div>
                      <div className="font-semibold text-white">{option.label}</div>
                      <div className={`text-xs ${selected ? "text-indigo-300" : "text-slate-500"}`}>
                        {option.hint}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {currentStep === "aiAdoption" && (
          <>
            <h2 className="text-2xl font-bold text-white">
              How would you describe your current AI adoption?
            </h2>
            <p className="text-slate-400">
              Pick the option that feels closest to where you are today.
            </p>
            <div className="mt-3 space-y-2">
              {[
                {
                  id: "none",
                  label: "No AI in use",
                  description:
                    "You’re not currently using AI tools in the business.",
                },
                {
                  id: "experimenting",
                  label: "Some experimentation",
                  description:
                    "A few people are trying tools like ChatGPT or similar.",
                },
                {
                  id: "few_places",
                  label: "Using AI in a few places",
                  description:
                    "You have some AI-powered workflows in production.",
                },
                {
                  id: "mature",
                  label: "Mature AI across departments",
                  description:
                    "Multiple teams have embedded AI into their processes.",
                },
              ].map((option) => {
                const selected = form.aiAdoption === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      update("aiAdoption", option.id as AiAdoption)
                    }
                    className={`w-full rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                      selected
                        ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20"
                        : "border-white/10 bg-slate-800/30 text-white hover:border-white/20 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div
                      className={`mt-0.5 text-xs ${
                        selected ? "text-indigo-300" : "text-slate-500"
                      }`}
                    >
                      {option.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {currentStep === "aiTalent" && (
          <>
            <h2 className="text-2xl font-bold text-white">
              Do you have access to any AI or technical talent?
            </h2>
            <p className="text-slate-400">
              This helps gauge what level of implementation support you might
              need.
            </p>
            <div className="mt-3 space-y-2">
              {[
                {
                  id: "in_house",
                  label: "In-house team",
                  description:
                    "We have internal people who can build or maintain AI solutions.",
                },
                {
                  id: "consultants",
                  label: "Consultants / contractors",
                  description:
                    "We primarily work with outside partners for AI or advanced automation.",
                },
                {
                  id: "none",
                  label: "No dedicated AI team",
                  description:
                    "We don’t currently have people focused on AI implementation.",
                },
              ].map((option) => {
                const selected = form.aiTalent === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      update("aiTalent", option.id as AiTalent)
                    }
                    className={`w-full rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                      selected
                        ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20"
                        : "border-white/10 bg-slate-800/30 text-white hover:border-white/20 hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div
                      className={`mt-0.5 text-xs ${
                        selected ? "text-indigo-300" : "text-slate-500"
                      }`}
                    >
                      {option.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {currentStep === "businessGoals" && (
          <>
            <h2 className="text-2xl font-bold text-white">
              What are your top 1–2 business goals right now?
            </h2>
            <p className="text-slate-400">
              Choose the goals that matter most in the next 6–12 months.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {BUSINESS_GOAL_OPTIONS.map((goal) => {
                const selected = form.businessGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      selected
                        ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20"
                        : "border-white/10 bg-slate-800/30 text-white hover:border-white/20 hover:bg-slate-800/50"
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {currentStep === "responseSpeed" && (
          <>
            <h2 className="text-2xl font-bold text-white">
              When someone reaches out, how quickly do you typically respond?
            </h2>
            <p className="text-slate-400">
              Think about inbound leads from your website, forms, or ads.
            </p>
            <div className="mt-3 space-y-2">
              {RESPONSE_SPEED_OPTIONS.map((option) => {
                const selected = form.responseSpeed === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => update("responseSpeed", option)}
                    className={`w-full rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                      selected
                        ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20"
                        : "border-white/10 bg-slate-800/30 text-white hover:border-white/20 hover:bg-slate-800/50"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {currentStep === "missedCalls" && (
          <>
            <h2 className="text-2xl font-bold text-white">
              Do you ever have missed calls or unanswered enquiries?
            </h2>
            <p className="text-slate-400">
              This helps understand how much value there might be in automation
              around follow-up.
            </p>
            <div className="mt-3 space-y-2">
              {MISSED_CALL_OPTIONS.map((option) => {
                const selected = form.missedCalls === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => update("missedCalls", option)}
                    className={`w-full rounded-xl border px-4 py-3.5 text-left text-sm transition ${
                      selected
                        ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20"
                        : "border-white/10 bg-slate-800/30 text-white hover:border-white/20 hover:bg-slate-800/50"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {currentStep === "additionalContext" && (
          <>
            <h2 className="text-2xl font-bold text-white">
              Anything else the AI should know about your business?
            </h2>
            <p className="text-slate-400">
              Share any specific problems, processes, or questions you have.
              The more context you give, the more tailored your report will be.
            </p>
            <textarea
              className="mt-3 w-full min-h-[120px] rounded-xl border border-white/10 bg-slate-800/50 px-4 py-3.5 text-white placeholder-slate-500 backdrop-blur-sm transition focus:border-indigo-500 focus:bg-slate-800/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
              placeholder="For example: “We’re losing leads because we don’t follow up quickly enough...” or “Is it realistic to automate XYZ without hiring engineers?”"
              value={form.additionalContext}
              onChange={(e) => update("additionalContext", e.target.value)}
            />
          </>
        )}
                </div>

                {error && (
                  <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4" role="alert">
                    <div className="flex items-start gap-3">
                      <svg className="h-5 w-5 shrink-0 mt-0.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-white/5 px-8 py-6 sm:px-12">
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={stepIndex === 0 || submitting}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-slate-400"
                  >
                    <svg className="h-4 w-4 transition group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>{stepIndex === 0 ? "" : "Back"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canContinue(currentStep) || submitting}
                    className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-xl hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                  >
                    <span className="relative z-10">
                      {submitting ? "Saving..." : stepIndex === STEPS.length - 1 ? "Generate my report" : "Continue"}
                    </span>
                    <svg className="relative z-10 h-4 w-4 transition group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
