const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const env = require('../config/env');
const messages = require('../constants/messages');

/**
 * Normalizes any thrown error (ApiError, Joi validation error, or
 * an unexpected exception) into a consistent JSON error response.
 * Must be registered LAST, after all routes, in src/app.js.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || messages.COMMON.SERVER_ERROR;
    error = new ApiError(statusCode, message, null, false);
  }

  if (!error.isOperational) {
    logger.error(`${req.method} ${req.originalUrl} -> ${err.stack || err.message}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${error.message}`);
  }

  const response = {
    success: false,
    message: error.message,
    ...(error.details ? { details: error.details } : {}),
    ...(env.isDevelopment && !error.isOperational ? { stack: err.stack } : {}),
  };

  res.status(error.statusCode || 500).json(response);
}

module.exports = errorHandler;
