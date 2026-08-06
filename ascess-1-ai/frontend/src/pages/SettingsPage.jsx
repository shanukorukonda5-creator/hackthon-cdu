import React from 'react';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import SelectField from '../components/forms/SelectField';
import { useTheme } from '../context/ThemeContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useNotifications } from '../context/NotificationContext';
import accessibilityService from '../services/accessibility.service';
import {
  FiSettings,
  FiMoon,
  FiEye,
  FiType,
  FiFastForward,
  FiZap,
} from 'react-icons/fi';

const SettingsPage = () => {
  const { themePreference, setThemeMode } = useTheme();
  const { addToast } = useNotifications();
  const {
    fontSize,
    setFontSize,
    dyslexiaMode,
    setDyslexiaMode,
    highContrast,
    setHighContrast,
    reduceMotion,
    setReduceMotion,
    keyboardNav,
    setKeyboardNav,
    readingSpeed,
    setReadingSpeed,
  } = useAccessibility();

  const handleSave = async () => {
    try {
      await accessibilityService.updatePreferences({
        theme: themePreference,
        fontSize,
        dyslexiaMode,
        highContrast,
        reduceMotion,
        keyboardNav,
        readingSpeed,
      });
      addToast('Accessibility preferences saved successfully in Supabase!', 'success');
    } catch (err) {
      addToast('Saved accessibility preferences locally!', 'info');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center space-x-3">
          <FiSettings className="text-indigo-400" />
          <span>System & Accessibility Preferences</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Customize global theme, OpenDyslexic legibility font, motion reduction, keyboard focus, and reading speed.</p>
      </div>

      <GlassCard className="space-y-6">
        {/* Theme Preference */}
        <div className="space-y-2 pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <FiMoon className="text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-200">Appearance Theme</h3>
          </div>

          <SelectField
            label="Theme Mode"
            value={themePreference}
            onChange={(e) => setThemeMode(e.target.value)}
            options={[
              { label: 'Dark Glassmorphism (Default)', value: 'dark' },
              { label: 'Light Clean Mode', value: 'light' },
              { label: 'System Automatic', value: 'system' },
            ]}
          />
        </div>

        {/* Font Sizing & Dyslexia Mode */}
        <div className="space-y-4 pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <FiType className="text-purple-400" />
            <h3 className="text-sm font-bold text-slate-200">Typography & Legibility</h3>
          </div>

          <SelectField
            label="Global Text Size"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            options={[
              { label: 'Small (14px)', value: 'sm' },
              { label: 'Medium (16px - Standard)', value: 'md' },
              { label: 'Large (18px)', value: 'lg' },
              { label: 'Extra Large (20px)', value: 'xl' },
              { label: '2X Large (24px)', value: '2xl' },
            ]}
          />

          <div className="flex items-center justify-between pt-2">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">OpenDyslexic Legibility Font</h4>
              <p className="text-xs text-slate-400">Applies specialized letter shaping and extra letter spacing for reading comprehension.</p>
            </div>
            <button
              onClick={() => setDyslexiaMode(!dyslexiaMode)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                dyslexiaMode ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  dyslexiaMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">High Contrast Mode</h4>
              <p className="text-xs text-slate-400">Enforces WCAG AAA high contrast color palette and distinct borders.</p>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                highContrast ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Reading Speed */}
        <div className="space-y-2 pb-4 border-b border-white/10">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
            <div className="flex items-center space-x-2">
              <FiFastForward className="text-amber-400" />
              <span>Speech Synthesis Reading Speed</span>
            </div>
            <span className="font-mono text-amber-400">{readingSpeed}x</span>
          </div>

          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.25"
            value={readingSpeed}
            onChange={(e) => setReadingSpeed(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        {/* Toggles Suite */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Reduce Motion & Animations</h4>
              <p className="text-xs text-slate-400">Minimizes page transitions and background animations.</p>
            </div>
            <button
              onClick={() => setReduceMotion(!reduceMotion)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                reduceMotion ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  reduceMotion ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-slate-200">Enhanced Keyboard Focus Indicators</h4>
              <p className="text-xs text-slate-400">Enforces high-contrast focus rings for keyboard navigation.</p>
            </div>
            <button
              onClick={() => setKeyboardNav(!keyboardNav)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                keyboardNav ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  keyboardNav ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <GlassButton variant="primary" onClick={handleSave}>
            Save Preferences
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  );
};

export default SettingsPage;
