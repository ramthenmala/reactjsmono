import { Hero } from '../../../shared/ui/components/Hero';

export function ApiDownNotice() {
  return (
    <main className="flex min-h-dvh flex-col bg-gradient-to-b from-white via-[#FAF9FF] to-[#FAF9FF]">
      <Hero
        title="Service temporarily unavailable"
        subtitle="We couldn’t reach the backend. Please start CMS & API locally, or use mock env:"
      />
      <section className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl text-center">
          <h2 className="text-2xl font-semibold text-[#171B23]">
            Service temporarily unavailable
          </h2>
          <p className="mt-3 text-sm text-[#667085]">
            We couldn’t reach the backend. Please start CMS & API locally, or
            use mock env:
            <br />
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            {/* simple refresh without client handlers in an RSC */}
            <a href="" className="rounded-xl bg-[#5547B5] px-5 py-2 text-white">
              Retry
            </a>
            <a href="/" className="rounded-xl border px-5 py-2 text-sm">
              Go Home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
