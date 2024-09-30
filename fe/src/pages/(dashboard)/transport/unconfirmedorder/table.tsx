import React from 'react';
import { Table, Tag, Space, Button, Input, Select, DatePicker } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface OrderData {
  key: string;
  orderCode: string;
  date: string;
  customer: string;
  status: string;
  payment: string;
  delivery: string;
  total: string;
}

const data: OrderData[] = [
  {
    key: '1',
    orderCode: '#CS-HRV107773',
    date: '01/11/2023 02:20 CH',
    customer: 'Thanh',
    status: 'Chờ xử lý',
    payment: 'Chờ thanh toán',
    delivery: 'Chưa xác nhận',
    total: '15,000 ₫',
  },
  {
    key: '2',
    orderCode: '#CS-HRV107772',
    date: '01/11/2023 02:16 CH',
    customer: 'Võ Quốc Thịnh',
    status: 'Chờ xử lý',
    payment: 'Chờ thanh toán',
    delivery: 'Chưa xác nhận',
    total: '30,000 ₫',
  },
  {
    key: '3',
    orderCode: '#CS-HRV107741',
    date: '30/10/2023 09:40 CH',
    customer: 'Kunni Phạm',
    status: 'Chờ xử lý',
    payment: 'Đã thanh toán',
    delivery: 'Chưa xác nhận',
    total: '250,000 ₫',
  },
];

const TableUncomfirmedOrder: React.FC = () => {
  const columns: ColumnsType<OrderData> = [
    {
      title: 'Mã',
      dataIndex: 'orderCode',
      key: 'orderCode',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Thanh toán',
      dataIndex: 'payment',
      key: 'payment',
      render: (payment) => {
        let color = payment === 'Đã thanh toán' ? 'green' : 'blue';
        return <Tag color={color}>{payment}</Tag>;
      },
    },
    {
      title: 'Giao hàng',
      dataIndex: 'delivery',
      key: 'delivery',
      render: (delivery) => {
        let color = delivery === 'Chưa xác nhận' ? 'orange' : 'blue';
        return <Tag color={color}>{delivery}</Tag>;
      },
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button>Chi tiết</Button>
        </Space>
      ),
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Vận chuyển /
          <span className="font-semibold px-px">Chưa xác nhận đơn hàng</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        {/* <h1 className="font-semibold md:text-3xl">Thêm hạng thành viên</h1> */}
        <div>
          <Link to="/admin/transport" className="mr-1">
            <Button className="ml-auto bg-black text-white rounded-lg py-1">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
        <div >
      {/* Bộ lọc tìm kiếm */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input placeholder="Tìm kiếm" prefix={<SearchOutlined />} />
          <Select defaultValue="Tất cả đơn hàng" style={{ width: 200 }}>
            <Option value="tatca">Tất cả đơn hàng</Option>
            <Option value="choxuly">Chờ xử lý</Option>
          </Select>
          <RangePicker />
          <Button icon={<FilterOutlined />}>Thêm điều kiện lọc</Button>
        </Space>
      </div>

      {/* Bảng đơn hàng */}
      <Table columns={columns} dataSource={data} />
    </div>
    </main>
  );
};

export default TableUncomfirmedOrder;
