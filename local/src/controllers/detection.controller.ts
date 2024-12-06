import { Request, Response } from 'express';
import DetectionRecord from '../models/detection.model';

export const saveDetection = async (req: Request, res: Response) => {
  try {
    const { originalImageUrl, resultImageUrl, detectedCount = 0 } = req.body;

    const record = await DetectionRecord.create({
      original_image: originalImageUrl,
      result_image: resultImageUrl,
      detected_count: detectedCount,
      detection_time: new Date(),
    });

    res.json({
      success: true,
      message: '检测记录保存成功',
      data: record,
    });
  } catch (error) {
    console.error('保存检测记录失败:', error);
    res.status(500).json({
      success: false,
      message: '保存检测记录失败',
      error: error instanceof Error ? error.message : '未知错误',
    });
  }
};

export const getDetectionHistory = async (req: Request, res: Response) => {
  try {
    const records = await DetectionRecord.findAll({
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error('获取检测历史失败:', error);
    res.status(500).json({
      success: false,
      message: '获取检测历史失败',
      error: error instanceof Error ? error.message : '未知错误',
    });
  }
}; 