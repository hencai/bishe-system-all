import { Card, Row, Col, Statistic } from 'antd';
import { CameraOutlined, HistoryOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Row gutter={[24, 24]} justify="center">
        <Col span={24}>
          <Card className={styles.welcomeCard}>
            <h1 className={styles.title}>欢迎使用目标检测系统</h1>
            <p className={styles.description}>
              本系统提供高效的目标检测服务，支持多种目标类型的识别和定位。
            </p>
          </Card>
        </Col>
        
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
  );
};

export default HomePage; 