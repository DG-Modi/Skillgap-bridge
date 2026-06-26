'use client';

import { motion, Variants } from 'framer-motion';
import { Database, Lock, EyeOff, ShieldCheck, ArrowLeft, RefreshCw, Cpu, Server } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex-grow space-y-12">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Project Privacy Policy
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-3xl">
            This policy outlines how data is managed in the SkillSync AI system. We prioritize local client-side safety and transparency regarding AI processing.
          </p>
          <div className="text-xs text-slate-400 font-medium">
            Last Updated: June 24, 2026
          </div>
        </div>
      </div>

      {/* Grid of Sections */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Data Collection Card */}
        <motion.div
          variants={itemVariants}
          className="glass-panel rounded-3xl p-6 md:p-8 shadow-soft flex flex-col justify-between hover:shadow-lg transition-all duration-350 border border-slate-100 hover:border-indigo-100"
        >
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center shadow-inner">
              <Database className="h-6 w-6" />
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">Data & Input Processing</h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                We collect and process only the minimal required text parameters to construct resume comparison profiles and run mock interview evaluations.
              </p>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-sm text-slate-600">
                  <strong>Scope:</strong> We only process data you explicitly input (pasted resume texts, target job roles, optional job descriptions, and typed interview answers).
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-sm text-slate-600">
                  <strong>AI Evaluation:</strong> Selected parameters are securely sent to third-party AI APIs (Groq API endpoints running Llama 3.3 inference) to generate the response schema.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-sm text-slate-600">
                  <strong>No Account Data:</strong> We do not ask for, collect, or process names, addresses, passwords, or payment cards.
                </span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Data Security Card */}
        <motion.div
          variants={itemVariants}
          className="glass-panel rounded-3xl p-6 md:p-8 shadow-soft flex flex-col justify-between hover:shadow-lg transition-all duration-350 border border-slate-100 hover:border-purple-100"
        >
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-secondary flex items-center justify-center shadow-inner">
              <Lock className="h-6 w-6" />
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">Data Security & Storage</h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                SkillSync AI is designed with a &quot;zero-database&quot; architecture. We do not store your professional files on our own servers.
              </p>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-secondary mt-2 shrink-0" />
                <span className="text-sm text-slate-600">
                  <strong>Zero DB Storage:</strong> We do not operate databases or cloud stores. Your resume and interview answers are never stored by us.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-secondary mt-2 shrink-0" />
                <span className="text-sm text-slate-600">
                  <strong>Encryption:</strong> All transmissions between your web browser and our Next.js API routes are protected by SSL/TLS encryption.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-secondary mt-2 shrink-0" />
                <span className="text-sm text-slate-600">
                  <strong>Groq API Compliance:</strong> Data sent to Groq for model inference is subject to Groq API policies, which restrict retaining inputs for training public models.
                </span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Your Rights Card */}
        <motion.div
          variants={itemVariants}
          className="glass-panel rounded-3xl p-6 md:p-8 shadow-soft flex flex-col justify-between hover:shadow-lg transition-all duration-350 border border-slate-100 hover:border-emerald-100"
        >
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-success flex items-center justify-center shadow-inner">
              <EyeOff className="h-6 w-6 text-success" />
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">Session & Local Memory</h2>
              <p className="text-slate-500 text-xs leading-relaxed">
                Because all active session information is held in memory, you retain absolute authority to delete or clear your workspace.
              </p>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <RefreshCw className="h-4.5 w-4.5 text-success shrink-0 mt-1" />
                <span className="text-sm text-slate-600">
                  <strong>Zustand Memory:</strong> Uploaded resume texts and AI-generated roadmaps reside in local React/Zustand client state.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <EyeOff className="h-4.5 w-4.5 text-success shrink-0 mt-1" />
                <span className="text-sm text-slate-600">
                  <strong>Immediate Deletion:</strong> Your data is automatically and permanently cleared when you close the browser tab or refresh the page.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Server className="h-4.5 w-4.5 text-success shrink-0 mt-1" />
                <span className="text-sm text-slate-600">
                  <strong>Reset Actions:</strong> You can explicitly purge all loaded states by navigating back to home or clicking reset buttons in the app.
                </span>
              </li>
            </ul>
          </div>
        </motion.div>
      </motion.div>

      {/* Technical architecture description banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <Cpu className="h-4 w-4" />
            Local-First Architectural Privacy
          </div>
          <h3 className="text-xl sm:text-2xl font-bold">How does the backend process my resume?</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            When you initiate a skill gap analysis or generate interview questions, the client-side state sends a JSON payload to our secure Next.js API routes (`/api/analyze` or `/api/interview`). The route acts as a gateway to request structural analysis from the Groq service using high-performance models (Llama 3.3). The response is immediately piped back to your screen and discarded from our server logs.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              Have Questions? Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
