import { Router } from 'express';
import { AuthController } from '../../controllers';
import {
  PasswordMiddleware, AuthMiddleware
} from '../../middlewares';


const router = Router();
const {
  createUser, verifyEmail, sendResetPasswordEmail, resetPassword,
  verifyPasswordResetLink, loginUser, logout
} = AuthController;


const {
  signupValidation, loginValidation
} = AuthMiddleware;
const { checkParameters } = PasswordMiddleware;

router.post('/signup', signupValidation, createUser);
router.post('/login', loginValidation, loginUser);
router.get('/verify', verifyEmail);
router.post('/reset-password', checkParameters, sendResetPasswordEmail);
router.get('/reset-password', verifyPasswordResetLink);
router.post('/password/reset/:email', checkParameters, resetPassword);
router.get('/logout', logout);


export default router;
