import { Image, Button, Space, Tag } from 'antd';
import { useState } from 'react';
import { Detection } from '../types/detection';

// ... 其他导入保持不变

const DetectionVisualization: React.FC<{ 
  originalImage: string;
  detectedImage: string;
  results: Detection[];
}> = ({ originalImage, detectedImage, results }) => {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="detection-visualization">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space>
          <Button 
            type={showOriginal ? "default" : "primary"}
            onClick={() => setShowOriginal(false)}
          >
            显示检测结果
          </Button>
          <Button
            type={showOriginal ? "primary" : "default"}
            onClick={() => setShowOriginal(true)}
          >
            显示原图
          </Button>
        </Space>

        <div className="image-container" style={{ position: 'relative' }}>
          <Image
            src={showOriginal ? originalImage : detectedImage}
            style={{
              maxWidth: '100%',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            alt={showOriginal ? "原始图片" : "检测结果图片"}
          />
          
          {/* 由于后端已经在图像上绘制了检测框，这里可以不再绘制 */}
        </div>
      </Space>
    </div>
  );
};

export default DetectionVisualization;