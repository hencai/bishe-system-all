import { Router } from 'express';
import { DetectionController } from '../controllers/detection.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 添加认证中间件保护这些路由
router.post('/api/records', authMiddleware, DetectionController.create);
router.get('/api/records', authMiddleware, DetectionController.getList);
router.delete('/api/records/:id', authMiddleware, DetectionController.delete);

export default router; 