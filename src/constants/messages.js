module.exports = {
  AUTH: {
    REGISTER_SUCCESS: 'User registered successfully',
    LOGIN_SUCCESS: 'Logged in successfully',
    LOGOUT_SUCCESS: 'Logged out successfully',
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_MISSING: 'Authentication token is missing',
    TOKEN_INVALID: 'Authentication token is invalid or expired',
    EMAIL_IN_USE: 'An account with this email already exists',
  },
  USER: {
    FETCHED: 'User fetched successfully',
    LIST_FETCHED: 'Users fetched successfully',
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
    NOT_FOUND: 'User not found',
  },
  COMMON: {
    VALIDATION_ERROR: 'Validation failed',
    SERVER_ERROR: 'Something went wrong. Please try again later.',
    NOT_FOUND: 'The requested resource was not found',
    ROUTE_NOT_FOUND: 'The requested route does not exist',
  },
};
