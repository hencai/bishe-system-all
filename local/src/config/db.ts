import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('detection_db', 'root', 'bp000114', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // 设置为 true 可以看到 SQL 查询日志
});

// 测试数据库连接
sequelize.authenticate()
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch(err => {
    console.error('数据库连接失败:', err);
  });

export default sequelize; 