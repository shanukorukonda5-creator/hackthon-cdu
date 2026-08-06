import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import { FiEye, FiCpu, FiFileText, FiGlobe, FiShield, FiZap } from 'react-icons/fi';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />

      {/* Hero Section */}
      <section className="relative py-24 px-6 text-center max-w-5xl mx-auto flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <FiZap />
          <span>Next-Gen Accessibility & AI Architecture</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent leading-tight">
          Empowering Universal Access with Intelligent AI
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed">
          <span className="text-indigo-400 font-semibold">ascess-1-ai</span> delivers production-grade accessibility auditing, real-time OCR document processing, multimodal speech interaction, and Google Gemini AI intelligence in a unified Apple-inspired experience.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/auth/register">
            <GlassButton size="lg" variant="primary" className="shadow-2xl shadow-indigo-500/40">
              Launch Platform Demo
            </GlassButton>
          </Link>
          <Link to="/auth/login">
            <GlassButton size="lg" variant="secondary">
              Existing Account
            </GlassButton>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard>
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-2xl mb-4">
              <FiEye />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Accessibility Scanner</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated WCAG compliance reporting, contrast analysis, and structural landmark verification.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-2xl mb-4">
              <FiCpu />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Gemini AI Integration</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Multimodal document insight generation, prompt processing, and contextual assistance.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl mb-4">
              <FiGlobe />
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Speech & Translation</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time Web Speech API voice synthesis, voice input recognition, and instant multi-language translation.
            </p>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
