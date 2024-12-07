import {Request, Resonse } from 'express';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcryptjs';

export class UserController {
  static async getList(req: Request, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize as string) || 10));
      const offset = (page - 1) * pageSize;

      console.log('Request params:', { 
        page, 
        pageSize, 
        offset,
        rawPage: req.query.page,
        rawPageSize: req.query.pageSize 
      });

      const { records, total } = await UserModel.findAll(pageSize, offset);

      // 移除密码字段
      const safeRecords = records.map(({ password, ...user }) => user);

      res.json({
        records: safeRecords,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      });
    } catch (error) {
      console.error('获取用户列表失败:', error);
      res.status(500).json({ 
        message: '获取用户列表失败',
        error: error instanceof Error ? error.message : '未知错误'
      });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { username, email } = req.body;

      await UserModel.update(parseInt(id), { username, email });
      
      res.json({ message: '更新成功' });
    } catch (error) {
      console.error('更新用户信息失败:', error);
      res.status(500).json({ message: '更新用户信息失败' });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await UserModel.updatePassword(parseInt(id), hashedPassword);
      
      res.json({ message: '密码修改成功' });
    } catch (error) {
      console.error('修改密码失败:', error);
      res.status(500).json({ message: '修改密码失败' });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // 生成随机密码
      const newPassword = Math.random().toString(36).slice(-8);
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await UserModel.updatePassword(parseInt(id), hashedPassword);
      
      res.json({ 
        message: '密码重置成功',
        newPassword 
      });
    } catch (error) {
      console.error('重置密码失败:', error);
      res.status(500).json({ message: '重置密码失败' });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      await UserModel.updateStatus(parseInt(id), status);
      
      res.json({ message: '状态更新成功' });
    } catch (error) {
      console.error('更新状态失败:', error);
      res.status(500).json({ message: '更新状态失败' });
    }
  }

  static async updateRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      await UserModel.updateRole(parseInt(id), role);
      
      res.json({ message: '用户权限修改成功' });
    } catch (error) {
      console.error('修改用户权限失败:', error);
      res.status(500).json({ message: '修改用户权限失败' });
    }
  }
}