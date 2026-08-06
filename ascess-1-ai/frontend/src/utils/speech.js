export const speakText = (text, rate = 1.0, pitch = 1.0) => {
  if (!('speechSynthesis' in window) || !text) {
    console.warn('Text-to-speech not supported in this browser environment or empty text.');
    return;
  }
  try {
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
  } catch (e) {
    // ignore
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;

  setTimeout(() => {
    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('speechSynthesis.speak error:', err);
    }
  }, 50);
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

export const createSpeechRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('Speech recognition not supported in this browser environment.');
    return null;
  }
  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  return recognition;
};
