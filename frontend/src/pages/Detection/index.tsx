import React, { useState } from 'react';
import { Card, Upload, Button, Space, Spin, message, Tag } from 'antd';
import { UploadOutlined, AimOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { detectObjects } from '../../services/detection';
import type { DetectionResult, ProcessedDetection } from '../../types/detection';
import styles from './index.module.css';

const DetectionPage: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);

  const handleUpload = (info: any) => {
    setFileList(info.fileList.slice(-1));
    setDetectionResult(null);
  };

  const handleDetection = async () => {
    if (fileList.length === 0) {
      message.warning('请先上传图片');
      return;
    }

    const file = fileList[0].originFileObj;
    if (!file) {
      message.error('文件获取失败');
      return;
    }

    setLoading(true);
    try {
      const response = await detectObjects(file);
      if (response.success) {
        const resultImageUrl = `${process.env.REACT_APP_DETECTION_API_URL}${response.image_url}`;
        
        const allDetections = response.detections.flat().map(det => ({
          label: '目标',
          confidence: det.score,
          bbox: det.bbox
        }));

        setDetectionResult({
          detections: allDetections,
          resultImage: resultImageUrl,
          processingTime: 0
        });
        message.success('检测完成');
      } else {
        throw new Error('检测失败');
      }
    } catch (error: any) {
      message.error(error.message || '检测失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const renderDetectionInfo = () => {
    if (!detectionResult) return null;

    const { detections, processingTime } = detectionResult;
    const objectCounts: { [key: string]: number } = detections.reduce((acc, curr) => {
      acc[curr.label] = (acc[curr.label] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return (
      <div className={styles.detectionInfo}>
        <h3>检测信息</h3>
        <ul>
          <li>检测目标总数：{detections.length}</li>
          <li>检测耗时：{processingTime.toFixed(2)}s</li>
          <li>
            目标类别统计：
            <div className={styles.tagContainer}>
              {Object.entries(objectCounts).map(([label, count]) => (
                <Tag key={label} color="blue">{`${label}: ${count}`}</Tag>
              ))}
            </div>
          </li>
          <li>
            检测详情：
            <div className={styles.detectionList}>
              {detections.map((det: ProcessedDetection, index: number) => (
                <div key={index} className={styles.detectionItem}>
                  <Tag color="green">{det.label}</Tag>
                  <span>置信度: {(det.confidence * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="图像上传与检测" className={styles.card}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Upload
              fileList={fileList}
              onChange={handleUpload}
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>选择图片</Button>
            </Upload>
            <Button
              type="primary"
              icon={<AimOutlined />}
              onClick={handleDetection}
              loading={loading}
              disabled={fileList.length === 0}
            >
              开始检测
            </Button>
          </Space>
        </Card>

        <div className={styles.imageContainer}>
          <Card title="原始图像" className={styles.imageCard}>
            {fileList[0]?.originFileObj && (
              <img
                src={URL.createObjectURL(fileList[0].originFileObj as Blob)}
                alt="原始图像"
                className={styles.image}
              />
            )}
          </Card>

          <Card title="检测结果" className={styles.imageCard}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <Spin tip="正在检测中..." />
              </div>
            ) : (
              detectionResult && (
                <div className={styles.resultContainer}>
                  <img
                    src={detectionResult.resultImage}
                    alt="检测结果"
                    className={styles.image}
                  />
                  {renderDetectionInfo()}
                </div>
              )
            )}
          </Card>
        </div>
      </Space>
    </div>
  );
};

export default DetectionPage; 