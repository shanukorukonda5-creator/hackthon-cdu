import React from 'react';
import { FiMic, FiMicOff } from 'react-icons/fi';
import { useSpeech } from '../../hooks/useSpeech';
import GlassButton from '../ui/GlassButton';

const SpeechToText = ({ onTranscriptChange }) => {
  const { isListening, transcript, startListening, stopListening } = useSpeech();

  React.useEffect(() => {
    if (transcript && onTranscriptChange) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  return (
    <GlassButton
      size="sm"
      variant={isListening ? 'danger' : 'secondary'}
      onClick={isListening ? stopListening : startListening}
      title={isListening ? 'Stop Voice Input' : 'Start Voice Input'}
    >
      {isListening ? (
        <>
          <FiMicOff className="mr-1.5 animate-pulse text-white" /> Listening...
        </>
      ) : (
        <>
          <FiMic className="mr-1.5 text-indigo-400" /> Voice Input
        </>
      )}
    </GlassButton>
  );
};

export default SpeechToText;
