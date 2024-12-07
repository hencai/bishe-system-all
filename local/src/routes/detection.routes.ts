import { Router, Request, Response } from 'express';
import { DetectionController } from '../controllers/detection.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 添加测试路由
router.get('/api/test', (req, res) => {
  res.json({ message: 'Test route works!' });
});

// 添加认证中间件保护这些路由
router.post('/api/records', authMiddleware, DetectionController.create);
router.get('/api/records', authMiddleware, DetectionController.getList);
router.delete('/api/records/:id', authMiddleware, DetectionController.delete);

// 下载路由
router.post('/api/download', authMiddleware, async (req: Request<any, any, { imageUrl: string }>, res: Response) => {
  try {
    const { imageUrl } = req.body;
    
    // 将本地URL转换为目标检测服务器URL
    const detectionServerUrl = imageUrl.replace('http://localhost:3001', 'http://10.16.32.190:8000');
    
    console.log('Original URL:', imageUrl);
    console.log('Detection Server URL:', detectionServerUrl);
    
    // 从目标检测服务器获取图片
    const response = await fetch(detectionServerUrl, {
      method: 'GET',
      headers: {
        'Accept': 'image/jpeg,image/*',
      },
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      console.error('Failed to fetch image:', response.statusText);
      return res.status(404).json({ 
        message: '获取图片失败',
        status: response.status,
        statusText: response.statusText
      });
    }
    
    // 获取图片数据
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log('Image buffer size:', buffer.length);
    
    // 设置响应头
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Disposition', `attachment; filename=${detectionServerUrl.split('/').pop()}`);
    
    // 发送图片数据
    res.send(buffer);
    
  } catch (error) {
    console.error('下载失败:', error);
    res.status(500).json({ 
      message: '下载失败',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router; 