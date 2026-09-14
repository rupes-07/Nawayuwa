const { supabaseAdmin, supabasePublic } = require('../config/supabase');
const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');
const messages = require('../constants/messages');

/**
 * Registers a new user via Supabase Auth, then creates a matching
 * profile row in the public `users` table.
 */
async function register({ email, password, fullName }) {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw ApiError.conflict(messages.AUTH.EMAIL_IN_USE);
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error) {
    throw ApiError.badRequest(error.message);
  }

  const profile = await userRepository.create({
    id: data.user.id,
    email: data.user.email,
    full_name: fullName,
    role: 'user',
  });

  return profile;
}

/**
 * Logs a user in using Supabase Auth's password grant and returns
 * both the session tokens and the user's profile row.
 */
async function login({ email, password }) {
  const { data, error } = await supabasePublic.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    throw ApiError.unauthorized(messages.AUTH.INVALID_CREDENTIALS);
  }

  const profile = await userRepository.findById(data.user.id);

  return {
    user: profile || data.user,
    tokens: {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in,
    },
  };
}

/**
 * Exchanges a refresh token for a fresh access token.
 */
async function refreshSession(refreshToken) {
  const { data, error } = await supabasePublic.auth.refreshSession({ refresh_token: refreshToken });

  if (error || !data.session) {
    throw ApiError.unauthorized(messages.AUTH.TOKEN_INVALID);
  }

  return {
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresIn: data.session.expires_in,
  };
}

/**
 * Invalidates the current session's refresh token server-side.
 */
async function logout(accessToken) {
  const { error } = await supabaseAdmin.auth.admin.signOut(accessToken);
  if (error) throw ApiError.badRequest(error.message);
  return true;
}

module.exports = { register, login, refreshSession, logout };
