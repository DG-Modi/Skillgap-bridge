'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronDown, Check, Scale, AlertTriangle, ArrowLeft, Cpu } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex-grow space-y-12">
      {/* Back button and Header */}
      <div className="space-y-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-xs font-semibold text-secondary">
            <Scale className="h-3.5 w-3.5" />
            Terms of Use
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Terms of Service
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            Please read these terms carefully before utilizing our automated skill analysis and interview mock-up services.
          </p>
          <div className="text-xs text-slate-400 font-medium">
            Last Updated: June 24, 2026
          </div>
        </div>
      </div>

      {/* Accordion container */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-soft border border-slate-100">
        {/* Accordion Trigger Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-6 sm:p-8 text-left bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-secondary flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base sm:text-lg">View Terms of Service</h2>
              <p className="text-xs text-slate-400 mt-0.5">Click to {isOpen ? 'collapse' : 'expand'} terms details</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-slate-400"
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </button>

        {/* Accordion Content */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className="p-6 sm:p-8 border-t border-slate-100/80 space-y-6 bg-white">
                <p className="text-sm font-semibold text-slate-700">
                  By using SkillSync AI, you agree to:
                </p>

                <ul className="space-y-5">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-slate-950 text-sm">Personal Career Development</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Use the service, roadmaps, and custom interview questions for personal skill analysis and exam/interview preparation only. Commercial resale or redistribution of AI feedback reports is prohibited.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-slate-950 text-sm">Respect API Usage Guidelines</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Not abuse, automate scraping, or flood the API endpoints (`/api/analyze`, `/api/interview`, `/api/interview/grade`). These endpoints run real-time AI inference and must remain open and available for all learning users.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-slate-950 text-sm">Verify AI Results Independently</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Accept that matched percentages, gaps identified, grading scores, and recommended course links are generated by Large Language Models (LLMs) and do not constitute professional certifications, legal guarantees, or official career validation.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-slate-950 text-sm">Verify External Learning Links</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Independent course recommendations and external website references (e.g. YouTube, freeCodeCamp, etc.) are compiled for your convenience. You are responsible for reviewing their licensing, pricing, and specific terms of use.
                      </p>
                    </div>
                  </li>
                </ul>

                {/* Disclaimer box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-100 flex gap-3 text-amber-800">
                  <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h5 className="font-bold text-xs sm:text-sm text-amber-900 uppercase tracking-wider">Limitation of Liability</h5>
                    <p className="text-xs leading-relaxed font-semibold">
                      The service is provided &quot;as is&quot; without warranties of any kind, either express or implied, including warranties of accuracy, completeness, or fitness for job placement.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User support details */}
      <div className="text-center text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
        If you have questions regarding these Terms, please reach out to us at <a href="mailto:support@skillgapbridge.ai" className="text-primary hover:underline">support@skillgapbridge.ai</a>.
      </div>
    </div>
  );
}
