'use client';

import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Award, 
  Layers, 
  Clock, 
  ExternalLink, 
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
  Lock
} from 'lucide-react';

export default function RecommendationsPage() {
  const {
    resumeText,
    targetRole,
    recommendations,
    loadMockData
  } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10 flex-grow">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Personalized Growth Roadmap
        </h1>
        <p className="text-slate-500 text-base md:text-lg">
          We scanned your skill gaps and curated targeted educational resources, cert pathways, and portfolio projects to accelerate your growth.
        </p>
      </div>

      {/* Warning/Demo notice if no recommendations */}
      {!recommendations && (
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">No Action Plan Compiled</h3>
              <p className="text-slate-500 text-sm">
                To get a tailored upskilling curriculum, please analyze your resume or load the demo developer profile.
              </p>
            </div>
          </div>
          <button
            onClick={loadMockData}
            className="w-full md:w-auto shrink-0 bg-primary hover:bg-primary/95 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md transition-all"
          >
            Load Demo Recommendations
          </button>
        </div>
      )}

      {recommendations && (
        <div className="space-y-12 max-w-6xl mx-auto">
          {/* Target Role Banner */}
          <div className="bg-indigo-900 rounded-[24px] p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase">
                Active Target Role
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
                Roadmap to {targetRole}
              </h2>
            </div>
            <span className="text-xs text-indigo-200 font-semibold bg-white/5 px-4 py-2 rounded-xl border border-white/10">
              Compiled by AI Advisor
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Courses & Certifications */}
            <div className="lg:col-span-7 space-y-8">
              {/* Online Courses */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-slate-900">Curated Online Courses</h3>
                </div>

                <div className="space-y-4">
                  {recommendations.courses.map((course) => (
                    <div 
                      key={course.id}
                      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-soft hover:shadow-md transition-shadow space-y-3"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm md:text-base">
                            {course.title}
                          </h4>
                          <div className="flex gap-4 items-center text-xs text-slate-400 font-semibold mt-1">
                            <span>Platform: <span className="text-slate-600">{course.platform}</span></span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {course.duration}
                            </span>
                          </div>
                        </div>
                        
                        <a
                          href={course.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-slate-50 hover:bg-indigo-50 hover:text-primary rounded-xl border border-slate-200/60 transition-colors text-slate-500 shrink-0"
                          aria-label={`View course on ${course.platform}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>

                      {/* Course Skills Covered */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {course.skillsAddressed.map((skill, idx) => (
                          <span 
                            key={idx}
                            className="bg-indigo-50/60 border border-indigo-100/60 text-primary text-[10px] font-bold px-2 py-1 rounded-lg"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-secondary" />
                  <h3 className="text-lg font-bold text-slate-900">Recommended Certifications</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendations.certifications.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-soft flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{cert.title}</h4>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold px-2 py-0.5 rounded-lg">
                              {cert.cost}
                            </span>
                            {cert.link && (
                              <a
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-primary rounded-lg border border-slate-200/60 transition-colors text-slate-500"
                                aria-label={`View certification program`}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 font-semibold">
                          Issuer: {cert.issuer}
                        </p>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        {cert.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Hands-on Projects */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-500" />
                <h3 className="text-lg font-bold text-slate-900">Hands-on Portfolio Projects</h3>
              </div>

              <div className="space-y-6">
                {recommendations.projects.map((proj) => {
                  const isAdvanced = proj.difficulty === 'Advanced';
                  return (
                    <div 
                      key={proj.id}
                      className="bg-white border border-slate-100 rounded-2xl p-5 shadow-soft space-y-4"
                    >
                      {/* Project Header */}
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-bold text-slate-900 text-sm md:text-base leading-snug">{proj.title}</h4>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 ${
                            isAdvanced 
                              ? 'bg-rose-50 text-rose-700 border border-rose-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {proj.difficulty}
                          </span>
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-primary rounded-lg border border-slate-200/60 transition-colors text-slate-500"
                              aria-label={`View portfolio project`}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-500 text-xs leading-relaxed">
                        {proj.description}
                      </p>

                      {/* Tech stack */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tech Stack:</span>
                        <div className="flex flex-wrap gap-1">
                          {proj.techStack.map((tech, idx) => (
                            <span 
                              key={idx}
                              className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded-md"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Key features */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Specs:</span>
                        <ul className="space-y-1.5">
                          {proj.keyFeatures.map((feat, idx) => (
                            <li key={idx} className="flex gap-2 items-start text-xs text-slate-600">
                              <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
