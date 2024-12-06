import React, { useState } from 'react';
import { Card, Upload, Button, Space, Spin, message, Tag } from 'antd';
import { UploadOutlined, AimOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { detectObjects } from '../../services/detection';
import type { DetectionResult, Detection, DetectionResponse } from '../../types/detection';
import styles from './index.module.css';

const DetectionPage: React.FC = () => {
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDetectionResponse = (response: DetectionResponse) => {
    try {
      if (response.success) {
        const resultImageUrl = `${process.env.REACT_APP_DETECTION_API_URL}${response.image_url}`;
        
        const allDetections: Detection[] = response.detections
          .flat()
          .map((det, index) => ({
            label: `目标 ${index + 1}`,
            bbox: det.bbox as [number, number, number, number, number]
          }));
        
        setDetectionResult({
          detections: allDetections,
          resultImage: resultImageUrl,
          processingTime: 0
        });
      } else {
        message.error('检测失败');
      }
    } catch (error) {
      message.error('处理检测结果时出错');
      console.error('处理检测结果错误:', error);
    }
  };

  const renderResults = () => {
    if (!detectionResult) return null;

    const { detections, processingTime } = detectionResult;
    const objectCounts: { [key: string]: number } = detections.reduce(
      (acc: { [key: string]: number }, curr: Detection) => {
        acc[curr.label] = (acc[curr.label] || 0) + 1;
        return acc;
      }, 
      {}
    );

    return (
      <div className={styles.results}>
        <div className={styles.statistics}>
          <div>检测目标总数：{detections.length}</div>
          <div>检测耗时：{processingTime.toFixed(2)}秒</div>
        </div>
  
      </div>
    );
  };

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
      message.error('文件获取��败');
      return;
    }

    setUploading(true);
    try {
      const response = await detectObjects(file);
      handleDetectionResponse(response);
    } catch (error: any) {
      message.error(error.message || '检测失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.spinContainer}>
          <Spin spinning={uploading}>
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
                    loading={uploading}
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
                  {uploading ? (
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
                        {renderResults()}
                      </div>
                    )
                  )}
                </Card>
              </div>
            </Space>
          </Spin>
        </div>
      </Card>
    </div>
  );
};

export default DetectionPage; 