import { DataTypes, Model, ModelStatic } from 'sequelize';
import sequelize from '../config/db';

interface DetectionRecordAttributes {
  id?: number;
  original_image: string;
  result_image: string;
  detected_count: number;
  detection_time: Date;
  created_at?: Date;
  updated_at?: Date;
}

interface DetectionRecordModel extends Model<DetectionRecordAttributes>, DetectionRecordAttributes {}

const DetectionRecord: ModelStatic<DetectionRecordModel> = sequelize.define('DetectionRecord', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  original_image: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  result_image: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  detected_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  detection_time: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  tableName: 'detection_records',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default DetectionRecord; 