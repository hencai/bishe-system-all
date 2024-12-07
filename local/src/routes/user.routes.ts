import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import authMiddleware from '../middleware/auth.middleware';

const router = Router();

// 使用认证中间件
router.use(authMiddleware);

// 用户列表
router.get('/api/users', UserController.getList);

// 更新用户信息
router.put('/api/users/:id', UserController.update);

// 修改密码
router.post('/api/users/:id/change-password', UserController.changePassword);

// 重置密码
router.post('/api/users/:id/reset-password', UserController.resetPassword);

// 更新用户状态
router.put('/api/users/:id/status', UserController.updateStatus);

// 更新用户角色
router.put('/api/users/:id/role', UserController.updateRole);

export default router; 