import React, { useEffect } from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { FiX, FiCommand, FiHelpCircle } from 'react-icons/fi';

const shortcuts = [
  { key: 'Ctrl + K', description: 'Open Global Command Palette Search' },
  { key: '?', description: 'Open Keyboard Shortcuts Guide' },
  { key: 'Alt + R', description: 'Read Active Page Content Aloud (TTS)' },
  { key: 'Alt + M', description: 'Toggle Voice Microphone (STT)' },
  { key: 'Escape', description: 'Close Open Modals & Drawers' },
  { key: 'Tab / Shift + Tab', description: 'Navigate Interactive Elements' },
];

const KeyboardShortcutsModal = () => {
  const { isShortcutModalOpen, toggleKeyboardModal } = useAccessibility();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault();
        toggleKeyboardModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isShortcutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-md rounded-2xl border border-white/20 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <FiHelpCircle className="text-indigo-400 text-lg" />
            <h3 className="text-base font-bold text-slate-100">Keyboard Shortcuts Guide</h3>
          </div>
          <button onClick={toggleKeyboardModal} className="text-slate-400 hover:text-white">
            <FiX className="text-lg" />
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs">
              <span className="text-slate-300 font-medium">{s.description}</span>
              <kbd className="px-2 py-1 rounded bg-slate-800 border border-white/10 font-mono text-[10px] text-indigo-300">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={toggleKeyboardModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
