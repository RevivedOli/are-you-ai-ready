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
    <main className="w-full max-w-xl rounded-2xl bg-white shadow-md border border-zinc-100 px-5 py-6 sm:px-8 sm:py-8">
      <header className="mb-6 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Are You AI Ready?
            </p>
            <h1 className="mt-1 text-xl font-semibold text-zinc-900 sm:text-2xl">
              2‑minute AI readiness check
            </h1>
          </div>
          <span className="hidden rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 sm:inline-flex">
            ~2 minutes
          </span>
        </div>
        <p className="text-sm text-zinc-600">
          Answer a few focused questions about your business. The more detail you
          share, the more tailored your AI readiness report will be.
        </p>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span>
              Step {stepIndex + 1} of {STEPS.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-zinc-100">
            <div
              className="h-1.5 rounded-full bg-zinc-900 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <section className="min-h-[220px] space-y-4">
        {currentStep === "intro" && (
          <>
            <h2 className="text-lg font-semibold text-zinc-900">
              First, let’s start with your email.
            </h2>
            <p className="text-sm text-zinc-600">
              We’ll use this to send your completed report and a magic link so you
              can come back to it any time.
            </p>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-zinc-800">
                Work email
                <input
                  type="email"
                  autoComplete="email"
                  className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900 focus:bg-white"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                />
              </label>
              <label className="flex items-start gap-2 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-0"
                  checked={form.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                />
                <span>
                  I agree to share this information so you can generate an AI
                  readiness report for my business. You won’t spam or sell my data.
                </span>
              </label>
            </div>
          </>
        )}

        {currentStep === "industry" && (
          <>
            <h2 className="text-lg font-semibold text-zinc-900">
              What industry are you in?
            </h2>
            <p className="text-sm text-zinc-600">
              A simple description is enough – for example “B2B SaaS”, “retail
              ecommerce”, or “professional services”.
            </p>
            <input
              type="text"
              className="mt-3 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900 focus:bg-white"
              placeholder="e.g. B2B SaaS for finance"
              value={form.industry}
              onChange={(e) => update("industry", e.target.value)}
            />
          </>
        )}

        {currentStep === "website" && (
          <>
            <h2 className="text-lg font-semibold text-zinc-900">
              Do you have a website we can look at?
            </h2>
            <p className="text-sm text-zinc-600">
              Sharing your site lets the AI understand what you do, who you serve,
              and how you position yourself. If you don&apos;t have a site, just
              share your company name instead.
            </p>
            <div className="mt-3 space-y-3">
              <label className="block text-sm font-medium text-zinc-800">
                Website URL (preferred)
                <input
                  type="url"
                  className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900 focus:bg-white"
                  placeholder="https://yourcompany.com"
                  value={form.websiteUrl}
                  onChange={(e) => update("websiteUrl", e.target.value)}
                />
              </label>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="h-px flex-1 bg-zinc-200" />
                or
                <span className="h-px flex-1 bg-zinc-200" />
              </div>
              <label className="block text-sm font-medium text-zinc-800">
                Company name (if you don&apos;t have a website)
                <input
                  type="text"
                  className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900 focus:bg-white"
                  placeholder="e.g. Acme Consulting"
                  value={form.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                />
              </label>
            </div>
          </>
        )}

        {currentStep === "companySize" && (
          <>
            <h2 className="text-lg font-semibold text-zinc-900">
              How big is your company?
            </h2>
            <p className="text-sm text-zinc-600">
              A rough range is fine – this just helps size recommendations.
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {[
                { id: "small", label: "Small", hint: "Under 50 people" },
                { id: "medium", label: "Medium", hint: "50–500 people" },
                { id: "large", label: "Large", hint: "500+ people" },
              ].map((option) => {
                const selected = form.companySize === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      update("companySize", option.id as CompanySize)
                    }
                    className={`flex flex-col items-start rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                      selected
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400"
                    }`}
                  >
                    <span className="font-medium">{option.label}</span>
                    <span
                      className={`text-xs ${
                        selected ? "text-zinc-200" : "text-zinc-600"
                      }`}
                    >
                      {option.hint}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {currentStep === "aiAdoption" && (
          <>
            <h2 className="text-lg font-semibold text-zinc-900">
              How would you describe your current AI adoption?
            </h2>
            <p className="text-sm text-zinc-600">
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
                    className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                      selected
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400"
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div
                      className={`mt-0.5 text-xs ${
                        selected ? "text-zinc-200" : "text-zinc-600"
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
            <h2 className="text-lg font-semibold text-zinc-900">
              Do you have access to any AI or technical talent?
            </h2>
            <p className="text-sm text-zinc-600">
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
                    className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                      selected
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400"
                    }`}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div
                      className={`mt-0.5 text-xs ${
                        selected ? "text-zinc-200" : "text-zinc-600"
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
            <h2 className="text-lg font-semibold text-zinc-900">
              What are your top 1–2 business goals right now?
            </h2>
            <p className="text-sm text-zinc-600">
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
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400"
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
            <h2 className="text-lg font-semibold text-zinc-900">
              When someone reaches out, how quickly do you typically respond?
            </h2>
            <p className="text-sm text-zinc-600">
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
                    className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                      selected
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400"
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
            <h2 className="text-lg font-semibold text-zinc-900">
              Do you ever have missed calls or unanswered enquiries?
            </h2>
            <p className="text-sm text-zinc-600">
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
                    className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                      selected
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400"
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
            <h2 className="text-lg font-semibold text-zinc-900">
              Anything else the AI should know about your business?
            </h2>
            <p className="text-sm text-zinc-600">
              Share any specific problems, processes, or questions you have.
              The more context you give, the more tailored your report will be.
            </p>
            <textarea
              className="mt-3 w-full min-h-[120px] rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900 focus:bg-white"
              placeholder="For example: “We’re losing leads because we don’t follow up quickly enough...” or “Is it realistic to automate XYZ without hiring engineers?”"
              value={form.additionalContext}
              onChange={(e) => update("additionalContext", e.target.value)}
            />
          </>
        )}
      </section>

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <footer className="mt-6 flex flex-col gap-3 border-t border-zinc-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0 || submitting}
          className="text-sm font-medium text-zinc-600 disabled:cursor-not-allowed disabled:text-zinc-300"
        >
          {stepIndex === 0 ? "" : "Back"}
        </button>

        <button
          type="button"
          onClick={goNext}
          disabled={!canContinue(currentStep) || submitting}
          className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 sm:self-end"
        >
          {submitting
            ? "Saving..."
            : stepIndex === STEPS.length - 1
            ? "Submit and generate report"
            : "Next"}
        </button>
      </footer>
    </main>
  );
}
