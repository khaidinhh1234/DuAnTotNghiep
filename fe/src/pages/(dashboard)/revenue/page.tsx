import React, { useState } from "react";
import {
  Button,
  Popconfirm,
  Space,
  Table,
  Tag,
  Input,
  Select,
  DatePicker,
  Card,
  Statistic,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);
import { Line } from "recharts";

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
    title: "Mã đơn hàng",
    dataIndex: "orderId",
  },
  {
    title: "Tên khách hàng",
    dataIndex: "customerName",
  },
  {
    title: "Ngày đặt hàng",
    dataIndex: "orderDate",
    render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
  },
  {
    title: "Tổng tiền (VND)",
    dataIndex: "totalAmount",
    render: (amount: number) => new Intl.NumberFormat("vi-VN").format(amount),
  },
  {
    title: "Trạng thái thanh toán",
    dataIndex: "paymentStatus",
    render: (status: string) =>
      status === "Đã thanh toán" ? (
        <Tag color="green">Đã thanh toán</Tag>
      ) : (
        <Tag color="red">Chưa thanh toán</Tag>
      ),
  },
  {
    title: "Hành động",
    key: "action",
    render: (_, record) => (
      <Space>
        <Button type="primary">Chi tiết</Button>
        <Popconfirm
          title="Bạn có chắc muốn ẩn thông tin này không?"
          onConfirm={() => console.log("Ẩn thông tin:", record.key)}
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
    key: "1",
    orderId: "DH001",
    customerName: "Nguyễn Văn A",
    orderDate: "2024-09-01",
    totalAmount: 5000000,
    paymentStatus: "Đã thanh toán",
  },
  {
    key: "2",
    orderId: "DH002",
    customerName: "Trần Thị B",
    orderDate: "2024-09-02",
    totalAmount: 2500000,
    paymentStatus: "Chưa thanh toán",
  },
];

const RevenueAdmin: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDateRangeChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    setDateRange(dates);
  };

  const handleStatusFilterChange = (value: string | undefined) => {
    setStatusFilter(value);
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = item.customerName
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesDate = dateRange
      ? dayjs(item.orderDate).isBetween(dateRange[0], dateRange[1], null, "[]")
      : true;
    const matchesStatus = statusFilter
      ? item.paymentStatus === statusFilter
      : true;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const totalRevenue = filteredData.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );
  const totalOrders = filteredData.length;
  const paidOrders = filteredData.filter(
    (item) => item.paymentStatus === "Đã thanh toán"
  ).length;
  const unpaidOrders = filteredData.filter(
    (item) => item.paymentStatus === "Chưa thanh toán"
  ).length;

  const revenueByMonth = [
    { month: "01/2024", revenue: 5000000 },
    { month: "02/2024", revenue: 4500000 },
    // Add more data
  ];

  const config = {
    data: revenueByMonth,
    xField: "month",
    yField: "revenue",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
    xAxis: {
      label: {
        formatter: (v: any) => dayjs(v).format("MM/YYYY"),
      },
    },
    yAxis: {
      label: {
        formatter: (v: any) => new Intl.NumberFormat("vi-VN").format(v),
      },
    },
    smooth: true,
  };

  return (
    <main className="flex flex-col gap-6 p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold">Quản lý doanh thu</h1>
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-4">
          <Input
            placeholder="Tìm kiếm theo tên khách hàng"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-80"
          />
          <DatePicker.RangePicker
            format="DD/MM/YYYY"
            onChange={(dates) =>
              handleDateRangeChange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)
            }
            className="w-80"
          />
          <Select
            placeholder="Chọn trạng thái"
            onChange={handleStatusFilterChange}
            className="w-80"
          >
            <Option value="Đã thanh toán">Đã thanh toán</Option>
            <Option value="Chưa thanh toán">Chưa thanh toán</Option>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <Statistic
            title="Tổng doanh thu (VND)"
            value={new Intl.NumberFormat("vi-VN").format(totalRevenue)}
          />
        </Card>
        <Card>
          <Statistic title="Số đơn hàng" value={totalOrders} />
        </Card>
        <Card>
          <Statistic title="Đã thanh toán" value={paidOrders} />
        </Card>
        <Card>
          <Statistic title="Chưa thanh toán" value={unpaidOrders} />
        </Card>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="key"
          pagination={{ pageSize: 10, className: "my-5" }}
        />
      </div>
    </main>
  );
};

export default RevenueAdmin;
