import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="bg-[#0B0F19] text-slate-300 border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About Info */}
          <div className="space-y-4">
            <Link href="/" className="group flex items-center dark">
              <Logo showText={true} iconSize={42} textColor="text-slate-100" />
            </Link>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Accelerate your professional growth by identifying skill gaps, preparing with real-world AI mock interviews, and exploring curated paths.
            </p>
          </div>

          {/* Core Features Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Features</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/analyze" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Analyze Skills
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Compare Roles
                </Link>
              </li>
              <li>
                <Link href="/interview" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Personalized Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Nav Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-indigo-400 shrink-0" />
                <span className="text-sm text-slate-400">support@skillgapbridge.ai</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-indigo-400 shrink-0" />
                <span className="text-sm text-slate-400">+91 98251 17231</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Powered by AI. Crafted by NextGen Hoppers.All Rights Reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
