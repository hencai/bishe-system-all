import { useState } from 'react';
import { Upload, Button, message, Image, Card, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

interface DetectionResult {
  taskId: string;
  status: string;
  result_image?: string;
  detected_objects?: Array<{
    bbox: number[];
    score: number;
    category: string;
  }>;
}

const DetectionPage = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string>('');
  const [detectedObjects, setDetectedObjects] = useState<any[]>([]);

  // 上传图片到检测服务
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error('请先选择图片');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', fileList[0].originFileObj as File);

      // 1. 发送图片到检测服务
      const response = await fetch('http://10.16.32.190:8000/detect', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      // 2. 获取检测结果
      const resultResponse = await fetch(`http://10.16.32.190:8000/result/${data.taskId}`);
      const detectionResult = await resultResponse.json();

      // 3. 保存结果到本地数据库
      await saveDetectionResult({
        originalImage: URL.createObjectURL(fileList[0].originFileObj as File),
        resultImage: detectionResult.result_image,
        detectedCount: detectionResult.detected_objects?.length || 0,
      });

      // 4. 更新界面显示
      setResultImage(detectionResult.result_image);
      setDetectedObjects(detectionResult.detected_objects || []);
      message.success('检测完成并保存记录');

    } catch (error) {
      console.error('检测失败:', error);
      message.error('检测失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 保存检测结果到本地数据库
  const saveDetectionResult = async (data: {
    originalImage: string;
    resultImage: string;
    detectedCount: number;
  }) => {
    try {
      const response = await fetch('http://localhost:3001/api/records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('保存记录失败');
      }
    } catch (error) {
      console.error('保存记录失败:', error);
      message.error('保存检测记录失败');
    }
  };

  return (
    <div className="detection-container">
      <Card title="目标检测" style={{ maxWidth: 800, margin: '0 auto' }}>
        <Upload
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          beforeUpload={() => false}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>选择图片</Button>
        </Upload>
        
        <Button 
          type="primary" 
          onClick={handleUpload} 
          loading={loading}
          style={{ marginTop: 16 }}
          disabled={fileList.length === 0}
        >
          开始检测
        </Button>

        {loading && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Spin tip="检测中..." />
          </div>
        )}

        {resultImage && (
          <div style={{ marginTop: 16 }}>
            <h3>检测结果</h3>
            <Image src={resultImage} />
            <div style={{ marginTop: 8 }}>
              检测到 {detectedObjects.length} 个目标
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DetectionPage; 