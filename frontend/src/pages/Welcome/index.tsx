import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  RocketOutlined, 
  FileImageOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined 
} from '@ant-design/icons';
import styles from './index.module.css';

// 原来home
import { CameraOutlined, HistoryOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.container}>
        <div className={styles.welcome}>
          <h1>欢迎使用遥感图像目标检测系统</h1>
          <p>本系统提供高精度的遥感图像目标检测服务</p>
        </div>

        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title="已处理图像"
                value={1128}
                prefix={<FileImageOutlined />}
                suffix="张"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="检测准确率"
                value={98.2}
                precision={1}
                prefix={<CheckCircleOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="平均处理时间"
                value={1.2}
                precision={1}
                prefix={<ClockCircleOutlined />}
                suffix="秒"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="支持目标类型"
                value={15}
                prefix={<RocketOutlined />}
                suffix="种"
              />
            </Card>
          </Col>
        </Row>

        <Card className={styles.introCard} title="系统介绍">
          <p>遥感图像目标检测系统是一个基于深度学习的智能检测平台，主要功能包括：</p>
          <ul>
            <li>支持多种类型遥感图像的上传和处理</li>
            <li>实时目标检测和结果展示</li>
            <li>高精度的检测算法</li>
            <li>便捷的用户界面</li>
            <li>检测结果的导出和分析</li>
          </ul>
        </Card>
      </div>

      {/* 原来home组件 */}
      <div>
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Card 
              hoverable
              className={styles.actionCard}
              onClick={() => navigate('/detection')}
            >
              <Statistic
                title="开始检测"
                value=" "
                prefix={<CameraOutlined className={styles.icon} />}
              />
              <p className={styles.cardDescription}>
                上传图片进行目标检测
              </p>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Card 
              hoverable
              className={styles.actionCard}
              onClick={() => navigate('/history')}
            >
              <Statistic
                title="检测历史"
                value=" "
                prefix={<HistoryOutlined className={styles.icon} />}
              />
              <p className={styles.cardDescription}>
                查看历史检测记录
              </p>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Welcome; 