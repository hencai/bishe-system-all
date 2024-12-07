import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'bp000114',  // 使用您的实际密码
  database: 'detection_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool; 