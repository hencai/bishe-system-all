import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 所有路由都需要认证
router.use(authMiddleware);

router.get('/api/users', UserController.getUsers);
router.put('/api/users/:id', UserController.updateUser);
router.post('/api/users/:id/change-password', UserController.changePassword);
router.put('/api/users/:id/status', UserController.toggleUserStatus);

export default router; 