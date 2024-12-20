import { useState, useEffect } from 'react';
import { Table, Image as AntImage, Button, Pagination, Spin, Popconfirm, message, Card, Space } from 'antd';
import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './index.css';

interface DetectionRecord {
  id: number;
  original_image: string;
  result_image: string;
  detected_count: number;
  detection_time: string;
}

const History = () => {
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<number | null>(null);
  const [records, setRecords] = useState<DetectionRecord[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3,
    total: 0
  });

  // 获取历史记录
  const fetchRecords = async (page: number = 1, pageSize: number = 3) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3001/api/records?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      
      setRecords(data.records);
      setPagination({
        ...pagination,
        current: page,
        pageSize: pageSize,
        total: data.total
      });

    } catch (error) {
      console.error('获取史记录失败:', error);
      message.error('获取历史记录失败');
    } finally {
      setLoading(false);
    }
  };

  // 表格列定义
  const columns: ColumnsType<DetectionRecord> = [
    {
      title: '原始图片',
      dataIndex: 'original_image',
      render: (url) => {
        const token = localStorage.getItem('token');
        return (
          <AntImage
            width={120}
            src={`http://localhost:3001/storage${url}?token=${token}`}
            placeholder={<Spin />}
          />
        );
      }
    },
    {
      title: '检测结果',
      dataIndex: 'result_image',
      render: (url) => (
        <AntImage
          width={120}
          src={url}
          placeholder={<Spin />}
          preview={true}
        />
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            size="small"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record.result_image, record.id)}
            loading={downloading === record.id}
          >
            {downloading === record.id ? '下载中' : '下载结果'}
          </Button>
          <Popconfirm
            title="确定要删除这条记录吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 删除记录
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/records/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        message.success('删除成功');
        // 重新加载当前页数
        fetchRecords(pagination.current, pagination.pageSize);
      } else {
        throw new Error('删除失败');
      }
    } catch (error) {
      console.error('删除记录失败:', error);
      message.error('删除记录失败');
    }
  };

  // 修改下载功能
  const handleDownload = async (imageUrl: string, recordId: number) => {
    if (downloading === recordId) {
      message.info('正在下载中，请稍候...');
      return;
    }

    try {
      setDownloading(recordId);
      message.loading('正在准备下载检测结果...', 0);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${imageUrl}?token=${token}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('下载失败');
      }

      // 获取文件名
      const filename = `detection-result-${recordId}.jpg`;

      // 获取图片数据并创建下载
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // 模拟点击下载
      document.body.appendChild(link);
      link.click();
      
      // 清理
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      message.success('检测结果下载成功');
    } catch (error) {
      console.error('下载失败:', error);
      message.error('下载失败，请重试');
    } finally {
      setDownloading(null);
      message.destroy();
    }
  };

  // 处理分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    fetchRecords(page, pageSize);
  };

  // 首次加载
  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="history-container">
      {downloading !== null && (
        <div className="download-mask">
          <Spin size="large" tip="正在下载..." />
        </div>
      )}
      
      <Card title="检测历史记录" bordered={false}>
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          pagination={false}
          loading={loading}
        />
        <div className="pagination-wrapper">
          <Pagination
            {...pagination}
            showQuickJumper
            showSizeChanger
            pageSizeOptions={['3', '4', '5']}
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
          />
        </div>
      </Card>
    </div>
  );
};

// 添加样式
const styles = `
.download-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.download-mask .ant-spin {
  color: #fff;
}

.download-mask .ant-spin-text {
  color: #fff;
  margin-top: 8px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
`;

// 添加样式到 head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default History; 