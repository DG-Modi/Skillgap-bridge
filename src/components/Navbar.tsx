'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Analyze Skills', path: '/analyze' },
  { name: 'Compare Roles', path: '/compare' },
  { name: 'Interview Prep', path: '/interview' },
  { name: 'Recommendations', path: '/recommendations' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for glass effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-navbar shadow-sm py-3'
          : 'bg-white/95 dark:bg-slate-900/95 border-b border-border-color py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="group flex items-center">
              <Logo showText={true} iconSize={42} />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
                    isActive
                      ? 'text-primary bg-primary/5 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Action */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 duration-200 cursor-pointer"
            >
              Start Analysis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden glass-panel border-b border-border-color animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-2 pb-4 space-y-1 sm:px-6">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/5 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            
            <div className="pt-4 border-t border-border-color space-y-4">
              <Link
                href="/analyze"
                onClick={() => setIsOpen(false)}
                className="w-full flex justify-center items-center gap-2 bg-primary hover:bg-primary/95 text-white px-5 py-3 rounded-xl text-base font-medium transition-all shadow-md cursor-pointer"
              >
                Start Analysis
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
