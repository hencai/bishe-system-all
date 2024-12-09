import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { UrbanAnalysisModel } from '../models/urban_analysis.model';
import { UrbanAnalysisService } from '../services/urban_analysis.service';

export class UrbanAnalysisController {
  static async create(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: '请上传图片文件' 
        });
      }

      const user = (req as any).user;
      console.log('User from token:', user);

      if (!user || !user.userId) {
        return res.status(401).json({ 
          success: false, 
          message: '用户未认证' 
        });
      }

      // 生成分析结果
      const analysisResult = {
        facilityStats: {
          "商业设施": Math.floor(Math.random() * 100),
          "教育设施": Math.floor(Math.random() * 50),
          "医疗设施": Math.floor(Math.random() * 30)
        },
        transportDensity: Math.random() * 0.8,
        publicFacilities: Math.floor(Math.random() * 200),
        industrialDensity: Math.random() * 0.5,
        suggestions: [
          "建议增加公共交通设施覆盖率",
          "可以适当增加教育设施数量",
          "商业设施分布较为合理"
        ]
      };

      // 使用 service 生成 PDF 报告
      const pdfPath = await UrbanAnalysisService.generatePdfReport(
        analysisResult,
        req.file.path,
        req.file.path  // 暂时用同一个图片路径
      );

      console.log('PDF generated at:', pdfPath);

      // 保存到数据库
      const result = await UrbanAnalysisModel.create({
        user_id: user.userId,
        original_image: req.file.path,
        result_image: req.file.path,
        report_url: pdfPath,
        analysis_result: analysisResult
      });

      res.json({
        success: true,
        data: {
          id: result.insertId
        }
      });

    } catch (error) {
      console.error('创建分析失败:', error);
      res.status(500).json({
        success: false,
        message: '创建分析失败'
      });
    }
  }

  static async getList(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const offset = (page - 1) * pageSize;

      const user = (req as any).user;
      console.log('Getting list for user:', user);

      if (!user || !user.userId) {
        return res.status(401).json({
          success: false,
          message: '用户未认证'
        });
      }

      const { records, total } = await UrbanAnalysisModel.findAll(
        user.userId,
        pageSize,
        offset
      );

      console.log('Found records:', { records, total });

      res.json({
        success: true,
        data: {
          records,
          total,
          page,
          pageSize
        }
      });
    } catch (error) {
      console.error('获取列表失败:', error);
      res.status(500).json({
        success: false,
        message: '获取列表失败'
      });
    }
  }

  static async getReport(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      if (!user || !user.userId) {
        return res.status(401).json({
          success: false,
          message: '用户未认证'
        });
      }

      const report = await UrbanAnalysisModel.findById(Number(id), user.userId);
      console.log('report', report);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: '报告不存在'
        });
      }

      // 检查报告文件是否存在
      const fullPath = path.resolve(report.report_url);
      console.log('PDF path:', fullPath);
      
      if (!fs.existsSync(fullPath)) {
        return res.status(404).json({
          success: false,
          message: 'PDF报告文件不存在'
        });
      }

      // 设置应头，告诉浏览器这是一个PDF文件
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=report_${id}.pdf`);

      // 使用 fs.createReadStream 读取文件并发送
      const fileStream = fs.createReadStream(fullPath);
      fileStream.on('error', (error) => {
        console.error('文件读取错误:', error);
        res.status(500).json({
          success: false,
          message: '文件读取失败'
        });
      });

      // 将文件流直接pipe到响应中
      fileStream.pipe(res);

    } catch (error) {
      console.error('获取报告失败:', error);
      res.status(500).json({
        success: false,
        message: '获取报告失败'
      });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      if (!user || !user.userId) {
        return res.status(401).json({
          success: false,
          message: '用户未认证'
        });
      }

      const result = await UrbanAnalysisModel.delete(Number(id), user.userId);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: '报告不存在或无权删除'
        });
      }

      res.json({
        success: true,
        message: '删除成功'
      });
    } catch (error) {
      console.error('删除失败:', error);
      res.status(500).json({
        success: false,
        message: '删除失败'
      });
    }
  }
}