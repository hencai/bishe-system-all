import React, { useState } from 'react';
import { Upload, Card, Button, message, Progress } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import styles from './index.module.css';

const { Dragger } = Upload;

const ImageUpload: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const props = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('图片大小不能超过 10MB！');
        return false;
      }
      return true;
    },
    onChange: (info: any) => {
      setFileList(info.fileList.slice(-1));
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    onProgress: ({ percent }: { percent?: number }) => {
      if (percent) {
        setProgress(Math.floor(percent));
      }
    },
    customRequest: async ({ file, onSuccess, onError }: any) => {
      setUploading(true);
      try {
        // TODO: 实现实际的上传逻辑
        setTimeout(() => {
          onSuccess("ok");
          setUploading(false);
          setProgress(0);
        }, 1500);
      } catch (error) {
        onError(error);
        setUploading(false);
        setProgress(0);
      }
    },
  };

  return (
    <div className={styles.container}>
      <Card title="遥感图像上传" className={styles.card}>
        <Dragger {...props} className={styles.uploader}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
          <p className="ant-upload-hint">
            支持单次上传一张遥感图像，图片大小不超过10MB
          </p>
        </Dragger>
        
        {uploading && (
          <div className={styles.progress}>
            <Progress percent={progress} status="active" />
          </div>
        )}

        {fileList.length > 0 && (
          <div className={styles.preview}>
            <h3>图片预览</h3>
            <img
              src={URL.createObjectURL(fileList[0].originFileObj as Blob)}
              alt="preview"
              className={styles.previewImage}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default ImageUpload; 