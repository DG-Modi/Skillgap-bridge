'use client';

import { useState } from 'react';
import { Mail, Phone, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10 flex-grow bg-background-app">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Get in Touch
        </h1>
        <p className="text-slate-500 text-base md:text-lg">
          Have questions about enterprise scaling, integrations, or feature requests? Contact our team.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Contact Info Info Panel */}
        <div className="lg:col-span-5 bg-slate-900 rounded-3xl p-8 text-slate-300 flex flex-col justify-between relative overflow-hidden shadow-xl min-h-[400px]">
          {/* Blur blob */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-8 relative z-10">
            <div className="space-y-3">
              <h3 className="text-white font-bold text-xl">Contact Information</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Fill out the form and our team will get back to you within 24 business hours.
              </p>
            </div>

            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">General Support</h4>
                  <p className="text-xs text-slate-400 mt-0.5">support@skillgapbridge.ai</p>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Call Center</h4>
                  <p className="text-xs text-slate-400 mt-0.5">+91 98251 17231</p>
                </div>
              </li>
            </ul>
          </div>

        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 font-medium relative z-10 flex gap-4">
          <a href="#" className="hover:text-slate-400 transition-colors">Help Desk</a>
          <a href="#" className="hover:text-slate-400 transition-colors">API Docs</a>
          <a href="#" className="hover:text-slate-400 transition-colors">System Status</a>
        </div>
      </div>

      {/* Right: Contact Form */}
      <div className="lg:col-span-7 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-soft flex flex-col justify-center min-h-[400px]">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-5 py-8"
            >
              <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-lg">Message Sent Successfully!</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. A representative will contact you at your email address shortly.
                </p>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-primary hover:bg-primary/95 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">Full Name</label>
                  <input
                    required
                    type="text"
                    disabled={isSubmitting}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50/30 border border-slate-200 rounded-xl p-3.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">Work Email</label>
                  <input
                    required
                    type="email"
                    disabled={isSubmitting}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50/30 border border-slate-200 rounded-xl p-3.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">Company Name (Optional)</label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-slate-50/30 border border-slate-200 rounded-xl p-3.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 block">Subject</label>
                  <input
                    required
                    type="text"
                    disabled={isSubmitting}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-slate-50/30 border border-slate-200 rounded-xl p-3.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 block">Message Details</label>
                <textarea
                  required
                  disabled={isSubmitting}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Briefly describe what you'd like to discuss..."
                  rows={4}
                  className="w-full bg-slate-50/30 border border-slate-200 rounded-xl p-3.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-hidden"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary/95 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
  );
}
