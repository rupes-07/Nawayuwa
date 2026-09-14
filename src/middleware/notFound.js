const ApiError = require('../utils/ApiError');
const messages = require('../constants/messages');

/**
 * Catches any request that didn't match a defined route and forwards
 * a 404 ApiError to the global error handler.
 */
function notFound(req, res, next) {
  next(ApiError.notFound(`${messages.COMMON.ROUTE_NOT_FOUND}: ${req.originalUrl}`));
}

module.exports = notFound;
