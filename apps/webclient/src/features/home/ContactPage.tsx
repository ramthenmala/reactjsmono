import React from 'react';
import { useLocaleTranslation } from '../../shared/lib/i18n';

export function ContactPage() {
  const { t, currentLanguage } = useLocaleTranslation();

  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {t('contact.title') || 'Contact Us'}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('contact.subtitle') || 'Get in touch with our industrial investment experts'}
          </p>
          
          <div className="bg-gray-50 p-8 rounded-lg">
            <p className="text-gray-600 mb-4">
              Current Language: <span className="font-semibold">{currentLanguage.toUpperCase()}</span>
            </p>
            <p className="text-gray-600">
              This is the Contact page placeholder. Full contact form and functionality will be implemented in Phase 2.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}