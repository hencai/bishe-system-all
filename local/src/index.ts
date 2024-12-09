import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import detectionRoutes from './routes/detection.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import urbanAnalysisRoutes from './routes/urban_analysis.routes';
import dotenv from 'dotenv';
import authMiddleware from './middleware/auth.middleware';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 静态文件访问的验证中间件
const staticFileAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log('Accessing static file:', req.url);
  console.log('Token from query:', req.query.token);
  
  const token = req.query.token as string;
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ 
      success: false, 
      message: '未提供认证token' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Token verified successfully:', decoded);
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ 
      success: false, 
      message: '无效的token' 
    });
  }
};

// 确保上传目录存在并设置正确的路径
const uploadDir = path.join(__dirname, '../storage/uploads');
console.log('Upload directory path:', uploadDir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 直接配置静态文件访问，不使用相对路径
app.use('/storage/uploads', staticFileAuth, (req, res, next) => {
  console.log('Accessing file:', path.join(uploadDir, req.path));
  if (fs.existsSync(path.join(uploadDir, req.path))) {
    console.log('File exists');
    next();
  } else {
    console.log('File not found');
    res.status(404).json({
      success: false,
      message: '文件不存在'
    });
  }
}, express.static(uploadDir));

app.use('/storage', authMiddleware, express.static('storage'));

// 修改路由注册方式
app.use('/api/auth', authRoutes);  // 修改这里，移除路由前缀
app.use('/api/detection', detectionRoutes);
app.use(userRoutes);
app.use('/api/urban_analysis', urbanAnalysisRoutes);

interface DetectionRecord extends RowDataPacket {
  id: number;
  original_image: string;
  result_image: string;
  detected_count: number;
  detection_time: Date;
}

interface CountResult extends RowDataPacket {
  total: number;
}

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'bp000114',
  database: 'detection_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 保存检测记录
app.post('/api/records', async (req, res) => {
  const { originalImage, resultImage, detectedCount } = req.body;
  
  try {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO detection_records (original_image, result_image, detected_count) VALUES (?, ?, ?)',
      [originalImage, resultImage, detectedCount]
    );
    res.status(201).json(result);
  } catch (error) {
    console.error('保存记录失败:', error);
    res.status(500).json({ error: '保存记录失败' });
  }
});

// 获取检测历史记录列表
app.get('/api/records', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const [records] = await pool.query<DetectionRecord[]>(
      'SELECT * FROM detection_records ORDER BY detection_time DESC LIMIT ? OFFSET ?',
      [pageSize, offset]
    );
    
    const [countResult] =await pool.query<CountResult[]>(
      'SELECT COUNT(*) as total FROM detection_records'
    );
    const total = countResult[0].total;

    res.json({ records, total });
  } catch (error) {
    console.error('获取记录失败:', error);
    res.status(500).json({ error: '获取记录失败' });
  }
});

// 删除检测记录
app.delete('/api/records/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.query<ResultSetHeader>(
      'DELETE FROM detection_records WHERE id = ?', 
      [id]
    );
    res.json({ message: '删除成功' });
  } catch (error) {
    console.error('删除记录失败:', error);
    res.status(500).json({ error: '删除记录失败' });
  }
});

// 添加一个简单的错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: '服务器内部错误' 
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`本地管理服务运行在 http://localhost:${PORT}`);
}); 