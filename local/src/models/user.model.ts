import pool from '../config/db';
import bcrypt from 'bcryptjs';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// 用于数据库查询结果的接口
export interface UserRow extends RowDataPacket {
  id?: number;
  username: string;
  password: string;
  email: string;
}

// 用于创建用户的接口
export interface CreateUserDTO {
  username: string;
  password: string;
  email: string;
}

export class UserModel {
  static async findByUsername(username: string): Promise<UserRow | undefined> {
    const [rows] = await pool.query<UserRow[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
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
} 