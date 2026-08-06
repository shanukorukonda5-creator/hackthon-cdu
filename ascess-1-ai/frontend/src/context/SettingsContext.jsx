import React, { createContext, useState, useContext, useEffect } from 'react';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [dyslexiaMode, setDyslexiaMode] = useState(() => localStorage.getItem('dyslexia_mode') === 'true');
  const [reduceMotion, setReduceMotion] = useState(() => localStorage.getItem('reduce_motion') === 'true');
  const [keyboardNav, setKeyboardNav] = useState(() => localStorage.getItem('keyboard_nav') !== 'false');
  const [readingSpeed, setReadingSpeed] = useState(() => parseFloat(localStorage.getItem('reading_speed')) || 1.0);

  useEffect(() => {
    localStorage.setItem('dyslexia_mode', dyslexiaMode);
    if (dyslexiaMode) {
      document.body.classList.add('dyslexia-font');
    } else {
      document.body.classList.remove('dyslexia-font');
    }
  }, [dyslexiaMode]);

  useEffect(() => {
    localStorage.setItem('reduce_motion', reduceMotion);
  }, [reduceMotion]);

  useEffect(() => {
    localStorage.setItem('keyboard_nav', keyboardNav);
  }, [keyboardNav]);

  useEffect(() => {
    localStorage.setItem('reading_speed', readingSpeed);
  }, [readingSpeed]);

  return (
    <SettingsContext.Provider
      value={{
        dyslexiaMode,
        setDyslexiaMode,
        reduceMotion,
        setReduceMotion,
        keyboardNav,
        setKeyboardNav,
        readingSpeed,
        setReadingSpeed,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

export default SettingsContext;
