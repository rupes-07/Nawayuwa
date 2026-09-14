const { supabaseAdmin } = require('../config/supabase');

/**
 * Repository layer: the ONLY place that talks directly to Supabase for the
 * `users` table. Services call these functions instead of using the
 * Supabase client directly, which keeps data-access logic in one place
 * and makes it easy to swap the underlying storage later.
 */

const TABLE = 'users';

async function findById(id) {
  const { data, error } = await supabaseAdmin.from(TABLE).select('*').eq('id', id).single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

async function findByEmail(email) {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select('*')
    .eq('email', email)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

async function create(userData) {
  const { data, error } = await supabaseAdmin.from(TABLE).insert(userData).select().single();
  if (error) throw error;
  return data;
}

async function update(id, updates) {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function remove(id) {
  const { error } = await supabaseAdmin.from(TABLE).delete().eq('id', id);
  if (error) throw error;
  return true;
}

/**
 * @param {{page: number, limit: number, search?: string}} params
 */
async function list({ page = 1, limit = 20, search = '' }) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabaseAdmin.from(TABLE).select('*', { count: 'exact' }).range(from, to);

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    items: data,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

module.exports = { findById, findByEmail, create, update, remove, list };
