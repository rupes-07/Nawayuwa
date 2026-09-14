const Joi = require('joi');
const ApiError = require('../utils/ApiError');
const messages = require('../constants/messages');

const updateUserSchema = Joi.object({
  fullName: Joi.string().min(2).max(120),
  avatarUrl: Joi.string().uri().allow(null, ''),
}).min(1);

const listUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().allow('').optional(),
});

const uuidParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

/**
 * Generic middleware factory: validates req[source] against a Joi schema.
 * Usage: router.patch('/:id', validate(updateUserSchema), controller)
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((d) => d.message);
      return next(ApiError.badRequest(messages.COMMON.VALIDATION_ERROR, details));
    }

    req[source] = value;
    next();
  };
}

module.exports = {
  updateUserSchema,
  listUsersQuerySchema,
  uuidParamSchema,
  validate,
};
