import { Button, Input, Space, Table } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
const { Search } = Input;

const columns = [
  {
    title: 'Họ tên',
    dataIndex: 'user_id',
    key: 'user_id',
  },
  {
    title: 'Thông tin liên hệ',
    dataIndex: 'thong_tin_lien_he',
    key: 'thong_tin_lien_he',
    render: (text: { email: string; so_dien_thoai: string }) => (
      <div>
        <div>Email: <a href={`mailto:${text.email}`}>{text.email}</a></div>
        <div>Số điện thoại: <a href={`tel:${text.so_dien_thoai}`}>{text.so_dien_thoai}</a></div>
      </div>
    ),
  },
  {
    title: 'Nội dung',
    dataIndex: 'noi_dung',
    key: 'noi_dung',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'trang_thai',
    key: 'trang_thai',
  },
  {
    title: 'Thời gian',
    dataIndex: 'created_at',
    key: 'created_at',
  },
  {
    title: "Quản trị",
    key: "action",
    render: (_: any) => (
      <Space>
        <Link to={`/admin/support/feedback`}>
          <Button className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
            Xem chi tiết
          </Button>
        </Link>
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    user_id: 'Ngô toản',
    thong_tin_lien_he: {
        email: 'nqton301004@gmail.com',
        so_dien_thoai: '0123456789',
      },
    noi_dung: 'Tôi muốn mua hàng với số lượng lớn',
    created_at: '2021-10-10',
    trang_thai: 'Chưa phản hồi',
  },
  {
    key: '2',
    user_id: 'Ngo Toan',
    thong_tin_lien_he: {
        email: 'nqton301004@gmail.com',
        so_dien_thoai: '0123456789',
      },
    noi_dung: 'Tôi muốn mua hàng với số lượng lớn',
    created_at: '2021-10-10',
    trang_thai: 'Chưa phản hồi',
  },
  // Thêm dữ liệu mẫu khác ở đây...
];

import { useState, useEffect } from 'react';

const PageSupport: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a data fetch
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
        Quản trị / <span className="font-semibold px-px">Liên hệ khách hàng</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
      <h1 className="font-semibold md:text-3xl">Liên hệ khách hàng</h1>
      </div>
      <Search
        placeholder="Tìm kiếm"
        onSearch={(value) => console.log(value)}
        style={{ width: 300, marginBottom: 20 }}
      />

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        loading={isLoading}
      />
    </main>
  );
};

export default PageSupport;
