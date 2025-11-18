'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export function GlobalFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PG</span>
              </div>
              <span className="ml-2 text-xl font-bold">{t('common.welcome')}</span>
            </div>
            <p className="text-gray-400 text-sm">
              {t('navigation.madeWithLove')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/governance/world-perspective" className="hover:text-white transition-colors">
                {t('navigation.worldPerspective')}
              </Link></li>
              <li><Link href="/governance/new-india-vision" className="hover:text-white transition-colors">
                {t('navigation.newIndia')}
              </Link></li>
              <li><Link href="/quiz-opinion" className="hover:text-white transition-colors">
                {t('navigation.quiz')}
              </Link></li>
              <li><Link href="/governance/opinion-polls" className="hover:text-white transition-colors">
                {t('navigation.polls')}
              </Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">{t('footer.aboutUs')}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('footer.contactUs')}</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t('footer.termsOfService')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contactUs')}</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>{t('footer.contactEmail')}</p>
              <p>{t('footer.contactPhone')}</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Public Governance Platform. {t('navigation.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}