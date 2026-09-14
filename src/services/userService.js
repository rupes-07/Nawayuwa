const userRepository = require('../repositories/userRepository');
const ApiError = require('../utils/ApiError');
const messages = require('../constants/messages');

async function getUserById(id) {
  const user = await userRepository.findById(id);
  if (!user) {
    throw ApiError.notFound(messages.USER.NOT_FOUND);
  }
  return user;
}

async function updateUser(id, updates) {
  await getUserById(id); // ensures the user exists, throws 404 otherwise
  const mapped = {};
  if (updates.fullName !== undefined) mapped.full_name = updates.fullName;
  if (updates.avatarUrl !== undefined) mapped.avatar_url = updates.avatarUrl;

  return userRepository.update(id, mapped);
}

async function deleteUser(id) {
  await getUserById(id);
  return userRepository.remove(id);
}

async function listUsers({ page, limit, search }) {
  return userRepository.list({ page, limit, search });
}

module.exports = { getUserById, updateUser, deleteUser, listUsers };
