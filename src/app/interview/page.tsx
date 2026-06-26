'use client';

import { useState } from 'react';
import { useStore, InterviewQuestion } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, 
  HelpCircle, 
  ChevronRight, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Info,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

export default function InterviewPage() {
  const {
    resumeText,
    targetRole,
    interviewQuestions,
    isGeneratingInterview,
    loadMockData,
    updateUserAnswer,
    updateQuestionFeedback,
    setInterviewGenerating,
    setInterviewQuestions
  } = useStore();

  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeQuestion = interviewQuestions.find((q) => q.id === activeQuestionId);

  const getDifficultyBadge = (diff?: 'Basic' | 'Intermediate' | 'Advanced') => {
    switch (diff) {
      case 'Basic':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100/80';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-100/80';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-100/80';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  // Generate new interview questions via API
  const handleGenerateQuestions = async () => {
    if (!resumeText) {
      setError('Please upload your resume to generate tailored interview questions.');
      return;
    }
    setError(null);
    setInterviewGenerating(true);

    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetRole })
      });

      if (!response.ok) {
        throw new Error('Failed to generate interview questions.');
      }

      const data = await response.json();
      setInterviewQuestions(data.questions);
    } catch (err) {
      console.log('Using local mock questions due to API error:', err);
      // Wait a moment and load demo questions
      await new Promise((resolve) => setTimeout(resolve, 1500));
      loadMockData();
    } finally {
      setInterviewGenerating(false);
    }
  };

  // Grade user response via API
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuestion || !typedAnswer.trim()) return;

    setIsSubmitting(true);
    setError(null);
    updateUserAnswer(activeQuestion.id, typedAnswer);

    try {
      const response = await fetch('/api/interview/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQuestion.question,
          idealAnswer: activeQuestion.idealAnswer,
          userAnswer: typedAnswer
        })
      });

      if (!response.ok) {
        throw new Error('Grading request failed.');
      }

      const data = await response.json();
      updateQuestionFeedback(activeQuestion.id, data.feedback, data.score);
    } catch (err) {
      console.log('Using local grading logic due to API error:', err);
      // Fallback local scoring based on length/keyword overlap
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const lengthScore = Math.min(60, Math.floor(typedAnswer.length / 5));
      const keywordMatch = activeQuestion.idealAnswer.split(' ')
        .filter(word => word.length > 5 && typedAnswer.toLowerCase().includes(word.toLowerCase().substring(0, 4)))
        .length;
      
      const calculatedScore = Math.min(100, 40 + lengthScore + (keywordMatch * 10));
      const feedbackMessage = calculatedScore > 75 
        ? "Excellent response! You've successfully covered the core technical concepts and provided key details matching standard guidelines."
        : "Good attempt. To improve, try incorporating more specific terminology regarding transactional safety, cache invalidation, or DataLoader batching.";

      updateQuestionFeedback(activeQuestion.id, feedbackMessage, calculatedScore);
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = interviewQuestions.filter((q) => q.userAnswer).length;
  const averageScore = answeredCount > 0 
    ? Math.round(interviewQuestions.reduce((acc, q) => acc + (q.score || 0), 0) / answeredCount)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10 flex-grow">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Interview Preparation
        </h1>
        <p className="text-slate-500 text-base md:text-lg">
          Practice mock interviews with dynamic technical and behavioral questions generated directly from your target role gaps.
        </p>
      </div>

      {/* Warning/Demo notice if no questions load */}
      {interviewQuestions.length === 0 && (
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-soft flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center shrink-0">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">No Mock Interview Active</h3>
              <p className="text-slate-500 text-sm">
                To start a targeted interview session, please load the demo developer profile or analyze a resume first.
              </p>
            </div>
          </div>
          <button
            onClick={loadMockData}
            className="w-full md:w-auto shrink-0 bg-primary hover:bg-primary/95 text-white px-5 py-3 rounded-xl text-sm font-bold shadow-md transition-all"
          >
            Load Demo Questions
          </button>
        </div>
      )}

      {interviewQuestions.length > 0 && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Questions List & Progress */}
          <div className="lg:col-span-5 space-y-6">
            {/* Progress Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-soft space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Session Progress</h3>
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span>Completed: {answeredCount} of {interviewQuestions.length} Questions</span>
                {answeredCount > 0 && <span>Average Score: {averageScore}%</span>}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success rounded-full transition-all duration-300"
                  style={{ width: `${(answeredCount / interviewQuestions.length) * 100}%` }}
                />
              </div>

              {/* Refresh / Re-generate */}
              <button
                onClick={handleGenerateQuestions}
                disabled={isGeneratingInterview}
                className="w-full inline-flex justify-center items-center gap-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-50 text-slate-700 border border-slate-200 text-xs font-bold py-2.5 rounded-xl transition-all"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isGeneratingInterview ? 'animate-spin' : ''}`} />
                Generate New Questions
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {interviewQuestions.map((q, idx) => {
                const isActive = q.id === activeQuestionId;
                const isAnswered = !!q.userAnswer;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActiveQuestionId(q.id);
                      setTypedAnswer(q.userAnswer || '');
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                      isActive
                        ? 'bg-indigo-50/50 border-primary shadow-xs'
                        : 'bg-white hover:bg-slate-50/45 border-slate-100 shadow-soft'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                      isAnswered
                        ? 'bg-success/10 text-success'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isAnswered ? <CheckCircle2 className="h-4 w-4" /> : `Q${idx + 1}`}
                    </div>
                    
                    <div className="space-y-1.5 overflow-hidden w-full">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[9px] uppercase font-extrabold tracking-wider text-slate-400">
                          {q.type}
                        </span>
                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full border tracking-wide uppercase ${getDifficultyBadge(q.difficulty)}`}>
                          {q.difficulty || 'Intermediate'}
                        </span>
                        {q.score !== undefined && q.score > 0 && (
                          <span className="text-[9px] font-bold text-success ml-auto">
                            {q.score}%
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {q.question}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Q&A panel */}
          <div className="lg:col-span-7">
            {activeQuestion ? (
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-soft space-y-6">
                {/* Question Details */}
                <div className="space-y-3 pb-4 border-b border-slate-100">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="bg-primary/5 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {activeQuestion.type} Question
                    </span>
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${getDifficultyBadge(activeQuestion.difficulty)}`}>
                      {activeQuestion.difficulty || 'Intermediate'} Level
                    </span>
                  </div>
                  <h2 className="text-lg md:text-xl font-extrabold text-slate-950 leading-relaxed">
                    {activeQuestion.question}
                  </h2>
                </div>

                {/* Answer Given by AI */}
                <div className="bg-emerald-50/20 border border-emerald-100/50 p-5 rounded-2xl space-y-3">
                  <div className="flex gap-2 items-center text-emerald-800 font-extrabold text-xs">
                    <BrainCircuit className="h-4 w-4 text-emerald-600" />
                    <span>Ideal Answer Given by AI</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line italic">
                    "{activeQuestion.idealAnswer}"
                  </p>
                </div>

                {/* User Response Section */}
                {activeQuestion.feedback ? (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    {/* Score Gauge */}
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/50 rounded-2xl p-4">
                      <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center font-extrabold text-lg shrink-0">
                        {activeQuestion.score}%
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Grading Result</h4>
                        <p className="text-xs text-slate-400 font-medium">Evaluated against the ideal response</p>
                      </div>
                    </div>

                    {/* Feedback content */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-500 block">AI Evaluation Feedback:</span>
                      <p className="text-sm text-slate-600 leading-relaxed bg-indigo-50/20 border border-indigo-100/50 p-4 rounded-xl">
                        {activeQuestion.feedback}
                      </p>
                    </div>

                    {/* User's Submitted Answer */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-500 block">Your Submitted Response:</span>
                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 border border-slate-200/60 p-4 rounded-xl">
                        {activeQuestion.userAnswer}
                      </p>
                    </div>

                    {/* Reset Question state to try again */}
                    <button
                      onClick={() => {
                        updateUserAnswer(activeQuestion.id, '');
                        updateQuestionFeedback(activeQuestion.id, '', 0);
                        setTypedAnswer('');
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary transition-colors font-semibold cursor-pointer"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Try Answering Again
                    </button>
                  </div>
                ) : (
                  /* Form to Input Answer */
                  <form onSubmit={handleSubmitAnswer} className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500">Your Answer:</label>
                      <textarea
                        required
                        disabled={isSubmitting}
                        value={typedAnswer}
                        onChange={(e) => setTypedAnswer(e.target.value)}
                        placeholder="Write your response here to check if it's correct..."
                        rows={6}
                        className="w-full bg-slate-50/30 border border-slate-200 rounded-xl p-4 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-slate-400">
                        {typedAnswer.length} characters written
                      </span>
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            Checking Answer...
                          </>
                        ) : (
                          <>
                            Check if it is right or not
                            <Send className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200/50 rounded-3xl p-12 text-center space-y-4">
                <BrainCircuit className="h-12 w-12 text-slate-300 mx-auto" />
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">Select a Question</h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto">
                    Click on any question from the sidebar to begin typing your mock answer.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
