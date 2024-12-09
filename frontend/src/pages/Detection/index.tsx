import React, { useState } from 'react';
import { Card, Upload, Button, Space, Spin, message, Tag } from 'antd';
import { UploadOutlined, AimOutlined } from '@ant-design/icons';
import type { DetectionResult, Detection, DetectionResponse } from '../../types/detection';
import type { DetectionStats, CategoryCount } from '../../types/apiStats';
import { getDetectionResult } from '../../utils/detection';
import styles from './index.module.css';

const DetectionPage: React.FC = () => {
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [apiStats, setApiStats] = useState<DetectionStats | null>(null);

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

      // 将文件转换为 base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      // 首先进行目标检测
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://10.16.32.190:8000/api/detect', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Detection failed');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error('Detection failed');
      }

      const resultImageUrl = `http://10.16.32.190:8000${data.image_url}`;

      const allDetections = data.detections.map((det: any, index: number) => ({
        label: `目标 ${index + 1}`,
        bbox: det.bbox,
        score: det.score,
        category: det.category || '未知类别'
      }));

      // 保存检测记录
      try {
        const token = localStorage.getItem('token');
        const recordData = {
          originalImage: base64Image,  // 使用 base64 格式的图片数据
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
          throw new Error('Failed to save detection record');
        }

        const saveResult = await saveResponse.json();

      } catch (saveError) {
        console.error('Error saving detection record:', saveError);
        message.error('保存检测记录失败');
      }

      handleDetectionComplete(allDetections, resultImageUrl);

      // 额外调用新的 API
      try {
        const statsResult = await getDetectionResult(file);
        setApiStats(statsResult);
      } catch (statsError) {
        console.error('获取统计数据失败:', statsError);
      }

    } catch (error) {
      console.error('Detection failed:', error);
      message.error('检测失败，请重试');
    } finally {
      setUploading(false);
    }
  };

  const renderResults = () => {
    if (!detectionResult) return null;

    return (
      <div className={styles.results}>
        {apiStats && (
          <div className={styles.apiStatistics}>
            <Card title="目标检测统计" style={{ marginTop: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div className={styles.statsRow}>
                  <Tag color="blue">检测目标总数：{apiStats.totalObjects}</Tag>
                  <Tag color="green">检测类别总数：{apiStats.totalCategories}</Tag>
                </div>
                
                <div className={styles.categoryStats}>
                  <span style={{ marginRight: 8 }}>类别详情：</span>
                  {apiStats.categories.map((category: CategoryCount, index: number) => (
                    <Tag 
                      key={index} 
                      color={getTagColor(index)}
                    >
                      {category.name}: {category.count}个
                    </Tag>
                  ))}
                </div>
              </Space>
            </Card>
          </div>
        )}
      </div>
    );
  };

  const handleUpload = (info: any) => {
    setFileList(info.fileList.slice(-1));
    setDetectionResult(null);
  };

  const getTagColor = (index: number): string => {
    const colors = ['blue', 'green', 'orange', 'purple', 'cyan', 'magenta'];
    return colors[index % colors.length];
  };

  return (
    <div className={styles.pageContainer}>
      <Card className={styles.mainCard}>
        {/* 上方控制区：左侧上传控件，右侧统计信息 */}
        <div className={styles.controlsWrapper}>
          {/* 左侧：上传和检测按钮 */}
          <div className={styles.uploadControls}>
            <Card title="图像上传与检测" className={styles.innerCard}>
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
          </div>

          {/* 右侧：统计信息 */}
          {apiStats && (
            <div className={styles.statsPanel}>
              <Card title="目标检测统计" className={styles.innerCard}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div className={styles.statsRow}>
                    <Tag color="blue">检测目标总数：{apiStats.totalObjects}</Tag>
                    <Tag color="green">检测类别总数：{apiStats.totalCategories}</Tag>
                  </div>
                  
                  <div className={styles.categoryStats}>
                    <span style={{ marginRight: 8 }}>类别详情：</span>
                    {apiStats.categories.map((category: CategoryCount, index: number) => (
                      <Tag 
                        key={index} 
                        color={getTagColor(index)}
                      >
                        {category.name}: {category.count}个
                      </Tag>
                    ))}
                  </div>
                </Space>
              </Card>
            </div>
          )}
        </div>

        {/* 下方图片展示区：横向排列 */}
        <div className={styles.imagesPanel}>
          <div className={styles.imageRow}>
            <Card title="原始图像" className={styles.imageCard + ' ' + styles.innerCard}>
              {fileList.length > 0 && (
                <img
                  src={URL.createObjectURL(fileList[0].originFileObj)}
                  alt="原始图像"
                  className={styles.previewImage}
                />
              )}
            </Card>
            <Card title="检测结果" className={styles.imageCard + ' ' + styles.innerCard}>
              {detectionResult && detectionResult.resultImage && (
                <img
                  src={detectionResult.resultImage}
                  alt="检测结果"
                  className={styles.resultImage}
                />
              )}
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DetectionPage; 