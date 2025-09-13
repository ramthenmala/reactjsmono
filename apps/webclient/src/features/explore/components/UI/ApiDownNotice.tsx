import { Hero } from '../../../../shared/ui/components/Hero';

interface ApiDownNoticeProps {
  'data-qa-id'?: string;
}

export function ApiDownNotice({ 'data-qa-id': dataQaId = 'api-down-notice' }: ApiDownNoticeProps = {}) {
  return (
    <main className='flex min-h-dvh flex-col bg-gradient-to-b from-white via-[#FAF9FF] to-[#FAF9FF]' data-qa-id={dataQaId}>
      <Hero
        title="Service temporarily unavailable"
        subtitle="We couldn't reach the backend. Please start CMS & API locally, or use mock env:"
        data-qa-id={`${dataQaId}-hero`}
      />
      <section className='flex flex-1 items-center justify-center px-6 py-16' data-qa-id={`${dataQaId}-content`}>
        <div className='w-full max-w-xl text-center' data-qa-id={`${dataQaId}-container`}>
          <h2 className='text-2xl font-semibold text-[#171B23]' data-qa-id={`${dataQaId}-title`}>
            Service temporarily unavailable
          </h2>
          <p className='mt-3 text-sm text-[#667085]' data-qa-id={`${dataQaId}-message`}>
            We couldn&apos;t reach the backend. Please start CMS & API locally, or
            use mock env:
            <br />
          </p>

          <div className='mt-6 flex items-center justify-center gap-3' data-qa-id={`${dataQaId}-actions`}>
            {/* simple refresh without client handlers in an RSC */}
            <a href='' className='rounded-xl bg-[#5547B5] px-5 py-2 text-white' data-qa-id={`${dataQaId}-retry-button`}>
              Retry
            </a>
            <a href='/' className='rounded-xl border px-5 py-2 text-sm' data-qa-id={`${dataQaId}-home-button`}>
              Go Home
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
