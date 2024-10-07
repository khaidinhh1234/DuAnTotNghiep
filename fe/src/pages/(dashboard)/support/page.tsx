import { Button, Input, Space, Table, TableColumnsType } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import instance from '@/configs/admin';
import dayjs from 'dayjs';
const { Search } = Input;
interface Support {
  id: string | number,
  user_id: string | number,
  name: string
  sdt_lien_he: number
  email: string
  noi_dung_lien_he: string,
  trang_thai_lien_he: string,
  created_at: string,
}




const PageSupport: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { data } = useQuery({
    queryKey: ['support'],
    queryFn: async () => {
      const res = await instance.get(`/lien-he`)
      return res.data
    }
  })
  const dataSource = data?.data.map((support: Support, index: number ) => ({
    key: support.id,
   ...support,
   index: index + 1
  })) || [];
  const columns: TableColumnsType<Support> = [
    {
      title: 'ID',
      dataIndex: 'index',
      key: 'id',
    },
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Thông tin liên hệ',
      dataIndex: '',
      key: 'thong_tin_lien_he',
      render: (text: { email: string; sdt_lien_he: string }) => (
        <div>
          <div><strong>Email</strong>: <a href={`mailto:${text.email}`}>{text.email}</a></div>
          <div><strong>Số điện thoại</strong>: <a href={`tel:${text.sdt_lien_he}`}>{text.sdt_lien_he}</a></div>
        </div>
      ),
    },
    {
      title: 'Nội dung',
      dataIndex: 'noi_dung_lien_he',
      key: 'noi_dung_lien_he',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai_lien_he',
      key: 'trang_thai_lien_he',
      render: (_, record) => {
        return (
          <div className={'font-bold text-[15px] ' + 
          (record.trang_thai_lien_he === "da_xu_ly"
             ? "text-green-500"
              : record.trang_thai_lien_he === "chua_xu_ly"
               ? "text-yellow-500"
                : '')
          }    
          >
            {record.trang_thai_lien_he === "da_xu_ly"
             ? "Đã xử lý"
              : record.trang_thai_lien_he === "chua_xu_ly"
               ? "Chưa xử lý"
                : ""}
          </div>
        );
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at: string) => dayjs(created_at).format('DD/MM/YYYY HH:mm') || "Không có dữ liệu",
    },
    {
      title: "Quản trị",
      key: "action",
      render: (_: any) => (
        <Space>
          <Link to={`/admin/support/feedback`}>
            <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              Xem chi tiết
            </Button>
          </Link>
        </Space>
      ),
    },
  ];
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
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
        loading={isLoading}
      />
    </main>
  );
};

export default PageSupport;
