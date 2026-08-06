import db from './database.js';

export const userQueries = {
  findByEmail: (email) => db.selectOne('users', { email }),
  findById: (id) => db.selectOne('users', { id }, 'id, email, full_name, avatar_url, role, is_active, created_at, updated_at'),
  findByIdWithPassword: (id) => db.selectOne('users', { id }),
  create: (userData) => db.insert('users', userData),
  updateProfile: (id, { fullName, avatarUrl }) =>
    db.update('users', { id }, { full_name: fullName, avatar_url: avatarUrl }),
  updatePassword: (id, passwordHash) =>
    db.update('users', { id }, { password_hash: passwordHash }),
  deleteAccount: (id) => db.delete('users', { id }),
};

export const documentQueries = {
  getByUserId: (userId) => db.select('documents', '*', { user_id: userId }, { orderBy: 'created_at', ascending: false }),
  getById: (id, userId) => db.selectOne('documents', { id, user_id: userId }),
  create: (docData) => db.insert('documents', docData),
  updateStatus: (id, userId, status) => db.update('documents', { id, user_id: userId }, { ocr_status: status }),
  toggleFavorite: async (id, userId) => {
    const doc = await db.selectOne('documents', { id, user_id: userId });
    if (!doc) return null;
    const isFav = doc.metadata?.favorite || false;
    const updatedMeta = { ...(doc.metadata || {}), favorite: !isFav };
    return db.update('documents', { id, user_id: userId }, { metadata: updatedMeta });
  },
  delete: (id, userId) => db.delete('documents', { id, user_id: userId }),
};

export const accessibilityQueries = {
  getByUserId: (userId) => db.select('accessibility_reports', '*', { user_id: userId }, { orderBy: 'created_at', ascending: false }),
  create: (reportData) => db.insert('accessibility_reports', reportData),
  getLatestByUser: (userId) => db.select('accessibility_reports', '*', { user_id: userId }, { orderBy: 'created_at', ascending: false, limit: 1 }),
};

export const translationQueries = {
  getByUserId: (userId) => db.select('translations', '*', { user_id: userId }, { orderBy: 'created_at', ascending: false }),
  create: (data) => db.insert('translations', data),
};

export const aiQueries = {
  getHistoryByUser: (userId) => db.select('ai_history', '*', { user_id: userId }, { orderBy: 'created_at', ascending: false }),
  createLog: (logData) => db.insert('ai_history', logData),
};

export const settingsQueries = {
  getByUserId: (userId) => db.selectOne('settings', { user_id: userId }),
  upsert: async (userId, settingsData) => {
    const existing = await db.selectOne('settings', { user_id: userId });
    if (existing) {
      return db.update('settings', { user_id: userId }, settingsData);
    }
    return db.insert('settings', { user_id: userId, ...settingsData });
  },
};

export const logQueries = {
  create: (logData) => db.insert('activity_logs', logData),
  getByUserId: (userId) => db.select('activity_logs', '*', { user_id: userId }, { orderBy: 'created_at', ascending: false, limit: 50 }),
};
