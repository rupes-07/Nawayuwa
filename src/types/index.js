/**
 * This project uses plain JavaScript, so these JSDoc typedefs exist purely
 * to give editors (VS Code, WebStorm) intellisense and light type-checking
 * without introducing a TypeScript build step.
 */

/**
 * @typedef {Object} User
 * @property {string} id - UUID, matches Supabase auth.users.id
 * @property {string} email
 * @property {string} [full_name]
 * @property {string} [avatar_url]
 * @property {'user'|'admin'} role
 * @property {string} created_at - ISO timestamp
 * @property {string} updated_at - ISO timestamp
 */

/**
 * @typedef {Object} AuthTokens
 * @property {string} accessToken
 * @property {string} [refreshToken]
 * @property {number} expiresIn - seconds until access token expiry
 */

/**
 * @typedef {Object} PaginationParams
 * @property {number} page - 1-indexed page number
 * @property {number} limit - items per page
 */

/**
 * @typedef {Object} PaginationMeta
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} totalPages
 */

/**
 * @typedef {Object} AuthenticatedRequest
 * @property {User} user - populated by middleware/authMiddleware.js
 */

module.exports = {};
