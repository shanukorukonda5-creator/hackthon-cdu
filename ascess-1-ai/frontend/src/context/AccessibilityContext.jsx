import React, { createContext, useContext, useState, useEffect } from 'react';
import accessibilityService from '../services/accessibility.service';

const AccessibilityContext = createContext();

export const speakAnnouncement = (textToSpeak) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window && textToSpeak) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 1.1;
      utterance.volume = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      // ignore TTS error
    }
  }
};

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState('md'); // sm | md | lg | xl | 2xl
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [readingRuler, setReadingRuler] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [keyboardNav, setKeyboardNav] = useState(true);
  const [voiceFeedback, setVoiceFeedback] = useState(true); // Auditory feedback toggle
  const [readingSpeed, setReadingSpeed] = useState(1.0);
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);

  useEffect(() => {
    // Apply font size class to html root
    const root = document.documentElement;
    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl');

    if (fontSize === 'sm') root.classList.add('text-sm');
    else if (fontSize === 'md') root.classList.add('text-base');
    else if (fontSize === 'lg') root.classList.add('text-lg');
    else if (fontSize === 'xl') root.classList.add('text-xl');
    else if (fontSize === '2xl') root.classList.add('text-2xl');

    // Apply Dyslexia & High Contrast classes
    if (dyslexiaMode) root.classList.add('dyslexia-mode');
    else root.classList.remove('dyslexia-mode');

    if (highContrast) root.classList.add('high-contrast-mode');
    else root.classList.remove('high-contrast-mode');
  }, [fontSize, dyslexiaMode, highContrast]);

  // Global Interactive Element Click Feedback Listener
  useEffect(() => {
    if (!voiceFeedback) return;

    const handleClick = (e) => {
      const target = e.target.closest('button, a, input[type="submit"], input[type="button"], [role="button"]');
      if (!target) return;

      let text =
        target.getAttribute('aria-label') ||
        target.getAttribute('title') ||
        target.innerText ||
        target.value ||
        '';

      text = text.replace(/[\n\r]+/g, ' ').trim().slice(0, 40);
      if (text && !['Got It', 'Close'].includes(text)) {
        speakAnnouncement(`Clicked: ${text}`);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [voiceFeedback]);

  const increaseFontSize = () => {
    const sizes = ['sm', 'md', 'lg', 'xl', '2xl'];
    const idx = sizes.indexOf(fontSize);
    if (idx < sizes.length - 1) setFontSize(sizes[idx + 1]);
  };

  const decreaseFontSize = () => {
    const sizes = ['sm', 'md', 'lg', 'xl', '2xl'];
    const idx = sizes.indexOf(fontSize);
    if (idx > 0) setFontSize(sizes[idx - 1]);
  };

  const resetPreferences = () => {
    setFontSize('md');
    setDyslexiaMode(false);
    setHighContrast(false);
    setReadingRuler(false);
    setReduceMotion(false);
    setKeyboardNav(true);
    setVoiceFeedback(true);
    setReadingSpeed(1.0);
  };

  const toggleKeyboardModal = () => {
    setIsShortcutModalOpen((prev) => !prev);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        increaseFontSize,
        decreaseFontSize,
        dyslexiaMode,
        setDyslexiaMode,
        highContrast,
        setHighContrast,
        readingRuler,
        setReadingRuler,
        reduceMotion,
        setReduceMotion,
        keyboardNav,
        setKeyboardNav,
        voiceFeedback,
        setVoiceFeedback,
        readingSpeed,
        setReadingSpeed,
        resetPreferences,
        isShortcutModalOpen,
        toggleKeyboardModal,
        speakAnnouncement,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return context;
};

export default AccessibilityContext;
