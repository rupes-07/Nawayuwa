const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const httpStatus = require('../constants/httpStatus');
const messages = require('../constants/messages');

const getUser = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return new ApiResponse(httpStatus.OK, messages.USER.FETCHED, user).send(res);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);
  return new ApiResponse(httpStatus.OK, messages.USER.UPDATED, user).send(res);
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  return new ApiResponse(httpStatus.OK, messages.USER.DELETED).send(res);
});

const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const result = await userService.listUsers({ page, limit, search });
  return new ApiResponse(httpStatus.OK, messages.USER.LIST_FETCHED, result.items, {
    page: result.page,
    limit: result.limit,
    total: result.total,
    totalPages: result.totalPages,
  }).send(res);
});

module.exports = { getUser, updateUser, deleteUser, listUsers };
