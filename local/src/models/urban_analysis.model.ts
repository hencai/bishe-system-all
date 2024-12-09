import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface UrbanAnalysisRecord extends RowDataPacket {
  id: number;
  user_id: number;
  original_image: string;
  result_image: string;
  report_url: string;
  status: 'processing' | 'completed' | 'failed';
  analysis_result: {
    facilityStats: { [key: string]: number };
    transportDensity: number;
    publicFacilities: number;
    industrialDensity: number;
    suggestions: string[];
  };
  created_at: Date;
}

export class UrbanAnalysisModel {
  static async create(data: {
    user_id: number;
    original_image: string;
    result_image: string;
    report_url: string;
    analysis_result: any;
  }): Promise<ResultSetHeader> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO urban_analysis (user_id, original_image, result_image, report_url, analysis_result) VALUES (?, ?, ?, ?, ?)',
      [data.user_id, data.original_image, data.result_image, data.report_url, JSON.stringify(data.analysis_result)]
    );
    return result;
  }

  static async findAll(userId: number, limit: number, offset: number): Promise<{
    records: UrbanAnalysisRecord[];
    total: number;
  }> {
    const [records] = await pool.query<UrbanAnalysisRecord[]>(
      'SELECT * FROM urban_analysis WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );

    const [countResult] = await pool.query<(RowDataPacket & { total: number })[]>(
      'SELECT COUNT(*) as total FROM urban_analysis WHERE user_id = ?',
      [userId]
    );

    return {
      records,
      total: countResult[0].total
    };
  }

  static async findById(id: number, userId: number): Promise<UrbanAnalysisRecord | null> {
    const [records] = await pool.query<UrbanAnalysisRecord[]>(
      'SELECT * FROM urban_analysis WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return records[0] || null;
  }

  static async delete(id: number, userId: number): Promise<any> {
    const [result] = await pool.execute(
      'DELETE FROM urban_analysis WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result;
  }
} 