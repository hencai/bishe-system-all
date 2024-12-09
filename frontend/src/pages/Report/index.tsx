import React, { useState, useEffect } from 'react';
import { Table, Space, Button, message, Modal, Card } from 'antd';
import { FileTextOutlined, ReloadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { TablePaginationConfig, ColumnType } from 'antd/es/table';
import CreateAnalysisModal from '../../components/CreateAnalysisModal';
import styles from './index.module.css';

interface Report {
  id: number;
  original_image: string;
  result_image: string;
  report_url: string;
  created_at: string;
  status: 'processing' | 'completed' | 'failed';
  analysis_result: {
    facilityStats: { [key: string]: number };
    transportDensity: number;
    publicFacilities: number;
    industrialDensity: number;
    suggestions: string[];
  };
}

const Report: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 5,
    total: 0
  });

  const fetchReports = async (page = pagination.current) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:3001/api/urban_analysis/list?page=${page}&pageSize=${pagination.pageSize}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();

      if (data.success) {
        setReports(data.data.records);
        setPagination({
          ...pagination,
          current: page,
          total: data.data.total
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('获取报告列表失败:', error);
      message.error('获取报告列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条分析记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:3001/api/urban_analysis/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await response.json();
          if (data.success) {
            message.success('删除成功');
            fetchReports(pagination.current);
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          console.error('删除失败:', error);
          message.error('删除失败');
        }
      }
    });
  };

  const handleViewReport = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('请先登录');
        return;
      }

      const response = await fetch(`http://localhost:3001/api/urban_analysis/report/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // 如果是 PDF，直接下载
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `report_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('下载报告失败');
      }
    } catch (error) {
      console.error('获取报告失败:', error);
      message.error('获取报告失败');
    }
  };

  const columns: ColumnType<Report>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '分析图片',
      dataIndex: 'original_image',
      key: 'original_image',
      render: (text: string) => {
        const token = localStorage.getItem('token');
        const fileName = text.split('/').pop();
        
        return (
          <img 
            src={`http://localhost:3001/storage/uploads/${fileName}?token=${token}`} 
            alt="原始图片" 
            style={{ maxWidth: 100 }} 
            onError={(e) => {
              console.error('Image load error:', e); 
              const target = e.target as HTMLImageElement;
              console.log('Failed URL:', target.src);
              target.style.display = 'none';
            }}
          />
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleString()
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          processing: '处理中',
          completed: '已完成',
          failed: '失败'
        };
        return statusMap[status as keyof typeof statusMap] || status;
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center' as const,
      render: (_: any, record: Report) => (
        <Space size="middle">
          <Button 
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewReport(record.id)}
          >
            查看报告
          </Button>
          <Button 
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <FileTextOutlined />
            城市规划分析报告
          </Space>
          <Button 
            type="primary" 
            onClick={() => setModalVisible(true)}
          >
            新建分析
          </Button>
        </div>
      }>
        <Table
          columns={columns}
          dataSource={reports}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={(newPagination) => fetchReports(newPagination.current)}
        />
      </Card>

      <CreateAnalysisModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSuccess={() => {
          setModalVisible(false);
          fetchReports();
        }}
      />
    </div>
  );
};

export default Report;