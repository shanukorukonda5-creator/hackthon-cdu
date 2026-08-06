import React from 'react';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import { speakText, stopSpeech } from '../../utils/speech';
import GlassButton from '../ui/GlassButton';

const TextToSpeech = ({ text }) => {
  return (
    <div className="flex items-center space-x-2">
      <GlassButton
        size="sm"
        variant="secondary"
        onClick={() => speakText(text)}
        title="Read aloud with Text to Speech"
      >
        <FiVolume2 className="mr-1.5 text-indigo-400" /> Speak Text
      </GlassButton>

      <button
        onClick={stopSpeech}
        title="Stop Speech"
        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
      >
        <FiVolumeX />
      </button>
    </div>
  );
};

export default TextToSpeech;
