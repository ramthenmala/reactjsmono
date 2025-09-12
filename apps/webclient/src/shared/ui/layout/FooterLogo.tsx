export function FooterLogo({ footerContent }: { footerContent: string }) {
  return (
    <div className='lg:col-span-1' data-qa-id="footer-logo-section">
      <div className='flex items-center gap-2 mb-4' data-qa-id="footer-logo-container">
        <img
          src='/assets/images/brand/logo.svg'
          alt='Logo'
          width={32}
          height={32}
          className='h-8 w-auto'
          data-qa-id="footer-logo"
        />
      </div>
      <p className="text-white font-medium text-base leading-6 leading-relaxed max-w-[320px]" data-qa-id="footer-content-text">
        {footerContent}
      </p>
    </div>
  );
}
