import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import detectionRoutes from './routes/detection.routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(detectionRoutes);

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`本地管理服务运行在 http://localhost:${PORT}`);
}); 