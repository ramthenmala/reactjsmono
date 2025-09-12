import { FooterLogo } from './FooterLogo';
import { FooterNavLinks } from './FooterNavLinks';
import { FooterSocialLinks } from './FooterSocialLinks';
import { FooterBottom } from './FooterBottom';
import { IFooter } from '@/shared/types';

export function Footer({footerContent, copyrightText, quickLinks, legalPages, socialLinks }: IFooter) {
  return (
    <footer className='relative text-white overflow-hidden' data-qa-id="footer">
      {/* Background image */}
      <div className='absolute inset-0' data-qa-id="footer-background">
        <img
          src='/assets/images/backgrounds/bg.jpg'
          alt='Footer background'
          className='w-full h-full object-cover'
          data-qa-id="footer-background-image"
        />
        {/* Dark overlay with custom color */}
        <div className='absolute inset-0 bg-[#101319] opacity-80' data-qa-id="footer-background-overlay"></div>
      </div>

      <div className='container relative z-10 mx-auto py-12' data-qa-id="footer-container">
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12' data-qa-id="footer-main-content">
          {/* Left Half - Logo and Text */}
          <FooterLogo footerContent={footerContent} />

          {/* Right Half - Menu and Social */}
          <div className="lg:col-span-1" data-qa-id="footer-right-section">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8" data-qa-id="footer-links-grid">
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
