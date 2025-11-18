'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export function GlobalHeader() {
  const { t } = useLanguage();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PG</span>
            </div>
            <span className="ml-2 text-xl font-bold">{t('common.welcome')}</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            {/* Voting System Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                {t('navigation.votingSystem')}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link href="/voting/international-issues" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    {t('voting.internationalIssues')}
                  </Link>
                  <Link href="/voting/national-issues" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    {t('voting.nationalIssues')}
                  </Link>
                  <Link href="/voting/state-issues" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    {t('voting.stateIssues')}
                  </Link>
                  <Link href="/voting/district-issues" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    {t('voting.districtIssues')}
                  </Link>
                  <Link href="/voting/taluka-issues" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    {t('voting.talukaIssues')}
                  </Link>
                  <Link href="/voting/village-issues" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    {t('voting.villageIssues')}
                  </Link>
                  <Link href="/voting/street-issues" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                    {t('voting.streetIssues')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Governance Links */}
            <Link href="/governance/world-perspective" className="text-gray-700 hover:text-blue-600 font-medium">
              {t('navigation.worldPerspective')}
            </Link>
            <Link href="/governance/new-india-vision" className="text-gray-700 hover:text-blue-600 font-medium">
              {t('navigation.newIndia')}
            </Link>
            <Link href="/quiz-opinion" className="text-gray-700 hover:text-blue-600 font-medium">
              {t('navigation.quiz')}
            </Link>
            <Link href="/governance/opinion-polls" className="text-gray-700 hover:text-blue-600 font-medium">
              {t('navigation.polls')}
            </Link>
          </nav>

          {/* Language Switcher */}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}