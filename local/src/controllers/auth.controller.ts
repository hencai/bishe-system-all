import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      console.log('Login request body:', req.body);
      const { username, password } = req.body;
      
      // 先尝试通过用户名查找
      const user = await UserModel.findByUsername(username);
      console.log('Found user:', user ? { ...user, password: '[HIDDEN]' } : null);
      
      if (!user) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      // 验证密码
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log('Password validation result:', isValidPassword);

      if (!isValidPassword) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      const token = jwt.sign(
        { 
          userId: user.id, 
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      console.error('登录失败:', error);
      res.status(500).json({ message: '登录失败' });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { username, password, email } = req.body;

      // 检查用户是否已存在
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: '用户名已被注册' });
      }

      // 加密密码
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 创建新用户
      await UserModel.create({
        username,
        email,
        password: hashedPassword,
        role: 'user'
      });

      res.status(201).json({ message: '注册成功' });
    } catch (error) {
      console.error('注册失败:', error);
      res.status(500).json({ message: '注册失败' });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      res.json({ message: '退出登录成功' });
    } catch (error) {
      console.error('退出登录失败:', error);
      res.status(500).json({ message: '退出登录失败' });
    }
  }
}