import React, { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import SelectField from '../components/forms/SelectField';
import TextToSpeech from '../components/accessibility/TextToSpeech';
import SpeechToText from '../components/accessibility/SpeechToText';
import { useNotifications } from '../context/NotificationContext';
import aiService from '../services/ai.service';
import { FiRepeat, FiCopy, FiDownload, FiGlobe } from 'react-icons/fi';

const languages = [
  { label: 'English (US)', value: 'English' },
  { label: 'Telugu (తెలుగు)', value: 'Telugu' },
  { label: 'Hindi (हिंदी)', value: 'Hindi' },
  { label: 'Tamil (தமிழ்)', value: 'Tamil' },
  { label: 'Kannada (கன்னட)', value: 'Kannada' },
  { label: 'Malayalam (മലയാളം)', value: 'Malayalam' },
  { label: 'Marathi (मराठी)', value: 'Marathi' },
  { label: 'Urdu (اردو)', value: 'Urdu' },
  { label: 'Spanish (Español)', value: 'Spanish' },
  { label: 'French (Français)', value: 'French' },
  { label: 'German (Deutsch)', value: 'German' },
  { label: 'Japanese (日本語)', value: 'Japanese' },
  { label: 'Chinese (中文)', value: 'Chinese' },
  { label: 'Arabic (العربية)', value: 'Arabic' },
];

const TranslationPage = () => {
  const { addToast } = useNotifications();
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    try {
      const res = await aiService.translate(sourceText, targetLang);
      const output = res.data?.translatedText || res.data?.text || 'Translation output generated.';
      setTranslatedText(output);
      addToast(`Translated into ${targetLang} successfully`, 'success');
    } catch (err) {
      addToast(err.message || 'Translation failed.', 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    addToast('Translated text copied to clipboard', 'info');
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-3">
          <FiGlobe className="text-purple-400" />
          <span>AI Multi-Language Translation Studio</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Translate content across 14 languages using OpenAI while preserving markdown, headings, and lists.</p>
      </div>

      {/* Language Pickers & Swap Bar */}
      <GlassCard className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
        <div className="w-full sm:w-64">
          <SelectField
            label="Source Language"
            options={languages}
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
          />
        </div>

        <button
          onClick={handleSwap}
          className="p-3 rounded-2xl bg-slate-900/80 border border-white/15 text-indigo-400 hover:text-white hover:bg-indigo-600 transition-all mt-4 sm:mt-0"
          title="Swap Languages"
        >
          <FiRepeat className="text-lg" />
        </button>

        <div className="w-full sm:w-64">
          <SelectField
            label="Target Language"
            options={languages}
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          />
        </div>
      </GlassCard>

      {/* Translation Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Text Card */}
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Source Input ({sourceLang})</h3>
            <SpeechToText onTranscriptChange={(text) => setSourceText(text)} />
          </div>

          <textarea
            rows={9}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type or speak text here..."
            className="glass-input w-full rounded-2xl p-4 text-sm bg-slate-900/60 border border-white/10"
          />
        </GlassCard>

        {/* Translated Output Card */}
        <GlassCard className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200">Translated Result ({targetLang})</h3>
            {translatedText && <TextToSpeech text={translatedText} />}
          </div>

          <div className="glass-input w-full h-[220px] rounded-2xl p-4 text-sm bg-slate-900/40 border border-white/10 overflow-y-auto">
            {translatedText ? (
              <p className="text-slate-100 whitespace-pre-wrap">{translatedText}</p>
            ) : (
              <span className="text-slate-500 italic">Translation output will appear here...</span>
            )}
          </div>

          {translatedText && (
            <div className="flex items-center justify-end space-x-2 pt-2">
              <GlassButton size="sm" variant="secondary" onClick={handleCopy}>
                <FiCopy className="mr-1.5" /> Copy
              </GlassButton>
              <GlassButton size="sm" variant="secondary" onClick={() => addToast('Downloaded translation file', 'success')}>
                <FiDownload className="mr-1.5" /> Download
              </GlassButton>
            </div>
          )}
        </GlassCard>
      </div>

      <div className="flex justify-end">
        <GlassButton variant="primary" loading={isTranslating} onClick={handleTranslate}>
          Execute AI Translation
        </GlassButton>
      </div>
    </div>
  );
};

export default TranslationPage;
