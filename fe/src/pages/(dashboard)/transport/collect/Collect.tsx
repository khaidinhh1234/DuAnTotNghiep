import React from 'react';
import { Table, Tabs, Input, Tag, Button } from 'antd';
import { Link } from 'react-router-dom';

const { TabPane } = Tabs;
const { Search } = Input;

const columns = [
  {
    title: 'Mã vận chuyển',
    dataIndex: 'trackingCode',
    key: 'trackingCode',
  },
  {
    title: 'Mã đơn hàng',
    dataIndex: 'orderCode',
    key: 'orderCode',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: 'Mã vận đơn',
    dataIndex: 'shippingCode',
    key: 'shippingCode',
  },
  {
    title: 'Nhà vận chuyển',
    dataIndex: 'courier',
    key: 'courier',
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'creationDate',
    key: 'creationDate',
  },
  {
    title: 'COD',
    dataIndex: 'codStatus',
    key: 'codStatus',
    render: (codStatus: string) => (
      <Tag color={codStatus === 'Chưa nhận' ? 'orange' : 'green'}>
        {codStatus}
      </Tag>
    ),
  },
  {
    title: 'Đối soát',
    dataIndex: 'reconciliationStatus',
    key: 'reconciliationStatus',
    render: (status: string) => (
      <Tag color={status === 'Chưa đối soát' ? 'orange' : 'green'}>
        {status}
      </Tag>
    ),
  },
  {
    title: 'Tiền COD',
    dataIndex: 'codAmount',
    key: 'codAmount',
  },
];

const data = [
  {
    key: '1',
    trackingCode: '110654377',
    orderCode: 'JUN0105926',
    shippingCode: 'E08150329888',
    courier: 'Nhất Tín Express',
    creationDate: '04/10/2022 12:44 SA',
    codStatus: 'Chưa nhận',
    reconciliationStatus: 'Chưa đối soát',
    codAmount: '300,000 đ',
  },
  {
    key: '2',
    trackingCode: '110654329',
    orderCode: 'JUN0105925',
    shippingCode: '--',
    courier: 'Khác',
    creationDate: 'Hôm qua 10:02 SA',
    codStatus: 'Chưa nhận',
    reconciliationStatus: 'Chưa đối soát',
    codAmount: '1,015,000 đ',
  },
  // Thêm dữ liệu mẫu khác ở đây...
];

const Collect: React.FC = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Vận chuyển /{" "}
          <span className="font-semibold px-px">Tất cả đơn hàng</span>
        </h1>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/transport" className="mr-1">
            <Button className="ml-auto bg-black text-white rounded-lg py-1">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs for filters */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="Tất cả" key="1"></TabPane>
        <TabPane tab="Đã đối soát, chưa nhận" key="2"></TabPane>
        <TabPane tab="Đã nhận" key="3"></TabPane>
        <TabPane tab="Đã giao, chưa nhận" key="4"></TabPane>
        <TabPane tab="Đang giao hàng" key="5"></TabPane>
      </Tabs>

      {/* Search bar */}
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
      />
    </main>
  );
};

export default Collect;
