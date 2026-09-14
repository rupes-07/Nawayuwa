const { supabaseAdmin } = require('../config/supabase');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const messages = require('../constants/messages');

/**
 * Verifies the Supabase access token sent in the Authorization header
 * (format: "Bearer <token>") and attaches the resolved user to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    throw ApiError.unauthorized(messages.AUTH.TOKEN_MISSING);
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data?.user) {
    throw ApiError.unauthorized(messages.AUTH.TOKEN_INVALID);
  }

  req.user = data.user;
  req.token = token;
  next();
});

/**
 * Restricts a route to specific roles. Expects req.user.role or
 * req.user.app_metadata.role to already be populated (e.g. by `protect`
 * plus a lookup, or by a custom claim in the Supabase JWT).
 * Usage: router.delete('/:id', protect, authorize('admin'), controller)
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  const role = req.user?.app_metadata?.role || req.user?.role;

  if (!role || !allowedRoles.includes(role)) {
    return next(ApiError.forbidden('You do not have permission to perform this action'));
  }
  next();
};

module.exports = { protect, authorize };
