const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Detection = sequelize.define('Detection', {
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  resultUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  detectionResults: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending',
  },
});

module.exports = Detection;