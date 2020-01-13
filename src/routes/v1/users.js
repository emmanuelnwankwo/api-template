import { Router } from 'express';
import { UserController } from '../../controllers';
import {
  AuthMiddleware, UserMiddleware
} from '../../middlewares';

const router = Router();

const {
  getUser, updateUser, deleteUser
} = UserController;
const { authenticate } = AuthMiddleware;
const { validateUpdateData } = UserMiddleware;

router.get('/:userId', authenticate, getUser);
router.patch('/:userId/edit', authenticate, validateUpdateData, updateUser);
router.delete('/:userId', authenticate, deleteUser);


export default router;
