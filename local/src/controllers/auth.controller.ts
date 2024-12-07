import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, password, email } = req.body;

      // 检查用户是否已存在
      const existingUser = await UserModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: '用户名已存在' });
      }

      // 创建新用户
      await UserModel.create({
        username,
        password,
        email
      });
      
      res.status(201).json({ message: '注册成功' });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ mesage: '服务器错误' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await UserModel.findByUsername(username);

      if (!user) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      // 检查用户状态
      if (user.status === 0) {
        return res.status(403).json({ message: '账号已被禁用，请联系管理员' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: '用户名或密码错误' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      console.error('登录失败:', error);
      res.status(500).json({ message: '登录失败' });
    }
  }
} 