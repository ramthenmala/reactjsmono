export function FooterLogo({ footerContent }: { footerContent: string }) {
  return (
    <div className='lg:col-span-1'>
      <div className='flex items-center gap-2 mb-4'>
        <img
          src='/assets/images/brand/logo.svg'
          alt='Logo'
          width={32}
          height={32}
          className='h-8 w-auto'
        />
      </div>
      <p className="text-white font-medium text-base leading-6 leading-relaxed max-w-[320px]">
        {footerContent}
      </p>
    </div>
  );
}
