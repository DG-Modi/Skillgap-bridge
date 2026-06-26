'use client';

import { Cpu, Terminal, Shield, Award, Sparkles, Server } from 'lucide-react';
import { motion } from 'framer-motion';

const values = [
  {
    title: 'AI-Powered Objectivity',
    description: 'We believe career evaluation should be based on real data, removing hiring biases by matching raw resume credentials to structural job components.',
    icon: Sparkles,
  },
  {
    title: 'Actionable Roadmaps',
    description: 'Pointing out skill gaps is only half the battle. We empower professionals with structured courses, projects, and simulations to actively close them.',
    icon: Award,
  },
  {
    title: 'Enterprise Scalability',
    description: 'Designed using high-performance API gateways, secure in-memory execution, and real-time inference streaming to support enterprise workloads.',
    icon: Shield,
  }
];

const systemPillars = [
  { category: 'User Experience', items: ['High-Performance UI Rendering', 'In-Memory Client State Sync', 'Fluid Interface Animations', 'Responsive Screen Adaptation', 'Client-Side Data Hydration'] },
  { category: 'Intelligence Pipeline', items: ['Dynamic Resume Semantic Check', 'Custom Q&A Question Generator', 'Context-Aware Study Paths', 'Granular Automated Scoring', 'Adaptive Performance Insights'] },
  { category: 'System Integrity', items: ['Secure Gateway Routing', 'In-Transit Payload Encryption', 'Strict Parameter Validation', 'Privacy-Aligned Session Pruning', 'Schema-Validated Outputs'] }
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16 flex-grow bg-background-app">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-primary font-bold text-xs uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 px-3 py-1 rounded-full">
          Our Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-text-app tracking-tight leading-tight">
          Bridging the gap between <span className="gradient-text">talent</span> and <span className="gradient-text">opportunity</span>.
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed">
          SkillSync AI was created to empower developers, analysts, and business professionals with clarity in their career paths. By leveraging state-of-the-art Large Language Models, we turn ambiguous job requirements into a clear learning curriculum.
        </p>
      </div>

      {/* Core values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((val, idx) => {
          const Icon = val.icon;
          return (
            <div 
              key={idx}
              className="bg-card-bg border border-border-color rounded-3xl p-6 shadow-soft hover:shadow-md transition-shadow space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 text-primary flex items-center justify-center">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-extrabold text-text-app text-base">{val.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{val.description}</p>
            </div>
          );
        })}
      </div>

      {/* System Details */}
      <div className="bg-card-bg border border-border-color rounded-[32px] p-8 md:p-12 shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold text-text-app">Modern Architecture</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Our platform leverages a modern, distributed architecture to deliver blazing-fast response times, interactive workflows, and secure, privacy-first evaluations.
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-border-color">
              Privacy-First
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-border-color">
              Real-Time AI
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-border-color">
              Secure In-Memory
            </span>
          </div>
        </div>

        {/* System Columns */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {systemPillars.map((pillar, idx) => (
            <div key={idx} className="bg-slate-50/50 dark:bg-slate-950/20 border border-border-color rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-text-app text-xs uppercase tracking-wider text-primary">
                {pillar.category}
              </h3>
              <ul className="space-y-2">
                {pillar.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="text-xs text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
