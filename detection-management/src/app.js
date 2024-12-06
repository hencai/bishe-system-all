const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/detections', require('./routes/detections'));

// 数据库同步
sequelize.sync({ alter: true }).then(() => {
  console.log('数据库已同步');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});