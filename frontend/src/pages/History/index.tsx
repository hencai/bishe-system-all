import { useState, useEffect } from 'react';
import { Table, Image, Button, Popconfirm, message, Card, Space, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getDetectionHistory, deleteDetectionHistory } from '../../services/history';
import type { DetectionHistory } from '../../types/history';
import styles from './index.module.css';

const HistoryPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<DetectionHistory[]>([]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getDetectionHistory();
      setHistory(data);
    } catch (error) {
      message.error('获取历史记录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDetectionHistory(id);
      message.success('删除成功');
      fetchHistory();
    } catch (error) {
      message.error('删除失败');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const columns: ColumnsType<DetectionHistory> = [
    {
      title: '检测图片',
      key: 'images',
      width: 300,
      render: (_, record) => (
        <Space size="middle">
          <Image
            src={record.originalImage}
            width={120}
            height={120}
            style={{ objectFit: 'cover' }}
            alt="原始图片"
          />
          <EyeOutlined style={{ fontSize: 20 }} />
          <Image
            src={record.resultImage}
            width={120}
            height={120}
            style={{ objectFit: 'cover' }}
            alt="检测结果"
          />
        </Space>
      ),
    },
    {
      title: '检测目标数',
      dataIndex: 'detectionCount',
      key: 'detectionCount',
      width: 120,
      render: (count) => (
        <span className={styles.count}>{count} 个目标</span>
      ),
    },
    {
      title: '检测时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (date) => new Date(date).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Popconfirm
          title="确定要删除这条记录吗？"
          description="删除后将无法恢复"
          onConfirm={() => handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card title="检测历史记录">
        <Table
          columns={columns}
          dataSource={history}
          loading={loading}
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  );
};

export default HistoryPage;
