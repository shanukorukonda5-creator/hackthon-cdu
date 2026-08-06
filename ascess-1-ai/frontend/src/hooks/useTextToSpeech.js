import { useState, useEffect, useRef } from 'react';

export const useTextToSpeech = (initialText = '') => {
  const [text, setText] = useState(initialText);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [currentSentence, setCurrentSentence] = useState('');
  const [progress, setProgress] = useState(0);

  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !selectedVoice) {
          const defaultVoice = availableVoices.find((v) => v.default || v.lang.startsWith('en')) || availableVoices[0];
          setSelectedVoice(defaultVoice.name);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const speak = (customText) => {
    const textToSpeak = customText || text;
    if (!textToSpeak || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    if (selectedVoice) {
      const vObj = voices.find((v) => v.name === selectedVoice);
      if (vObj) utterance.voice = vObj;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setProgress(0);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      setCurrentSentence('');
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onboundary = (event) => {
      if (event.name === 'sentence' || event.name === 'word') {
        const charIndex = event.charIndex;
        const remaining = textToSpeak.slice(charIndex);
        const sentenceMatch = remaining.match(/[^.!?]+[.!?]/);
        if (sentenceMatch) {
          setCurrentSentence(sentenceMatch[0].trim());
        }
        const pct = Math.min(100, Math.round((charIndex / textToSpeak.length) * 100));
        setProgress(pct);
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (window.speechSynthesis && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (window.speechSynthesis && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  };

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(0);
      setCurrentSentence('');
    }
  };

  return {
    text,
    setText,
    isPlaying,
    isPaused,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume,
    voices,
    selectedVoice,
    setSelectedVoice,
    currentSentence,
    progress,
    speak,
    pause,
    resume,
    stop,
    supported: typeof window !== 'undefined' && 'speechSynthesis' in window,
  };
};

export default useTextToSpeech;
