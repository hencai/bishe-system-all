import { Card, Row, Col, Statistic } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import { Detection } from '../types/detection';

interface DetectionResultProps {
  results: Detection[];
}

const DetectionResultComponent: React.FC<DetectionResultProps> = ({ results }) => {
  return (
    <div className="detection-results">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <Statistic 
              title="检测目标总数" 
              value={results.length} 
              prefix={<AimOutlined />} 
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DetectionResultComponent;