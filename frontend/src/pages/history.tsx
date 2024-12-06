import { useState, useEffect } from 'react';
import { Table, Image, Button, Pagination, Spin, Popconfirm, message, Card } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import '../styles/history.css';

interface DetectionRecord {
  id: number;
  original_image: string;
  result_image: string;
  detected_count: number;
  detection_time: string;
}

const History = () => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<DetectionRecord[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 表格列定义
  const columns: ColumnsType<DetectionRecord> = [
    {
      title: '原始图片',
      dataIndex: 'original_image',
      render: (url) => (
        <Image
          width={120}
          src={url}
          placeholder={<Spin />}
        />
      )
    },
    {
      title: '检测结果',
      dataIndex: 'result_image',
      render: (url) => (
        <Image
          width={120}
          src={url}
          placeholder={<Spin />}
        />
      )
    },
    {
      title: '检测目标数',
      dataIndex: 'detected_count',
      width: 100,
      align: 'center'
    },
    {
      title: '检测时间',
      dataIndex: 'detection_time',
      width: 180,
      render: (time) => new Date(time).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="确定要删除这条记录吗?"
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

  // 获取历史记录
  const fetchRecords = async (page: number = 1, pageSize: number = 10) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/records?page=${page}&pageSize=${pageSize}`
      );
      const data = await response.json();
      
      setRecords(data.records);
      setPagination({
        ...pagination,
        current: page,
        total: data.total
      });
    } catch (error) {
      console.error('获取历史记录失败:', error);
      message.error('获取历史记录失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除记录
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/records/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        message.success('删除成功');
        // 重新加载当前页数据
        fetchRecords(pagination.current, pagination.pageSize);
      } else {
        throw new Error('删除失败');
      }
    } catch (error) {
      console.error('删除记录失败:', error);
      message.error('删除记录失败');
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
            onChange={handlePageChange}
            onShowSizeChange={handlePageChange}
          />
        </div>
      </Card>
    </div>
  );
};

export default History; 