import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface DetectionRecord extends RowDataPacket {
  id: number;
  original_image: string;
  result_image: string;
  detected_count: number;
  detection_time: Date;
}

export class DetectionModel {
  static async create(data: {
    original_image: string;
    result_image: string;
    detected_count: number;
  }): Promise<ResultSetHeader> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO detection_records (original_image, result_image, detected_count) VALUES (?, ?, ?)',
      [data.original_image, data.result_image, data.detected_count]
    );
    return result;
  }

  static async findAll(limit: number, offset: number): Promise<{
    records: DetectionRecord[];
    total: number;
  }> {
    const [records] = await pool.query<DetectionRecord[]>(
      'SELECT * FROM detection_records ORDER BY detection_time DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    const [countResult] = await pool.query<(RowDataPacket & { total: number })[]>(
      'SELECT COUNT(*) as total FROM detection_records'
    );

    return {
      records,
      total: countResult[0].total
    };
  }

  static async delete(id: number): Promise<ResultSetHeader> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM detection_records WHERE id = ?',
      [id]
    );
    return result;
  }
} 