const express = require('express');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  validate,
  updateUserSchema,
  listUsersQuerySchema,
  uuidParamSchema,
} = require('../validators/userValidator');

const router = express.Router();

router.use(protect); // every route below requires authentication

router.get('/', authorize('admin'), validate(listUsersQuerySchema, 'query'), userController.listUsers);
router.get('/:id', validate(uuidParamSchema, 'params'), userController.getUser);
router.patch('/:id', validate(uuidParamSchema, 'params'), validate(updateUserSchema), userController.updateUser);
router.delete('/:id', authorize('admin'), validate(uuidParamSchema, 'params'), userController.deleteUser);

module.exports = router;
