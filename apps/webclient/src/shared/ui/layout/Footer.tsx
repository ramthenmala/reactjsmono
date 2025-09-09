import { useState, useEffect } from 'react';
import { navigationService } from '../../services/navigationService';
import type { NavigationData } from '../../types/navigation';
import { FooterLogo } from './FooterLogo';
import { FooterNavLinks } from './FooterNavLinks';
import { FooterSocialLinks } from './FooterSocialLinks';
import { FooterBottom } from './FooterBottom';

export function Footer() {
  const [navigationData, setNavigationData] = useState<NavigationData | null>(
    null,
  );

  // Fetch navigation data on component mount
  useEffect(() => {
    const loadNavigationData = async () => {
      try {
        const data = await navigationService.getNavigationData();
        setNavigationData(data);
      } catch (error) {
        console.error('Failed to load navigation data:', error);
        // Set empty navigation data on failure
        setNavigationData({
          header: [],
          footer: {
            footerContent: '',
            copyrightText: '',
            quickLinks: [],
            legalPages: [],
            socialLinks: [],
          },
        });
      }
    };

    loadNavigationData();
  }, []);

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
          <FooterLogo navigationData={navigationData} />

          {/* Right Half - Menu and Social */}
          <div className='lg:col-span-1'>
            <div className='grid grid-cols-2 md:grid-cols-3 gap-8'>
              <FooterNavLinks navigationData={navigationData} />
              <FooterSocialLinks navigationData={navigationData} />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <FooterBottom navigationData={navigationData} />
      </div>
    </footer>
  );
}
