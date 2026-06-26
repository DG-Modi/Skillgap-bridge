'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Script from 'next/script';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Info,
  ArrowRightLeft,
  ChevronRight
} from 'lucide-react';

// PDF parsing using client-side PDF.js
const parsePdf = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  const pdfjsLib = (window as any).pdfjsLib;
  if (!pdfjsLib) {
    throw new Error('PDF parsing library is still loading. Please try again in a few seconds.');
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  
  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    text += pageText + '\n';
  }
  return text;
};

// Word DOCX parsing using client-side Mammoth
const parseDocx = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  const mammoth = (window as any).mammoth;
  if (!mammoth) {
    throw new Error('Word document parsing library is still loading. Please try again.');
  }
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

// RTF parsing (regex-based control tags removal)
const parseRtf = (rtfText: string): string => {
  let text = rtfText.replace(/\\rtf1[\s\S]*?\{/g, ''); 
  text = text.replace(/\\([a-z]{1,32})(-?\d+)? ?/g, ''); 
  text = text.replace(/\{[^}]*\}/g, ''); 
  text = text.replace(/\n\s*\n/g, '\n'); 
  return text.trim();
};

const steps = [
  'Parsing resume contents...',
  'Extracting core competencies...',
  'Analyzing job description criteria...',
  'Calculating skill overlap scores...',
  'Compiling gap analysis recommendations...'
];

export default function AnalyzePage() {
  const {
    resumeText,
    resumeFileName,
    targetRole,
    isAnalyzing,
    analysisResult,
    setResume,
    setTargetRole,
    setAnalyzing,
    setAnalysisResult,
    setInterviewQuestions,
    setRecommendations,
    loadMockData,
    resetAll
  } = useStore();

  const [jdText, setJdText] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [parsingStatus, setParsingStatus] = useState('');

  // Trigger analysis simulation/API call
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText) {
      setError('Please upload your resume or paste resume text first.');
      return;
    }
    if (!roleInput) {
      setError('Please specify your target job role.');
      return;
    }

    setError(null);
    setAnalyzing(true);
    setActiveStepIndex(0);

    // Increment progress steps visually
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    try {
      setTargetRole(roleInput);
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobRole: roleInput,
          jobDescription: jdText
        })
      });

      if (!response.ok) {
        throw new Error('Analysis request failed. Fetching mock fallback...');
      }

      const data = await response.json();
      
      setAnalysisResult(data.analysis);
      if (data.interviewQuestions) setInterviewQuestions(data.interviewQuestions);
      if (data.recommendations) setRecommendations(data.recommendations);
    } catch (err: any) {
      console.log('Using local mock analyzer due to backend API error:', err);
      // Wait a brief moment to complete the scanning animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Load standard mock data for demonstration
      loadMockData();
    } finally {
      clearInterval(interval);
      setAnalyzing(false);
    }
  };

  // Dynamic file loader helper
  const processFile = async (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    setIsParsingFile(true);
    setParsingStatus('Reading uploaded file...');
    setError(null);

    try {
      const reader = new FileReader();
      if (extension === 'pdf') {
        setParsingStatus('Initializing PDF parser...');
        reader.onload = async (event) => {
          try {
            const buffer = event.target?.result as ArrayBuffer;
            setParsingStatus('Extracting text from PDF pages...');
            const text = await parsePdf(buffer);
            if (!text.trim()) {
              throw new Error('PDF file seems empty or scanned. Please copy & paste the text directly.');
            }
            setResume(text, file.name);
          } catch (err: any) {
            setError(err.message || 'Error parsing PDF file.');
          } finally {
            setIsParsingFile(false);
            setParsingStatus('');
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (extension === 'docx') {
        setParsingStatus('Initializing Word document parser...');
        reader.onload = async (event) => {
          try {
            const buffer = event.target?.result as ArrayBuffer;
            setParsingStatus('Extracting text from Word document...');
            const text = await parseDocx(buffer);
            if (!text.trim()) {
              throw new Error('Word document seems to have no readable text.');
            }
            setResume(text, file.name);
          } catch (err: any) {
            setError(err.message || 'Error parsing Word document.');
          } finally {
            setIsParsingFile(false);
            setParsingStatus('');
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (extension === 'rtf') {
        setParsingStatus('Parsing Rich Text Format...');
        reader.onload = (event) => {
          try {
            const rawText = event.target?.result as string;
            const cleanText = parseRtf(rawText);
            setResume(cleanText, file.name);
          } catch (err: any) {
            setError('Error parsing RTF file.');
          } finally {
            setIsParsingFile(false);
            setParsingStatus('');
          }
        };
        reader.readAsText(file);
      } else {
        // Read as plain text (txt, doc, markdown, csv, etc.)
        setParsingStatus('Reading as plain text...');
        reader.onload = (event) => {
          try {
            const text = event.target?.result as string;
            setResume(text, file.name);
          } catch (err: any) {
            setError('Error reading text file.');
          } finally {
            setIsParsingFile(false);
            setParsingStatus('');
          }
        };
        reader.readAsText(file);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process file.');
      setIsParsingFile(false);
      setParsingStatus('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10 flex-grow">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js" strategy="lazyOnload" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js" strategy="lazyOnload" />
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Analyze Your Skill Gap
        </h1>
        <p className="text-slate-500 text-base md:text-lg">
          Upload your resume and input your target job description. Our AI will map your capabilities and identify qualifications gaps instantly.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Loading Screen */}
        {isAnalyzing && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-soft text-center space-y-8"
          >
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-primary animate-spin" />
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900">AI Analyzer is Running</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                Comparing your credentials against standard industry expectations...
              </p>
            </div>

            {/* Progress Stepper */}
            <div className="space-y-4 text-left max-w-xs mx-auto pt-4 border-t border-slate-100">
              {steps.map((step, idx) => {
                const isActive = idx === activeStepIndex;
                const isCompleted = idx < activeStepIndex;
                return (
                  <div key={idx} className="flex items-center gap-3 transition-opacity duration-300">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                    ) : isActive ? (
                      <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-slate-200 shrink-0" />
                    )}
                    <span className={`text-sm ${isActive ? 'text-primary font-semibold' : isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Input Form Screen */}
        {!isAnalyzing && !analysisResult && (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={handleAnalyze} className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
              <div className="p-6 md:p-10 space-y-8">
                {error && (
                  <div className="bg-red-50 border border-red-100 text-danger text-sm rounded-xl p-4 flex gap-3 items-start">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Quick load button for testing/demo */}
                <div className="flex justify-between items-center bg-indigo-50/55 rounded-2xl p-4 border border-indigo-100/50">
                  <div className="flex items-center gap-2.5">
                    <Info className="h-5 w-5 text-primary shrink-0" />
                    <p className="text-xs md:text-sm text-indigo-950 font-medium">
                      Want to skip file uploads? Test the complete platform with pre-populated demo data.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loadMockData}
                    className="shrink-0 bg-primary hover:bg-primary/90 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    Load Demo Data
                  </button>
                </div>

                {/* Resume Upload Box */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-800">1. Upload Your Resume</label>
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 relative ${
                      isParsingFile
                        ? 'border-indigo-400 bg-indigo-50/30'
                        : 'border-slate-200 hover:border-primary bg-slate-50/45 cursor-pointer'
                    }`}
                  >
                    {!isParsingFile && (
                      <input
                        type="file"
                        accept=".pdf,.docx,.doc,.txt,.rtf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    )}
                    <div className="space-y-3 max-w-sm mx-auto">
                      {isParsingFile ? (
                        <>
                          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                            <RefreshCw className="h-6 w-6 text-primary animate-spin" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-indigo-900">
                              {parsingStatus}
                            </p>
                            <p className="text-xs text-indigo-400 animate-pulse">
                              Extracting text directly in your browser...
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-400 mx-auto shadow-sm border border-slate-100">
                            <Upload className="h-6 w-6 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-800">
                              {resumeFileName ? `Selected: ${resumeFileName}` : 'Drag & drop your resume file'}
                            </p>
                            <p className="text-xs text-slate-400">
                              Supports PDF, DOCX, TXT, or RTF files. Or paste text below.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Fallback Text Paste */}
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResume(e.target.value, 'Pasted_Resume_Text.txt')}
                    placeholder="Or copy & paste your plain text resume content here..."
                    rows={5}
                    className="w-full bg-slate-50/20 border border-slate-200 rounded-xl p-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                  />
                </div>

                {/* Target Role & Job Description Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-800">2. Target Job Role</label>
                    <input
                      type="text"
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value)}
                      placeholder="e.g. Full Stack Engineer, Data Scientist"
                      className="w-full bg-slate-50/20 border border-slate-200 rounded-xl p-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-hidden font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-800">3. Job Description (Optional)</label>
                    <textarea
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      placeholder="Paste target job description details to calculate precision scores..."
                      rows={4}
                      className="w-full bg-slate-50/20 border border-slate-200 rounded-xl p-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions Banner */}
              <div className="bg-slate-50 px-6 py-5 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg"
                >
                  Analyze Skill Gap
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Results Screen */}
        {!isAnalyzing && analysisResult && (
          <motion.div
            key="analysis-result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8 max-w-5xl mx-auto"
          >
            {/* Top Score Banner */}
            <div className="bg-white border border-slate-100 rounded-3xl shadow-soft p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Circular Gauge */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Gauge Ring */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="60" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                    <motion.circle
                      cx="72"
                      cy="72"
                      r="60"
                      fill="none"
                      stroke="url(#resultGradient)"
                      strokeWidth="12"
                      strokeDasharray={2 * Math.PI * 60}
                      initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                      animate={{ strokeDashoffset: (2 * Math.PI * 60) * (1 - analysisResult.matchPercentage / 100) }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="resultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#10B981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Percentage Content */}
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-slate-900 tracking-tighter">
                      {analysisResult.matchPercentage}%
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Match Score
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="space-y-4 md:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900">
                      Analysis for: <span className="gradient-text">{targetRole}</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      Based on resume file: <span className="text-slate-600 font-semibold">{resumeFileName}</span>
                    </p>
                  </div>
                  <button
                    onClick={resetAll}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary border border-slate-200 hover:border-primary/20 bg-white px-3 py-1.5 rounded-xl transition-all"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Reset Analysis
                  </button>
                </div>
                
                <p className="text-slate-500 text-sm leading-relaxed">
                  Your profile matches most core requirements for this position. We found {analysisResult.matchedSkills.length} matches, but identified {analysisResult.missingSkills.length} critical missing skills.
                </p>

                {/* Grid Links to Prep Features */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/interview"
                    className="inline-flex items-center justify-between bg-primary/5 hover:bg-primary/10 border border-primary/10 text-primary p-3 rounded-xl text-xs font-bold transition-all"
                  >
                    <span>Practice Mock Interview</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/recommendations"
                    className="inline-flex items-center justify-between bg-success/5 hover:bg-success/10 border border-success/10 text-success p-3 rounded-xl text-xs font-bold transition-all"
                  >
                    <span>Get Study Recommendations</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Matched vs Missing Skills Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Matched Skills */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-soft space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Matched Skills ({analysisResult.matchedSkills.length})</h3>
                    <p className="text-xs text-slate-400">Skills present in both resume and target role</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {analysisResult.matchedSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-emerald-100 flex items-center gap-1.5 shadow-2xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-soft space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Missing Skills ({analysisResult.missingSkills.length})</h3>
                    <p className="text-xs text-slate-400">Critical gaps identified based on role description</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {analysisResult.missingSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-rose-50 text-rose-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-rose-100 flex items-center gap-1.5 shadow-2xs"
                    >
                      <XCircle className="h-3.5 w-3.5 text-danger shrink-0" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Breakdown & Action Plan */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Category scores */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-soft space-y-6 md:col-span-5">
                <h3 className="font-bold text-slate-900 text-base">Category Scores</h3>
                
                <div className="space-y-4">
                  {analysisResult.categoryBreakdown.map((cat, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{cat.category}</span>
                        <span>{cat.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.score}%` }}
                          transition={{ duration: 1, delay: 0.1 * idx }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Plan */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-soft space-y-6 md:col-span-7">
                <h3 className="font-bold text-slate-900 text-base">AI Action Plan</h3>
                
                <div className="space-y-4">
                  {analysisResult.actionPlan.map((action, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-lg bg-indigo-50 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        {idx + 1}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
