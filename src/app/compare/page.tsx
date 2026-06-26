'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  BarChart2, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Info,
  ChevronRight,
  TrendingUp,
  Sliders,
  Sparkles
} from 'lucide-react';

export default function ComparePage() {
  const router = useRouter();
  const {
    resumeText,
    compareFits,
    loadMockData,
    setTargetRole,
    setAnalysisResult
  } = useStore();

  const [customRole, setCustomRole] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [localFits, setLocalFits] = useState(compareFits);

  // Sync state if store updates
  useState(() => {
    if (compareFits.length > 0) {
      setLocalFits(compareFits);
    }
  });

  const handleTargetRole = (roleName: string, fitPercent: number, missingSkills: string[]) => {
    // Set active target role in store
    setTargetRole(roleName);
    
    // Simulate updating active analysis results for that targeted role
    setAnalysisResult({
      matchPercentage: fitPercent,
      matchedSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Git', 'Jest', 'Responsive UI'].filter(
        (s) => !missingSkills.includes(s)
      ),
      missingSkills,
      categoryBreakdown: [
        { category: 'Frontend Alignment', score: fitPercent > 80 ? 95 : 75 },
        { category: 'System Architecture', score: fitPercent > 80 ? 80 : 40 },
        { category: 'Operations & DevOps', score: fitPercent > 60 ? 65 : 30 },
      ],
      actionPlan: missingSkills.map((skill) => `Acquire practical experience with ${skill} by building real-world projects.`)
    });

    router.push('/analyze');
  };

  const handleAddCustomRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRole.trim()) return;

    // Simulate match score for custom role
    const randomPercentage = Math.floor(Math.random() * (90 - 40 + 1)) + 40;
    const allPossibleMissing = [
      'Kubernetes', 'Docker', 'PostgreSQL', 'GraphQL API', 'Node.js/Express', 
      'Redis Caching', 'AWS S3', 'CI/CD Pipelines', 'System Design (Microservices)',
      'TypeScript', 'Next.js 15', 'Python', 'Go Programming', 'Unit Testing (Jest)'
    ];
    // Shuffle and pick missing skills
    const missingCount = Math.floor(Math.random() * 5) + 3;
    const missingSkills = [...allPossibleMissing]
      .sort(() => 0.5 - Math.random())
      .slice(0, missingCount);

    const newFit = {
      roleName: customRole,
      matchPercentage: randomPercentage,
      matchedCount: Math.max(1, 12 - missingCount),
      missingCount,
      missingSkills
    };

    setLocalFits([newFit, ...localFits]);
    setCustomRole('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10 flex-grow">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Compare Career Roles
        </h1>
        <p className="text-slate-500 text-base md:text-lg">
          Evaluate how your profile fits into multiple career paths side-by-side. Spot key gaps and select a targeted track to optimize.
        </p>
      </div>

      {/* Warning/Demo notice if no resume is set */}
      {!resumeText && (
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center shrink-0">
              <Info className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">No Resume Uploaded</h3>
              <p className="text-slate-500 text-sm">
                To run custom comparisons across job roles, please upload your resume. Alternatively, load the demo developer profile to preview.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              loadMockData();
              setLocalFits(useStore.getState().compareFits);
            }}
            className="w-full md:w-auto shrink-0 bg-primary hover:bg-primary/95 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md transition-all"
          >
            Load Demo Profile
          </button>
        </div>
      )}

      {resumeText && (
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Custom Role Adder */}
          <div className="flex justify-between items-center bg-slate-50 border border-slate-200/60 rounded-2xl px-6 py-4">
            <span className="text-sm font-semibold text-slate-700">Add a custom role to benchmark</span>
            
            {isAdding ? (
              <form onSubmit={handleAddCustomRole} className="flex gap-2 items-center">
                <input
                  type="text"
                  required
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="e.g. Cloud Engineer"
                  className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                />
                <button
                  type="submit"
                  className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-primary/90"
                >
                  Compare
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 px-2"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsAdding(true)}
                className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Benchmark New Role
              </button>
            )}
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {localFits.map((fit, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-soft flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Header info */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-lg">{fit.roleName}</h3>
                      <p className="text-xs text-slate-400 font-semibold">
                        Matched: {fit.matchedCount} &middot; Missing: {fit.missingCount}
                      </p>
                    </div>

                    {/* Progress Badge */}
                    <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-primary text-xs font-bold shrink-0">
                      <Sparkles className="h-3 w-3" />
                      <span>{fit.matchPercentage}% Fit</span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      style={{ width: `${fit.matchPercentage}%` }}
                    />
                  </div>

                  {/* Skills Grid */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-500 block">Critical Missing Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {fit.missingSkills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="bg-rose-50 border border-rose-100 text-rose-800 text-[10px] font-bold px-2 py-1 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-semibold">Ready to target this?</span>
                  <button
                    onClick={() => handleTargetRole(fit.roleName, fit.matchPercentage, fit.missingSkills)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                  >
                    Select & Target
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
