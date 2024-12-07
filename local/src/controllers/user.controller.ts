import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcryptjs';

export class UserController {
  // 获取用户列表
  static async getUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 4;
      const { users, total } = await UserModel.findAll(pageSize, (page - 1) * pageSize);
      
      res.json({
        data: {
          records: users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            status: user.status,
            created_at: user.created_at
          })),
          total,
          current: page,
          pageSize
        }
      });
    } catch (error) {
      console.error('获取用户列表失败:', error);
      res.status(500).json({ message: '获取用户列表失败' });
    }
  }

  // 更新用户信息
  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { username, email } = req.body;
      
      await UserModel.update(parseInt(id), { username, email });
      res.json({ 
        data: {
          message: '更新成功'
        }
      });
    } catch (error) {
      console.error('更新用户失败:', error);
      res.status(500).json({ message: '更新用户失败' });
    }
  }

  // 重置用户密码
  static async resetPassword(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const newPassword = Math.random().toString(36).slice(-8); // 生成随机密码
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await UserModel.updatePassword(parseInt(id), hashedPassword);
      res.json({ 
        data: {
          message: '密码重置成功',
          newPassword // 在实际生产环境中应通过邮件发送新密码
        }
      });
    } catch (error) {
      console.error('重置密码失败:', error);
      res.status(500).json({ message: '重置密码失败' });
    }
  }

  // 禁用/启用用户
  static async toggleUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      await UserModel.updateStatus(parseInt(id), status);
      res.json({ 
        data: {
          message: status ? '用户已启用' : '用户已禁用',
          status: status
        }
      });
    } catch (error) {
      console.error('更新用户状态失败:', error);
      res.status(500).json({ message: '更新用户状态失败' });
    }
  }

  // 修改用户密码
  static async changePassword(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      
      // 对新密码进行加密
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await UserModel.updatePassword(parseInt(id), hashedPassword);
      res.json({ 
        data: {
          message: '密码修改成功'
        }
      });
    } catch (error) {
      console.error('修改密码失败:', error);
      res.status(500).json({ message: '修改密码失败' });
    }
  }
} 