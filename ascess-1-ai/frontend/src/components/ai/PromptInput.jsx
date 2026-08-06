import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import SpeechToText from '../accessibility/SpeechToText';
import GlassButton from '../ui/GlassButton';

const PromptInput = ({ onSubmit, loading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    onSubmit(prompt);
    setPrompt('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask OpenAI or request accessibility analysis..."
          className="glass-input w-full rounded-2xl py-3.5 pl-4 pr-12 text-sm bg-slate-900/80 border border-white/15 focus:border-indigo-500 shadow-xl"
        />
      </div>
      
      <SpeechToText onTranscriptChange={(text) => setPrompt(text)} />

      <GlassButton
        type="submit"
        loading={loading}
        disabled={!prompt.trim()}
        className="rounded-2xl px-5 py-3"
      >
        <FiSend className="text-base" />
      </GlassButton>
    </form>
  );
};

export default PromptInput;
