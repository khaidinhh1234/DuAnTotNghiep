import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import instance from '@/configs/axios';
import { Spin, Typography, Button, Card, Divider } from 'antd';

const { Title, Text } = Typography;

const ViewNew: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['news', id],
    queryFn: async () => {
      const response = await instance.get(`/admin/tintuc/${id}`);
      return response.data;
    },
    enabled: !!id, // Chỉ gọi API khi có id
  });

  if (isLoading) return <div style={{ textAlign: 'center', marginTop: '20%' }}><Spin size="large" /></div>;
  if (isError) return <Text type="danger" style={{ textAlign: 'center' }}>Lỗi khi lấy thông tin bài viết.</Text>;

  const { tieu_de, user, danh_muc_tin_tuc, noi_dung, created_at } = data.data;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card bordered={false} style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
        <Title level={2} style={{ color: '#1890ff' }}>{tieu_de}</Title>
        <Text strong style={{ color: '#555' }}>Tác giả: {user?.ten || 'Chưa có dữ liệu'}</Text>
        <br />
        <Text style={{ color: '#555' }}>Danh mục: {danh_muc_tin_tuc?.ten_danh_muc_tin_tuc || 'Chưa có dữ liệu'}</Text>
        <br />
        <Text style={{ color: '#555' }}>Ngày tạo: {new Date(created_at).toLocaleDateString()}</Text>
        <Divider />
        <Text strong style={{ fontSize: '16px' }}>Nội dung:</Text>
        <div 
          className="mt-2"
          style={{ border: '1px solid #eaeaea', padding: '16px', borderRadius: '4px', backgroundColor: '#fafafa' }}
          dangerouslySetInnerHTML={{ __html: noi_dung }}
        />
        <Divider />
        <Button 
          type="primary" 
          size="large" 
          onClick={() => navigate('/admin/news')} 
          style={{ borderRadius: '4px', float: 'right' }}
        >
          Quay lại
        </Button>
      </Card>
    </div>
  );
};

export default ViewNew;
