import React, { useState } from 'react';
import {
  Button,
  Popconfirm,
  Space,
  Table,
  Tag,
  Input,
  Select,
  DatePicker,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

interface RevenueDataType {
  key: React.Key;
  orderId: string;
  customerName: string;
  orderDate: string; // Để thuận tiện, giữ dưới dạng chuỗi ISO
  totalAmount: number;
  paymentStatus: string;
}

const columns: ColumnsType<RevenueDataType> = [
  {
    title: 'Mã đơn hàng',
    dataIndex: 'orderId',
  },
  {
    title: 'Tên khách hàng',
    dataIndex: 'customerName',
  },
  {
    title: 'Ngày đặt hàng',
    dataIndex: 'orderDate',
    render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
  },
  {
    title: 'Tổng tiền (VND)',
    dataIndex: 'totalAmount',
    render: (amount: number) => new Intl.NumberFormat('vi-VN').format(amount),
  },
  {
    title: 'Trạng thái thanh toán',
    dataIndex: 'paymentStatus',
    render: (status: string) =>
      status === 'Đã thanh toán' ? (
        <Tag color="green">Đã thanh toán</Tag>
      ) : (
        <Tag color="red">Chưa thanh toán</Tag>
      ),
  },
  {
    title: 'Hành động',
    key: 'action',
    render: (_, record) => (
      <Space>
        <Button type="primary">Chi tiết</Button>
        <Popconfirm
          title="Bạn có chắc muốn ẩn thông tin này không?"
          onConfirm={() => console.log('Ẩn thông tin:', record.key)}
        >
          <Button type="default" danger>
            Ẩn
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
];

const data: RevenueDataType[] = [
  {
    key: '1',
    orderId: 'DH001',
    customerName: 'Nguyễn Văn A',
    orderDate: '2024-09-01',
    totalAmount: 5000000,
    paymentStatus: 'Đã thanh toán',
  },
  {
    key: '2',
    orderId: 'DH002',
    customerName: 'Trần Thị B',
    orderDate: '2024-09-02',
    totalAmount: 2500000,
    paymentStatus: 'Chưa thanh toán',
  },
];

const RevenueAdmin: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDateRangeChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    setDateRange(dates);
  };

  const handleStatusFilterChange = (value: string | undefined) => {
    setStatusFilter(value);
  };

  const filteredData = data.filter(item => {
    const matchesSearch = item.customerName.toLowerCase().includes(searchText.toLowerCase());
    const matchesDate = dateRange
      ? dayjs(item.orderDate).isBetween(dateRange[0], dateRange[1], null, '[]')
      : true;
    const matchesStatus = statusFilter ? item.paymentStatus === statusFilter : true;
    return matchesSearch && matchesDate && matchesStatus;
  });

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold">Doanh thu</span>
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Quản lý doanh thu</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Tìm kiếm theo tên khách hàng"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 200 }}
          />
          <DatePicker.RangePicker
            format="DD/MM/YYYY"
            onChange={handleDateRangeChange}
          />
          <Select
            placeholder="Chọn trạng thái"
            onChange={handleStatusFilterChange}
            style={{ width: 200 }}
          >
            <Option value="Đã thanh toán">Đã thanh toán</Option>
            <Option value="Chưa thanh toán">Chưa thanh toán</Option>
          </Select>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <Table columns={columns} dataSource={filteredData} rowKey="key" />
      </div>
    </main>
  );
};

export default RevenueAdmin;
