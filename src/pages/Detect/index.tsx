import React, { useState } from 'react';
import { Upload, Button, Card, Space, Image, Spin, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import './style.css';

const { Dragger } = Upload;

const Detect: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [resultImage, setResultImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = 'http://10.16.32.190:8000';  // 添加服务器基础 URL

  const handleUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/api/detect`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResultImage(`${API_BASE_URL}${data.image_url}`);
        message.success('检测成功！');
      } else {
        message.error(`检测失败：${data.detail || '未知错误'}`);
        console.error('检测失败详情：', data);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error(`检测失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setLoading(false);
    }

    return false;
  };

  return (
    <div className="detect-container">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="上传图片">
          <Dragger
            beforeUpload={handleUpload}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            maxCount={1}
            accept="image/*"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
            <p className="ant-upload-hint">
              支持单次上传一张图片，请上传清晰的遥感图像
            </p>
          </Dragger>
        </Card>

        {previewImage && (
          <Card title="原始图片">
            <div className="image-preview">
              <Image
                src={previewImage}
                alt="原始图片"
                style={{ maxWidth: '100%' }}
              />
            </div>
          </Card>
        )}

        {loading && (
          <Card>
            <Spin tip="正在进行目标检测..." />
          </Card>
        )}

        {resultImage && (
          <Card title="检测结果">
            <div className="image-preview">
              <Image
                src={resultImage}
                alt="检测结果"
                style={{ maxWidth: '100%' }}
              />
            </div>
          </Card>
        )}
      </Space>
    </div>
  );
};

export default Detect; 