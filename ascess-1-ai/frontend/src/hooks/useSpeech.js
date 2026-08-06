import { useState, useEffect } from 'react';
import { speakText, stopSpeech, createSpeechRecognition } from '../utils/speech';

export const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const rec = createSpeechRecognition();
    if (rec) {
      rec.onresult = (event) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
      };
      rec.onend = () => setIsListening(false);
      setRecognition(rec);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    speak: speakText,
    cancelSpeech: stopSpeech,
  };
};
