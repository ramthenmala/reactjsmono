import { FooterLogo } from './FooterLogo';
import { FooterNavLinks } from './FooterNavLinks';
import { FooterSocialLinks } from './FooterSocialLinks';
import { FooterBottom } from './FooterBottom';
import { IFooter } from '@/shared/types';

export function Footer({footerContent, copyrightText, quickLinks, legalPages, socialLinks }: IFooter) {
  return (
    <footer className='relative text-white overflow-hidden'>
      {/* Background image */}
      <div className='absolute inset-0'>
        <img
          src='/assets/images/backgrounds/bg.jpg'
          alt='Footer background'
          className='w-full h-full object-cover'
        />
        {/* Dark overlay with custom color */}
        <div className='absolute inset-0 bg-[#101319] opacity-80'></div>
      </div>

      <div className='container relative z-10 mx-auto py-12'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
          {/* Left Half - Logo and Text */}
          <FooterLogo footerContent={footerContent} />

          {/* Right Half - Menu and Social */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <FooterNavLinks quickLinks={quickLinks} legalPages={legalPages} />
              <FooterSocialLinks socialLinks={socialLinks} />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <FooterBottom copyrightText={copyrightText} />
      </div>
    </footer>
  );
}
