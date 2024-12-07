import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
  status: number;
  created_at: Date;
}

export class UserModel {
  static async findAll(pageSize: number, offset: number): Promise<{ records: User[]; total: number }> {
    try {
      // 确保参数是数字类型
      const limit = Math.max(1, Number(pageSize));
      const skip = Math.max(0, Number(offset));
      
      console.log('Query params:', { limit, skip });

      // 获取总数
      const [countResult] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as total FROM users'
      );
      const total = countResult[0].total;

      // 使用 LIMIT 子句的另一种写法
      const query = 'SELECT * FROM users ORDER BY id DESC LIMIT ? OFFSET ?';
      console.log('SQL Query:', query, [limit, skip]);

      const [records] = await pool.query<User[]>(
        query,
        [limit, skip]
      );

      console.log('Query result:', { 
        total, 
        recordCount: records.length,
        firstRecord: records[0]?.id,
        lastRecord: records[records.length - 1]?.id 
      });

      return { 
        records: records as User[], 
        total 
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  static async findByUsername(username: string): Promise<User | null> {
    try {
      const [rows] = await pool.execute<User[]>(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error in findByUsername:', error);
      throw error;
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await pool.execute<User[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error in findByEmail:', error);
      throw error;
    }
  }

  static async create(user: {
    username: string;
    email: string;
    password: string;
    role: string;
  }): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, 1)',
      [user.username, user.email, user.password, user.role]
    );
    return result;
  }

  static async update(id: number, data: { username?: string; email?: string }): Promise<ResultSetHeader> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.username) {
      updates.push('username = ?');
      values.push(data.username);
    }
    if (data.email) {
      updates.push('email = ?');
      values.push(data.email);
    }

    values.push(id);

    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return result;
  }

  static async updatePassword(id: number, password: string): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET password = ? WHERE id = ?',
      [password, id]
    );
    return result;
  }

  static async updateStatus(id: number, status: boolean): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET status = ? WHERE id = ?',
      [status ? 1 : 0, id]
    );
    return result;
  }

  static async updateRole(id: number, role: string): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    );
    return result;
  }
} 