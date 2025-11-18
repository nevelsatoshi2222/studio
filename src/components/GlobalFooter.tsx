
'use client';

import React from 'react';
import Link from 'next/link';

export function GlobalFooter() {
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
              <span className="ml-2 text-xl font-bold">Public Governance</span>
            </div>
            <p className="text-gray-400 text-sm">
              Made with ❤️ for better governance
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/governance/world-perspective" className="hover:text-white transition-colors">
                World Perspective
              </Link></li>
              <li><Link href="/governance/new-india-vision" className="hover:text-white transition-colors">
                New India Vision
              </Link></li>
              <li><Link href="/quiz-opinion" className="hover:text-white transition-colors">
                Quiz & Opinion
              </Link></li>
              <li><Link href="/governance/opinion-polls" className="hover:text-white transition-colors">
                Opinion Polls
              </Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>contact@governance.org</p>
              <p>+91-XXXXX-XXXXX</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Public Governance Platform. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
