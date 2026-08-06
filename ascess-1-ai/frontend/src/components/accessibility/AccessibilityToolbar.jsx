import React, { useState } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import useSpeechToText from '../../hooks/useSpeechToText';
import {
  FiEye,
  FiSun,
  FiMoon,
  FiMic,
  FiVolume2,
  FiType,
  FiHelpCircle,
  FiRotateCcw,
  FiChevronUp,
  FiChevronDown,
  FiSliders,
} from 'react-icons/fi';

const AccessibilityToolbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mode, toggleTheme } = useTheme();
  const { addToast } = useNotifications();
  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    dyslexiaMode,
    setDyslexiaMode,
    highContrast,
    setHighContrast,
    readingRuler,
    setReadingRuler,
    voiceFeedback,
    setVoiceFeedback,
    resetPreferences,
    toggleKeyboardModal,
  } = useAccessibility();

  const { isListening, startListening, stopListening } = useSpeechToText();

  const handleVoiceMicToggle = () => {
    if (isListening) {
      stopListening();
      addToast('Voice microphone deactivated', 'info');
    } else {
      startListening();
      addToast('Voice microphone listening...', 'info');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-2">
      {/* Expanded Toolbar Dock */}
      {isOpen && (
        <div className="glass-panel p-3.5 rounded-2xl border border-white/20 shadow-2xl flex flex-col space-y-2 text-xs w-60 animate-slideInUp">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-slate-100 flex items-center space-x-1.5">
              <FiSliders className="text-indigo-400" />
              <span>Accessibility Dock</span>
            </span>
            <button
              onClick={resetPreferences}
              className="text-[10px] text-slate-400 hover:text-rose-400 flex items-center space-x-1"
              title="Reset All"
            >
              <FiRotateCcw />
              <span>Reset</span>
            </button>
          </div>

          {/* Font Controls */}
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-300 font-medium flex items-center space-x-1">
              <FiType className="text-purple-400" />
              <span>Text Size ({fontSize.toUpperCase()})</span>
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={decreaseFontSize}
                className="w-6 h-6 rounded-lg bg-slate-900/80 border border-white/10 hover:bg-slate-800 text-slate-200 font-bold"
              >
                -
              </button>
              <button
                onClick={increaseFontSize}
                className="w-6 h-6 rounded-lg bg-slate-900/80 border border-white/10 hover:bg-slate-800 text-slate-200 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Voice Navigation Feedback Toggle */}
          <button
            onClick={() => {
              setVoiceFeedback(!voiceFeedback);
              addToast(voiceFeedback ? 'Auditory Navigation Voice muted' : 'Auditory Navigation Voice active', 'info');
            }}
            className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all ${
              voiceFeedback ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-900/40 border-white/5 text-slate-300'
            }`}
          >
            <span>Voice Navigation Feedback</span>
            <span className="font-mono text-[10px]">{voiceFeedback ? 'ON' : 'OFF'}</span>
          </button>

          {/* Dyslexia Mode Toggle */}
          <button
            onClick={() => {
              setDyslexiaMode(!dyslexiaMode);
              addToast(dyslexiaMode ? 'Dyslexia Mode disabled' : 'OpenDyslexic font mode enabled', 'info');
            }}
            className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all ${
              dyslexiaMode ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-900/40 border-white/5 text-slate-300'
            }`}
          >
            <span>OpenDyslexic Font</span>
            <span className="font-mono text-[10px]">{dyslexiaMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={() => {
              setHighContrast(!highContrast);
              addToast(highContrast ? 'Standard theme restored' : 'High Contrast Mode enabled', 'info');
            }}
            className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all ${
              highContrast ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-900/40 border-white/5 text-slate-300'
            }`}
          >
            <span>High Contrast</span>
            <span className="font-mono text-[10px]">{highContrast ? 'ON' : 'OFF'}</span>
          </button>

          {/* Reading Ruler Toggle */}
          <button
            onClick={() => {
              setReadingRuler(!readingRuler);
              addToast(readingRuler ? 'Reading Ruler hidden' : 'Reading Ruler active', 'info');
            }}
            className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all ${
              readingRuler ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300' : 'bg-slate-900/40 border-white/5 text-slate-300'
            }`}
          >
            <span>Reading Ruler Guide</span>
            <span className="font-mono text-[10px]">{readingRuler ? 'ON' : 'OFF'}</span>
          </button>

          {/* Mic & Keyboard Help Row */}
          <div className="flex items-center space-x-2 pt-1 border-t border-white/10">
            <button
              onClick={handleVoiceMicToggle}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-xl border transition-all ${
                isListening ? 'bg-rose-600 text-white animate-pulse border-rose-500' : 'bg-slate-900/60 border-white/10 text-slate-300'
              }`}
            >
              <FiMic />
              <span>{isListening ? 'Listening...' : 'Voice Mic'}</span>
            </button>

            <button
              onClick={toggleKeyboardModal}
              className="p-2 rounded-xl bg-slate-900/60 border border-white/10 text-slate-300 hover:text-white"
              title="Keyboard Shortcuts Guide (?)"
            >
              <FiHelpCircle className="text-base" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xl shadow-2xl shadow-indigo-500/40 border border-indigo-400/40 hover:scale-105 transition-all"
        title="Accessibility Tools Toolbar"
      >
        <FiEye />
      </button>
    </div>
  );
};

export default AccessibilityToolbar;
