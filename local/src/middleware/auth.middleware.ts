import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: '未提供认证token' 
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'token格式错误' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
    req.user = decoded;
    
    console.log('Auth middleware - User:', req.user);
    next();
  } catch (error) {
    console.error('认证失败:', error);
    return res.status(401).json({ 
      success: false, 
      message: '认证失败' 
    });
  }
};

export default authMiddleware; 