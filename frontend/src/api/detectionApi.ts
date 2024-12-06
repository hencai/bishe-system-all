import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'bp000114',
  database: 'detection_db'
};

export const saveDetectionRecord = async (recordData: {
  taskId: string;
  originalImageUrl: string;
  resultImageUrl: string;
}) => {
  const connection = await mysql.createConnection(dbConfig);

  try {
    const [result] = await connection.execute(
      'INSERT INTO detection_records (task_id, original_image_url, result_image_url) VALUES (?, ?, ?)',
      [recordData.taskId, recordData.originalImageUrl, recordData.resultImageUrl]
    );

    return result;
  } catch (error) {
    console.error('Error saving detection record:', error);
    throw error;
  } finally {
    await connection.end();
  }
}; 