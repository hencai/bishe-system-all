import React, { useState } from 'react';
import { Modal, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';

const { Dragger } = Upload;

interface CreateAnalysisModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateAnalysisModal: React.FC<CreateAnalysisModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [uploading, setUploading] = useState(false);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    action: 'http://localhost:3001/api/urban_analysis/create',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    onChange(info) {
      if (info.file.status === 'uploading') {
        setUploading(true);
      }
      if (info.file.status === 'done') {
        setUploading(false);
        message.success('上传成功');
        onSuccess();
      } else if (info.file.status === 'error') {
        setUploading(false);
        message.error('上传失败');
      }
    },
    beforeUpload: (file: RcFile) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('图片必须小于 10MB！');
        return false;
      }
      return true;
    },
  };

  return (
    <Modal
      title="新建分析"
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
    >
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">
          支持单个图片文件上传，文件大小不超过 10MB
        </p>
      </Dragger>
    </Modal>
  );
};

export default CreateAnalysisModal; 