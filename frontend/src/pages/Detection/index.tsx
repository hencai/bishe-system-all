import React, { useState } from 'react';
import { Card, Upload, Button, Space, Spin, message, Tag } from 'antd';
import { UploadOutlined, AimOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import { detectObjects } from '../../services/detection';
import type { DetectionResult, Detection, DetectionResponse } from '../../types/detection';
import styles from './index.module.css';

const DetectionPage: React.FC = () => {
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDetectionComplete = (allDetections: Detection[], resultImageUrl: string) => {
    setDetectionResult({
      taskId: Date.now().toString(),
      status: 'completed',
      detections: allDetections,
      resultImage: resultImageUrl,
      processingTime: 0,
      detected_objects: allDetections.map(d => ({
        bbox: d.bbox,
        score: d.score,
        category: d.category
      }))
    });
  };

  const handleDetection = async () => {
    if (fileList.length === 0) return;

    try {
      setUploading(true);
      const file = fileList[0].originFileObj;
      const formData = new FormData();
      formData.append('file', file);

      console.log('Sending file:', file);

      const response = await fetch('http://10.16.32.190:8000/api/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Detection API error:', errorData);
        throw new Error(`Detection failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Detection response:', data);

      if (!data.success) {
        throw new Error('Detection failed');
      }

      const resultImageUrl = `http://10.16.32.190:8000${data.image_url}`;

      const allDetections: Detection[] = data.detections.map((det: any, index: number) => ({
        label: `目标 ${index + 1}`,
        bbox: det.bbox,
        score: det.score,
        category: det.category || '未知类别'
      }));

      try {
        const token = localStorage.getItem('token');
        const recordData = {
          originalImage: URL.createObjectURL(file),
          resultImage: resultImageUrl,
          detectedCount: allDetections.length
        };

        const saveResponse = await fetch('http://localhost:3001/api/records', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(recordData)
        });

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json();
          console.error('Failed to save detection record:', errorData);
          message.error('保存检测记录失败');
        }
      } catch (saveError) {
        console.error('Error saving detection record:', saveError);
        message.error('保存检测记录失败');
      }

      handleDetectionComplete(allDetections, resultImageUrl);

    } catch (error) {
      console.error('Detection failed:', error);
      message.error('检测失败，请重试');
    } finally {
      setUploading(false);
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
          <div>检测耗时：{processingTime.toFixed(2)}</div>
        </div>

      </div>
    );
  };

  const handleUpload = (info: any) => {
    setFileList(info.fileList.slice(-1));
    setDetectionResult(null);
  };

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.spinContainer}>
          <Spin spinning={uploading}>
            <Space direction="vertical" size="large" style={{ width: '100%', gap: 0 }}>
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