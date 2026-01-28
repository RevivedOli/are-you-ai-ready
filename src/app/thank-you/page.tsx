import Link from "next/link";

export default function ThankYouPage() {
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

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-3xl">
          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl transition duration-1000 group-hover:opacity-30" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
              {/* Success checkmark circle */}
              <div className="flex justify-center pt-12 pb-6 opacity-0 animate-thank-you-scale-in">
                <div className="relative">
                  <div className="absolute inset-0 scale-150 rounded-full bg-indigo-500/20 blur-2xl" aria-hidden />
                  <div className="absolute inset-0 scale-125 rounded-full bg-indigo-500/30 blur-xl animate-pulse" aria-hidden />
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl shadow-indigo-500/50">
                    <svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path className="thank-you-checkmark-path" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="px-8 py-10 text-center sm:px-12">
                <div className="space-y-6">
                  {/* Badge */}
                  <div className="flex justify-center opacity-0 animate-thank-you-fade-in-up thank-you-delay-200">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Submission Successful
                    </div>
                  </div>

                  {/* Heading */}
                  <div className="space-y-3 opacity-0 animate-thank-you-fade-in-up thank-you-delay-300">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                      Thank You!
                    </h1>
                    <p className="mx-auto max-w-2xl text-xl text-slate-300">
                      We&apos;ve received your information and are preparing your personalized AI readiness report.
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="mx-auto flex max-w-md items-center gap-4 py-4 opacity-0 animate-thank-you-fade-in thank-you-delay-400">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                    <div className="h-2 w-2 rounded-full bg-indigo-500" />
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                  </div>

                  {/* Info cards */}
                  <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 pt-4 opacity-0 animate-thank-you-fade-in-up thank-you-delay-500 sm:grid-cols-3">
                    <div className="group/card relative overflow-hidden rounded-xl border border-white/10 bg-slate-800/30 p-6 transition hover:border-indigo-400/30 hover:bg-slate-800/50">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 transition group-hover/card:opacity-100" aria-hidden />
                      <div className="relative space-y-3">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-white">Analyzing</h3>
                        <p className="text-sm text-slate-400">Our AI is reviewing your business details</p>
                      </div>
                    </div>
                    <div className="group/card relative overflow-hidden rounded-xl border border-white/10 bg-slate-800/30 p-6 transition hover:border-indigo-400/30 hover:bg-slate-800/50">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 transition group-hover/card:opacity-100" aria-hidden />
                      <div className="relative space-y-3">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-white">Generating</h3>
                        <p className="text-sm text-slate-400">Creating your custom recommendations</p>
                      </div>
                    </div>
                    <div className="group/card relative overflow-hidden rounded-xl border border-white/10 bg-slate-800/30 p-6 transition hover:border-indigo-400/30 hover:bg-slate-800/50">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 transition group-hover/card:opacity-100" aria-hidden />
                      <div className="relative space-y-3">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-500/10 text-pink-400">
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="font-semibold text-white">Delivering</h3>
                        <p className="text-sm text-slate-400">Your report will arrive via email</p>
                      </div>
                    </div>
                  </div>

                  {/* What happens next */}
                  <div className="mx-auto max-w-2xl pt-8 opacity-0 animate-thank-you-fade-in-up thank-you-delay-600">
                    <div className="space-y-6 rounded-2xl border border-white/10 bg-slate-800/30 p-8 text-left">
                      <div className="flex items-center gap-3">
                        <div className="h-1 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                        <h2 className="text-xl font-bold text-white">What happens next?</h2>
                      </div>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-500/10 text-sm font-bold text-indigo-400">
                            1
                          </div>
                          <div>
                            <h3 className="mb-1 font-semibold text-white">AI Analysis</h3>
                            <p className="text-sm text-slate-400">
                              Our AI will analyze your business context, industry, and goals to identify the most impactful opportunities.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-purple-400/20 bg-purple-500/10 text-sm font-bold text-purple-400">
                            2
                          </div>
                          <div>
                            <h3 className="mb-1 font-semibold text-white">Custom Report Generation</h3>
                            <p className="text-sm text-slate-400">
                              We&apos;ll create a comprehensive report with tailored AI solutions, implementation roadmap, and ROI projections specific to your business.
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-pink-400/20 bg-pink-500/10 text-sm font-bold text-pink-400">
                            3
                          </div>
                          <div>
                            <h3 className="mb-1 font-semibold text-white">Email Delivery</h3>
                            <p className="text-sm text-slate-400">
                              You&apos;ll receive your personalized AI readiness report within 24–48 hours, along with next steps for implementation.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-white/5 pt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Estimated delivery</span>
                          <span className="font-semibold text-indigo-400">24–48 hours</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col justify-center gap-4 pt-8 opacity-0 animate-thank-you-fade-in-up thank-you-delay-600 sm:flex-row">
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-800/50 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-slate-800/80"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Return to homepage
                    </Link>
                    <Link
                      href="/#contact"
                      className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-xl hover:shadow-indigo-500/40"
                    >
                      <span className="relative z-10">Have questions? Contact us</span>
                      <svg className="relative z-10 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>

                  {/* Footer note */}
                  <div className="pt-8 opacity-0 animate-thank-you-fade-in thank-you-delay-600">
                    <p className="text-sm text-slate-500">
                      Don&apos;t see our email? Check your spam folder or{" "}
                      <Link href="/#contact" className="text-indigo-400 underline underline-offset-2 transition hover:text-indigo-300">
                        contact us
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
