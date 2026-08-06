import { settingsQueries } from '../supabase/queries.js';

export const accessibilityService = {
  /**
   * Get User Accessibility & Voice Preferences
   */
  async getPreferences(userId) {
    const settings = await settingsQueries.getByUserId(userId);
    if (!settings) {
      return {
        theme: 'dark',
        fontSize: 'md',
        fontScale: 1.0,
        highContrast: false,
        dyslexiaMode: false,
        reduceMotion: false,
        keyboardNav: true,
        readingSpeed: 1.0,
        readingPitch: 1.0,
        readingVolume: 1.0,
        preferredVoice: 'default',
        preferredLanguage: 'en-US',
        toolbarPosition: 'bottom-right',
      };
    }
    return settings;
  },

  /**
   * Update User Accessibility & Voice Preferences
   */
  async updatePreferences(userId, newPreferences) {
    return settingsQueries.upsert(userId, newPreferences);
  },

  /**
   * Get Accessibility Profile Summary
   */
  async getProfile(userId) {
    const preferences = await this.getPreferences(userId);
    return {
      userId,
      accessibilityScore: 100,
      activeFeatures: [
        preferences.dyslexiaMode ? 'OpenDyslexic Font' : null,
        preferences.highContrast ? 'High Contrast Mode' : null,
        preferences.reduceMotion ? 'Reduced Motion' : null,
        preferences.keyboardNav ? 'Enhanced Focus Rings' : null,
      ].filter(Boolean),
      preferences,
    };
  },

  /**
   * Update Accessibility Profile Summary
   */
  async updateProfile(userId, profileData) {
    return settingsQueries.upsert(userId, profileData);
  },
};

export default accessibilityService;
