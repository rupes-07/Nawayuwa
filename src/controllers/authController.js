const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const httpStatus = require('../constants/httpStatus');
const messages = require('../constants/messages');

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  return new ApiResponse(httpStatus.CREATED, messages.AUTH.REGISTER_SUCCESS, user).send(res);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return new ApiResponse(httpStatus.OK, messages.AUTH.LOGIN_SUCCESS, result).send(res);
});

const refresh = asyncHandler(async (req, res) => {
  const tokens = await authService.refreshSession(req.body.refreshToken);
  return new ApiResponse(httpStatus.OK, 'Token refreshed successfully', tokens).send(res);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.token);
  return new ApiResponse(httpStatus.OK, messages.AUTH.LOGOUT_SUCCESS).send(res);
});

const me = asyncHandler(async (req, res) => {
  return new ApiResponse(httpStatus.OK, messages.USER.FETCHED, req.user).send(res);
});

module.exports = { register, login, refresh, logout, me };
