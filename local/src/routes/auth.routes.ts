import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

// 登录不需要认证
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

// 退出登录需要认证
router.post('/logout', authMiddleware, AuthController.logout);

export default router; 