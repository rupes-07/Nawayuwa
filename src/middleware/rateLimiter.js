const rateLimit = require('express-rate-limit');
const env = require('../config/env');

/**
 * General-purpose API rate limiter, applied globally in app.js.
 */
const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});

/**
 * Stricter limiter for sensitive auth endpoints (login/register)
 * to slow down brute-force and credential-stuffing attempts.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts, please try again in 15 minutes.',
  },
});

module.exports = { apiLimiter, authLimiter };
