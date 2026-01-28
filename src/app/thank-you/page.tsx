export default function ThankYouPage() {
  return (
    <main className="w-full max-w-xl rounded-2xl bg-white shadow-md border border-zinc-100 px-5 py-6 sm:px-8 sm:py-8">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Are You AI Ready?
        </p>
        <h1 className="text-2xl font-semibold text-zinc-900">
          Thank you — we&apos;re generating your report.
        </h1>
        <p className="text-sm text-zinc-600">
          We&apos;ve received your answers and will now run them through our AI
          agents. Once your AI readiness report is ready, we&apos;ll email you a{" "}
          <span className="font-medium text-zinc-900">
            secure magic link
          </span>{" "}
          so you can view it any time.
        </p>
        <div className="mt-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
          You can safely close this window. If you don&apos;t see an email within a
          reasonable time, check your spam folder or try submitting the form
          again with the same email address to resend your link.
        </div>
      </div>
    </main>
  );
}

