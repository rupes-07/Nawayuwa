const { createClient } = require('@supabase/supabase-js');
const env = require('./env');
const logger = require('../utils/logger');

/**
 * Admin client — uses the service role key.
 * Bypasses Row Level Security. Use ONLY on the backend, never expose to clients.
 * Use this in repositories for privileged operations (e.g. user management).
 */
const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Public client — uses the anon key.
 * Respects Row Level Security. Useful for verifying user JWTs issued by
 * Supabase Auth, or for operations that should run in the user's own context.
 */
const supabasePublic = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Simple connectivity check, useful at startup or in a health check route.
 */
async function checkSupabaseConnection() {
  try {
    const { error } = await supabaseAdmin.from('users').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // PGRST116 = table not found, which is fine for a fresh project
      logger.warn(`Supabase check warning: ${error.message}`);
    }
    return true;
  } catch (err) {
    logger.error(`Supabase connection failed: ${err.message}`);
    return false;
  }
}

module.exports = {
  supabaseAdmin,
  supabasePublic,
  checkSupabaseConnection,
};
