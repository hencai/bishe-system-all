import pool from '../config/db';
import bcrypt from 'bcryptjs';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// 用于数据库查询结果的接口
export interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  email: string;
  status: number;
  created_at: Date;
}

// 用于创建用户的接口
export interface CreateUserDTO {
  username: string;
  password: string;
  email: string;
}

interface UserRecord {
  id: number;
  username: string;
  email: string;
  status: number;
  created_at: Date;
}

interface CountResult {
  total: number;
}

export class UserModel {
  static async findByUsername(username: string): Promise<UserRow | null> {
    const [rows] = await pool.query<UserRow[]>(
      'SELECT id, username, password, email, status FROM users WHERE username = ?',
      [username]
    );
    
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(user: CreateUserDTO): Promise<ResultSetHeader> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [user.username, hashedPassword, user.email]
    );
    return result;
  }

  static async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async findAll(limit: number, offset: number) {
    try {
      // 获取总数
      const [countResult] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as total FROM users'
      );
      const total = countResult[0].total;

      // 获取分页数据
      const [users] = await pool.query<UserRow[]>(
        'SELECT id, username, email, status, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );

      return {
        users,
        total
      };
    } catch (error) {
      throw error;
    }
  }

  static async update(id: number, data: { username?: string; email?: string }): Promise<ResultSetHeader> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE users SET ? WHERE id = ?',
      [data, id]
    );
    return result;
  }

  static async updatePassword(id: number, hashedPassword: string): Promise<ResultSetHeader> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return result;
  }

  static async updateStatus(id: number, status: boolean): Promise<ResultSetHeader> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE users SET status = ? WHERE id = ?',
      [status ? 1 : 0, id]
    );
    return result;
  }
} 