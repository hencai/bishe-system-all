import { Request, Response } from 'express';
import { DetectionModel, DetectionRecord } from '../models/detection.model';

export class DetectionController {
  static async create(req: Request, res: Response) {
    try {
      const { originalImage, resultImage, detectedCount } = req.body;
      
      const result = await DetectionModel.create({
        original_image: originalImage,
        result_image: resultImage,
        detected_count: detectedCount
      });
      
      res.status(201).json(result);
    } catch (error) {
      console.error('保存记录失败:', error);
      res.status(500).json({ message: '保存记录失败' });
    }
  }

  static async getList(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const offset = (page - 1) * pageSize;

      const { records, total } = await DetectionModel.findAll(pageSize, offset);
      
      res.json({ records, total });
    } catch (error) {
      console.error('获取记录失败:', error);
      res.status(500).json({ message: '获取记录失败' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await DetectionModel.delete(Number(id));
      res.json({ message: '删除成功' });
    } catch (error) {
      console.error('删除记录失败:', error);
      res.status(500).json({ message: '删除记录失败' });
    }
  }
} 