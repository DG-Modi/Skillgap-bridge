'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FileText, 
  BarChart2, 
  Award, 
  BookOpen, 
  ChevronRight, 
  Upload, 
  Layers, 
  BrainCircuit, 
  Compass,
  ArrowRight,
  TrendingUp,
  UserCheck,
  Star,
  Zap
} from 'lucide-react';

const features = [
  {
    title: 'Analyze Skills',
    description: 'Extract and categorize all key competencies from your resume, identifying your core professional strengths.',
    icon: FileText,
    gradient: 'from-blue-500 to-indigo-500',
    path: '/analyze'
  },
  {
    title: 'Compare Job Roles',
    description: 'Benchmark your skills against standard industry roles to calculate match scores and detect qualifications gaps.',
    icon: BarChart2,
    gradient: 'from-indigo-500 to-purple-500',
    path: '/compare'
  },
  {
    title: 'Interview Preparation',
    description: 'Receive custom tech-round questions and simulated mock interviews based exactly on your profile skill gap.',
    icon: BrainCircuit,
    gradient: 'from-purple-500 to-pink-500',
    path: '/interview'
  },
  {
    title: 'Personalized Recommendations',
    description: 'Get tailored online courses, industry certifications, and project ideas specifically selected to close your gaps.',
    icon: BookOpen,
    gradient: 'from-pink-500 to-rose-500',
    path: '/recommendations'
  }
];

const systemSpecs = [
  { value: 'Llama 3.3', label: 'AI Evaluation Model', icon: BrainCircuit, desc: 'State-of-the-art semantic matching' },
  { value: 'Zero Storage', label: 'Data Architecture', icon: Layers, desc: 'Privacy-focused local execution' },
  { value: '500+ Skills', label: 'Evaluation Scope', icon: Zap, desc: 'Spans engineering, design, and product' },
  { value: '25+ Careers', label: 'Transition Matrices', icon: Compass, desc: 'Supports frontend, DevOps, data science, etc.' }
];

const steps = [
  { number: '01', title: 'Upload Resume', desc: 'Drag and drop your PDF resume to extract skills.' },
  { number: '02', title: 'Add Job Description', desc: 'Specify your target role or paste a job posting.' },
  { number: '03', title: 'AI Analysis', desc: 'Our engine identifies missing skills and scores compatibility.' },
  { number: '04', title: 'Improve & Apply', desc: 'Prepare with AI mock interviews and bridge gaps.' }
];

const caseStudies = [
  {
    scenario: "Developer Pathway",
    description: "A candidate uploads a React frontend resume and targets a Full-Stack Engineer role. The AI analysis engine flags Postgres and Docker as critical missing gaps, generating custom coding tasks and structured learning paths.",
    title: "Frontend to Full-Stack",
    target: "Target Role: Full-Stack Engineer",
    path: "Engineering",
    avatarBg: "bg-blue-100 text-blue-700",
    initials: "FE"
  },
  {
    scenario: "Analytics Pathway",
    description: "A data analyst tests their profile. The mock interview engine compiles specialized coding questions on SQL queries. The grader evaluates their typed answer against ideal answers, providing feedback scoring.",
    title: "Data Analyst Alignment",
    target: "Target Role: Data Scientist",
    path: "Data Science",
    avatarBg: "bg-purple-100 text-purple-700",
    initials: "DA"
  },
  {
    scenario: "Management Pathway",
    description: "A non-technical specialist evaluates matching against a Product Manager role. The system identifies Agile process gaps and matches AWS Educate and Coursera learning programs to bridge the gap.",
    title: "Specialist to Product Lead",
    target: "Target Role: Product Manager",
    path: "Product Management",
    avatarBg: "bg-pink-100 text-pink-700",
    initials: "PM"
  }
];

export default function Home() {
  return (
    <div className="w-full overflow-hidden bg-background-app flex flex-col">
      {/* 1. Hero Section */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 bg-card-bg border-b border-border-color">
        {/* Background Gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-70 pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-secondary/5 rounded-full filter blur-3xl opacity-70 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline & Description */}
            <div className="lg:col-span-6 text-left space-y-6 md:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-full text-xs font-semibold text-primary"
              >
                <Award className="h-3.5 w-3.5" />
                <span>Next-Gen AI Career Companion</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-app leading-[1.1]"
              >
                Bridge Your <br />
                <span className="gradient-text">Skill Gap</span> with AI
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl"
              >
                Upload your resume, compare it with any job role, discover missing skills, prepare for interviews, and accelerate your career growth.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-start"
              >
                <Link
                  href="/analyze"
                  className="inline-flex justify-center items-center gap-2 bg-primary hover:bg-primary/95 text-white px-6 py-3.5 rounded-2xl text-base font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 duration-200"
                >
                  Start Free Analysis
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex justify-center items-center gap-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3.5 rounded-2xl text-base font-semibold border border-border-color transition-colors"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Skill Bridging Visualization */}
            <div className="lg:col-span-6 flex justify-center items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative w-full max-w-[420px]"
              >
                {/* Decorative glowing background */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 to-orange-500 opacity-20 blur-lg animate-pulse" />
                
                {/* Skill Bridge Image Container */}
                <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 bg-slate-900/5 p-2 hover:scale-[1.01] transition-transform duration-300">
                  <img
                    src="/skill_bridge_visual.png"
                    alt="SkillSync AI - Skill Gap Analyzer Visualization"
                    className="w-full h-auto rounded-2xl object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Cards Section */}
      <section className="py-20 md:py-28 bg-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-app tracking-tight">
              Powerful Core Features
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Everything you need to discover professional opportunities, upskill, and ace your interviews in one SaaS platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex flex-col h-full bg-card-bg rounded-3xl p-6 text-left border border-border-color shadow-soft relative overflow-hidden group hover:border-indigo-100"
                >
                  {/* Top Gradient Stripe */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${feature.gradient}`} />
                  
                  {/* Icon Box */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-md`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-bold text-text-app mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                    {feature.description}
                  </p>

                  <Link
                    href={feature.path}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:text-primary/80 transition-colors mt-auto"
                  >
                    Try Feature
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Platform Statistics Section */}
      <section className="py-16 md:py-24 bg-slate-50/50 dark:bg-slate-950/20 border-y border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {systemSpecs.map((spec, idx) => {
              const Icon = spec.icon;
              return (
                <div 
                  key={idx}
                  className="bg-card-bg rounded-2xl p-6 border border-border-color shadow-soft flex items-center gap-5 hover:border-slate-300 dark:hover:border-indigo-500/30 transition-colors"
                >
                  <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl text-primary shrink-0">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-text-app tracking-tight">
                      {spec.value}
                    </div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {spec.label}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {spec.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="py-20 md:py-28 bg-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-app tracking-tight">
              How It Works
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Get detailed AI career reports and personalized roadmap preparation in 4 easy steps.
            </p>
          </div>

          <div className="relative">
            {/* Visual connecting line for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-4 right-4 h-0.5 bg-border-color -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-card-bg border border-border-color rounded-3xl p-6 text-left shadow-soft hover:shadow-md transition-shadow relative"
                >
                  {/* Step Number Bubble */}
                  <div className="absolute -top-5 left-6 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {step.number}
                  </div>

                  <div className="pt-4 space-y-3">
                    <h3 className="text-lg font-bold text-text-app">{step.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Case Studies Section */}
      <section className="py-20 md:py-28 bg-slate-50/50 dark:bg-slate-950/20 border-t border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-app tracking-tight">
              Career Transition Case Studies
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Explore how the platform analyzes, grades, and recommends pathways for typical user profiles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((test, idx) => (
              <div
                key={idx}
                className="bg-card-bg rounded-3xl p-8 border border-border-color shadow-soft text-left flex flex-col justify-between hover:border-slate-300 dark:hover:border-indigo-500/30 transition-colors"
              >
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 text-xs font-bold text-primary">
                    {test.scenario}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {test.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${test.avatarBg}`}>
                    {test.initials}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-text-app text-sm">{test.title}</h4>
                    <p className="text-xs text-slate-400 font-medium">
                      {test.target} &middot; <span className="text-slate-500 font-semibold">{test.path}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call-To-Action Section */}
      <section className="py-20 md:py-24 bg-card-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            whileHover={{ scale: 1.002 }}
            className="gradient-bg rounded-[32px] p-8 md:p-16 text-center text-white relative overflow-hidden shadow-xl"
          >
            {/* Soft decorative shapes */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6 md:space-y-8">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                Ready to Bridge Your Skill Gap?
              </h2>
              <p className="text-indigo-100 text-base md:text-lg leading-relaxed max-w-lg mx-auto">
                Upload your resume now to calculate your compatibility percentage and start custom AI preparation.
              </p>
              <div>
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-primary px-8 py-4 rounded-2xl text-base font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 duration-200"
                >
                  Start Free Analysis
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
