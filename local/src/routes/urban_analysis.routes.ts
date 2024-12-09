import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import express from 'express';
import { UrbanAnalysisController } from '../controllers/urban_analysis.controller';
import authMiddleware from '../middleware/auth.middleware';
import jwt from 'jsonwebtoken';

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'storage/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

// 文件过滤器
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/webp'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('不支持的文件类型'));
  }
};

// 创建 multer 实例
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

const router = Router();

// 添加静态文件访问的验证中间件
const staticFileAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.query.token as string;
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: '未提供认证token' 
    });
  }

  try {
    // 验证 token
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: '无效的token' 
    });
  }
};

// 在静态文件服务之前添加验证中间件
router.use('/storage/uploads', staticFileAuth, express.static('storage/uploads'));

// 确保上传目录存在
import fs from 'fs';
const uploadDir = 'storage/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 路由配置
router.post('/create', authMiddleware, upload.single('file'), UrbanAnalysisController.create);
router.get('/list', authMiddleware, UrbanAnalysisController.getList);
router.get('/report/:id', authMiddleware, UrbanAnalysisController.getReport);
router.delete('/:id', authMiddleware, UrbanAnalysisController.delete);
router.use('/storage/uploads', staticFileAuth, express.static(path.join(__dirname, '../../storage/uploads')));


export default router; 