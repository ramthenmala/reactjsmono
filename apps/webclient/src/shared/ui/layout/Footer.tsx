import React from 'react';
import { Link } from 'react-router-dom';
import { useLocaleTranslation } from '../../lib/i18n';

export function Footer() {
    const { t } = useLocaleTranslation();

    return (
        <footer className="relative text-white overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0">
                <img
                    src="/assets/images/backgrounds/bg.jpg"
                    alt="Footer background"
                    className="w-full h-full object-cover"
                />
                {/* Dark overlay with custom color */}
                <div className="absolute inset-0 bg-[#101319] opacity-80"></div>
            </div>

            <div className="container relative z-10 mx-auto py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Left Half - Logo and Text */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <img
                                src="/assets/images/brand/logo.svg"
                                alt="Logo"
                                width={32}
                                height={32}
                                className="h-8 w-auto"
                            />
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed max-w-[320px]">
                            {t('footer.description') || 'Your gateway to industrial investment in Saudi Arabia.'}
                        </p>
                    </div>

                    {/* Right Half - Menu and Social */}
                    <div className="lg:col-span-1">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            {/* Quick Links */}
                            <div>
                                <h3 className="font-semibold mb-4">
                                    {t('footer.quick_links') || 'Quick Links'}
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li><Link to="/explore" className="hover:text-white transition-colors">{t('navigation.explore') || 'Explore'}</Link></li>
                                    <li><Link to="/sectors" className="hover:text-white transition-colors">Sectors</Link></li>
                                    <li><Link to="/regions" className="hover:text-white transition-colors">Regions</Link></li>
                                    <li><Link to="/contact" className="hover:text-white transition-colors">{t('navigation.contact_us') || 'Contact Us'}</Link></li>
                                </ul>
                            </div>

                            {/* Legal Links */}
                            <div>
                                <h3 className="font-semibold mb-4">
                                    {t('footer.legal') || 'Legal'}
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-300">
                                    <li><Link to="/terms" className="hover:text-white transition-colors">{t('footer.terms') || 'Terms of Service'}</Link></li>
                                    <li><Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacy') || 'Privacy Policy'}</Link></li>
                                    <li><Link to="/cookies" className="hover:text-white transition-colors">{t('footer.cookies') || 'Cookie Policy'}</Link></li>
                                </ul>
                            </div>

                            {/* Social Media */}
                            <div>
                                <h3 className="font-semibold mb-4">
                                    {t('footer.follow_us') || 'Follow Us'}
                                </h3>
                                <div className="flex gap-6">
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_290_5459)">
                                                <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z" fill="white" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_290_5459">
                                                    <rect width="24" height="24" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </a>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M15.9455 23L10.396 15.0901L3.44886 23H0.509766L9.09209 13.2311L0.509766 1H8.05571L13.286 8.45502L19.8393 1H22.7784L14.5943 10.3165L23.4914 23H15.9455ZM19.2185 20.77H17.2398L4.71811 3.23H6.6971L11.7121 10.2532L12.5793 11.4719L19.2185 20.77Z" fill="white" />
                                        </svg>
                                    </a>
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_290_5463)">
                                                <path d="M22.2234 0H1.77187C0.792187 0 0 0.773438 0 1.72969V22.2656C0 23.2219 0.792187 24 1.77187 24H22.2234C23.2031 24 24 23.2219 24 22.2703V1.72969C24 0.773438 23.2031 0 22.2234 0ZM7.12031 20.4516H3.55781V8.99531H7.12031V20.4516ZM5.33906 7.43438C4.19531 7.43438 3.27188 6.51094 3.27188 5.37187C3.27188 4.23281 4.19531 3.30937 5.33906 3.30937C6.47813 3.30937 7.40156 4.23281 7.40156 5.37187C7.40156 6.50625 6.47813 7.43438 5.33906 7.43438ZM20.4516 20.4516H16.8937V14.8828C16.8937 13.5562 16.8703 11.8453 15.0422 11.8453C13.1906 11.8453 12.9094 13.2937 12.9094 14.7891V20.4516H9.35625V8.99531H12.7687V10.5609H12.8156C13.2891 9.66094 14.4516 8.70938 16.1813 8.70938C19.7859 8.70938 20.4516 11.0813 20.4516 14.1656V20.4516Z" fill="white" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_290_5463">
                                                    <rect width="24" height="24" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </a>
                                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M23.7609 7.1998C23.7609 7.1998 23.5266 5.54512 22.8047 4.81855C21.8906 3.8623 20.8688 3.85762 20.4 3.80137C17.0438 3.55762 12.0047 3.55762 12.0047 3.55762H11.9953C11.9953 3.55762 6.95625 3.55762 3.6 3.80137C3.13125 3.85762 2.10938 3.8623 1.19531 4.81855C0.473438 5.54512 0.24375 7.1998 0.24375 7.1998C0.24375 7.1998 0 9.14512 0 11.0857V12.9045C0 14.8451 0.239062 16.7904 0.239062 16.7904C0.239062 16.7904 0.473437 18.4451 1.19062 19.1717C2.10469 20.1279 3.30469 20.0951 3.83906 20.1982C5.76094 20.3811 12 20.4373 12 20.4373C12 20.4373 17.0438 20.4279 20.4 20.1889C20.8688 20.1326 21.8906 20.1279 22.8047 19.1717C23.5266 18.4451 23.7609 16.7904 23.7609 16.7904C23.7609 16.7904 24 14.8498 24 12.9045V11.0857C24 9.14512 23.7609 7.1998 23.7609 7.1998ZM9.52031 15.1123V8.36699L16.0031 11.7514L9.52031 15.1123Z" fill="white" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        {/* Official Logos */}
                        <div className="flex flex-wrap items-center gap-6">
                            {/* Ministry Logo */}
                            <div className="flex items-center gap-3">
                                <img
                                    src="/assets/images/brand/ministry-of-industry-and-mineral-resources-seek-logo.svg"
                                    alt="Ministry of Industry and Mineral Resources"
                                    width={100}
                                    height={32}
                                    className="h-8 w-auto"
                                />
                            </div>

                            {/* Vision 2030 Logo */}
                            <div className="flex items-center gap-3">
                                <img
                                    src="/assets/images/brand/vision-2030-kingdom-of-saudi-arabia-logo.svg"
                                    alt="Vision 2030 Kingdom of Saudi Arabia"
                                    width={100}
                                    height={32}
                                    className="h-8 w-auto"
                                />
                            </div>

                            {/* Digital Government Authority */}
                            <div className="flex items-center gap-3">
                                <img
                                    src="/assets/images/brand/registered-on-digital-government-authority-logo.svg"
                                    alt="Digital Government Authority"
                                    width={100}
                                    height={32}
                                    className="h-8 w-auto"
                                />
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="text-sm text-gray-400 text-center lg:text-right">
                            {t('footer.copyright') || '© 2024 Compass. All rights reserved.'}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}