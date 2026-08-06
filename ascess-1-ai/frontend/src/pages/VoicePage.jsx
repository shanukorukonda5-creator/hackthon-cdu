import React, { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import Badge from '../components/ui/Badge';
import SelectField from '../components/forms/SelectField';
import useTextToSpeech from '../hooks/useTextToSpeech';
import useSpeechToText from '../hooks/useSpeechToText';
import { useNotifications } from '../context/NotificationContext';
import {
  FiMic,
  FiPlay,
  FiPause,
  FiSquare,
  FiVolume2,
  FiZap,
} from 'react-icons/fi';

const VoicePage = () => {
  const { addToast } = useNotifications();
  const [inputText, setInputText] = useState(
    'Accessibility empowers every individual to interact seamlessly with digital technologies. High quality speech synthesis and voice commands create universal inclusion.'
  );

  const {
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
  } = useTextToSpeech(inputText);

  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechToText();

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        setInputText((prev) => `${prev} ${transcript}`);
      }
      addToast('Voice recording completed', 'info');
    } else {
      resetTranscript();
      startListening();
      addToast('Listening to voice input...', 'info');
    }
  };

  const voiceOptions = voices.map((v) => ({
    label: `${v.name} (${v.lang})`,
    value: v.name,
  }));

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-3">
          <FiVolume2 className="text-amber-400" />
          <span>Voice Reader & Audio Studio</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Universal browser Web Speech API voice synthesis, sentence tracking, and microphone speech input.</p>
      </div>

      <GlassCard className="flex flex-col items-center justify-center p-8 text-center space-y-6 border border-amber-500/20">
        {/* Animated Waveform Visualizer */}
        <div className="flex items-center justify-center space-x-1.5 h-16 w-full max-w-xs">
          {[40, 80, 60, 100, 75, 45, 90, 60, 30, 85].map((height, idx) => (
            <div
              key={idx}
              style={{ height: isListening || isPlaying ? `${height}%` : '20%' }}
              className={`w-2 rounded-full transition-all duration-300 ${
                isListening
                  ? 'bg-rose-500 animate-pulse'
                  : isPlaying
                  ? 'bg-indigo-500 animate-pulse'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Status Badge */}
        <Badge
          variant={
            isListening
              ? 'danger'
              : isPlaying
              ? 'success'
              : isPaused
              ? 'warning'
              : 'info'
          }
          className="uppercase tracking-wider px-4 py-1 text-xs"
        >
          {isListening
            ? '● Listening & Recording Voice Input'
            : isPlaying
            ? '▶ Synthesizing Audio Output'
            : isPaused
            ? '❚❚ Playback Paused'
            : 'Standby Ready'}
        </Badge>

        {/* Primary Mic Button */}
        <button
          onClick={handleMicToggle}
          className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl text-white shadow-2xl transition-all ${
            isListening
              ? 'bg-rose-600 shadow-rose-500/50 animate-pulse'
              : 'bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-indigo-500/30 hover:scale-105'
          }`}
          title={isListening ? 'Stop Recording' : 'Start Voice Input'}
        >
          <FiMic />
        </button>

        {/* Sentence Tracker Display */}
        {currentSentence && (
          <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium max-w-lg">
            <span className="font-bold mr-1 uppercase text-[10px]">Speaking Sentence:</span> "{currentSentence}"
          </div>
        )}

        {/* Progress Bar */}
        {isPlaying && (
          <div className="w-full max-w-md space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Speech Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div style={{ width: `${progress}%` }} className="h-full bg-indigo-500 transition-all duration-200" />
            </div>
          </div>
        )}

        {/* Playback Controls Bar */}
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <GlassButton
            size="md"
            variant="primary"
            onClick={() => speak(inputText)}
            disabled={isPlaying}
          >
            <FiPlay className="mr-2" /> Read Aloud
          </GlassButton>

          <GlassButton
            size="md"
            variant="secondary"
            disabled={!isPlaying && !isPaused}
            onClick={isPlaying ? pause : resume}
          >
            {isPlaying ? <FiPause className="mr-2" /> : <FiPlay className="mr-2" />}
            {isPlaying ? 'Pause' : 'Resume'}
          </GlassButton>

          <GlassButton size="md" variant="danger" disabled={!isPlaying && !isPaused} onClick={stop}>
            <FiSquare className="mr-2" /> Stop
          </GlassButton>
        </div>

        {/* Text Input Workspace */}
        <div className="w-full text-left space-y-2 pt-4">
          <label className="text-xs font-bold text-slate-200">Content to Read Aloud</label>
          <textarea
            rows={5}
            value={isListening ? transcript || 'Listening...' : inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="glass-input w-full rounded-2xl p-4 text-sm bg-slate-900/60 border border-white/10"
          />
        </div>

        {/* Audio Pitch, Speed & Voice Settings */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-left">
          <div>
            <SelectField
              label="Select Voice"
              options={voiceOptions.length > 0 ? voiceOptions : [{ label: 'Default System Voice', value: 'default' }]}
              value={selectedVoice || 'default'}
              onChange={(e) => setSelectedVoice(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex justify-between">
              <span>Speech Speed</span>
              <span className="font-mono text-amber-400">{rate}x</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.25"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex justify-between">
              <span>Speech Pitch</span>
              <span className="font-mono text-purple-400">{pitch}</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default VoicePage;
