import { supabaseAdmin } from './client.js';
import config from '../config/index.js';
import crypto from 'crypto';

// In-memory fallback database for when Supabase credentials are placeholder or offline
const localStore = {
  users: [],
  documents: [],
  accessibility_reports: [],
  translations: [],
  ai_history: [],
  settings: [],
  activity_logs: [],
};

const isConfigured = () => {
  const url = config.supabase.url || '';
  const key = config.supabase.serviceRoleKey || '';
  return (
    url.startsWith('http') &&
    !url.includes('your-supabase-project-id') &&
    !url.includes('placeholder') &&
    key.length > 20 &&
    !key.includes('your-supabase-service-role-key')
  );
};

export const db = {
  async select(table, columns = '*', match = {}, options = {}) {
    if (isConfigured()) {
      try {
        let query = supabaseAdmin.from(table).select(columns);
        if (Object.keys(match).length > 0) query = query.match(match);
        if (options.orderBy) query = query.order(options.orderBy, { ascending: options.ascending ?? false });
        if (options.limit) query = query.limit(options.limit);
        const { data, error } = await query;
        if (!error) return data;
      } catch (err) {
        console.warn(`[Supabase] Network query failed for table ${table}. Using fallback store.`);
      }
    }

    // Fallback in-memory query
    const rows = localStore[table] || [];
    return rows.filter((row) =>
      Object.entries(match).every(([k, v]) => row[k] === v)
    );
  },

  async selectOne(table, match = {}, columns = '*') {
    if (isConfigured()) {
      try {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select(columns)
          .match(match)
          .single();

        if (!error) return data;
        if (error && error.code === 'PGRST116') return null; // No rows
      } catch (err) {
        console.warn(`[Supabase] Network query failed for table ${table}. Using fallback store.`);
      }
    }

    // Fallback in-memory query
    const rows = localStore[table] || [];
    const found = rows.find((row) =>
      Object.entries(match).every(([k, v]) => row[k] === v)
    );
    return found || null;
  },

  async insert(table, payload) {
    const isArray = Array.isArray(payload);
    const items = isArray ? payload : [payload];

    const preparedItems = items.map((item) => ({
      id: item.id || crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...item,
    }));

    if (isConfigured()) {
      try {
        const { data, error } = await supabaseAdmin
          .from(table)
          .insert(preparedItems)
          .select();

        if (!error && data) return isArray ? data : data[0];
      } catch (err) {
        console.warn(`[Supabase] Network insert failed for table ${table}. Using fallback store.`);
      }
    }

    // Fallback in-memory insert
    if (!localStore[table]) localStore[table] = [];
    localStore[table].push(...preparedItems);
    return isArray ? preparedItems : preparedItems[0];
  },

  async update(table, match, payload) {
    if (isConfigured()) {
      try {
        const { data, error } = await supabaseAdmin
          .from(table)
          .update({ ...payload, updated_at: new Date().toISOString() })
          .match(match)
          .select();

        if (!error) return data;
      } catch (err) {
        console.warn(`[Supabase] Network update failed for table ${table}. Using fallback store.`);
      }
    }

    // Fallback in-memory update
    const rows = localStore[table] || [];
    const updatedRows = [];
    localStore[table] = rows.map((row) => {
      const isMatch = Object.entries(match).every(([k, v]) => row[k] === v);
      if (isMatch) {
        const updated = { ...row, ...payload, updated_at: new Date().toISOString() };
        updatedRows.push(updated);
        return updated;
      }
      return row;
    });
    return updatedRows;
  },

  async delete(table, match) {
    if (isConfigured()) {
      try {
        const { data, error } = await supabaseAdmin
          .from(table)
          .delete()
          .match(match)
          .select();

        if (!error) return data;
      } catch (err) {
        console.warn(`[Supabase] Network delete failed for table ${table}. Using fallback store.`);
      }
    }

    // Fallback in-memory delete
    const rows = localStore[table] || [];
    const deleted = [];
    localStore[table] = rows.filter((row) => {
      const isMatch = Object.entries(match).every(([k, v]) => row[k] === v);
      if (isMatch) deleted.push(row);
      return !isMatch;
    });
    return deleted;
  },
};

export default db;
