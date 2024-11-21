import instance from "@/configs/admin";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  DatePicker,
  Input,
  Space,
  Table,
  TableColumnsType,
  TableProps,
  Tabs,
} from "antd";
import React, { useState, useEffect } from "react";

import TransportDetail from "./TransportDetail";
import { Link, useNavigate } from "react-router-dom";
import MainHeader from "./MainHeader";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];
const { RangePicker } = DatePicker;

interface TransportData extends Transport {
  key: React.Key;
  index: number;
}

interface Transport {
  don_hang: any;
  id: number;
  created_at: string;
  don_hang_id: number;
  shipper_id: number;
  ma_van_chuyen: string;
  trang_thai_van_chuyen: string;
  cod: number;
  tien_cod: number;
  anh_xac_thuc: string;
  khach_hang_xac_nhan: string;
  shipper_xac_nhan: string;
  so_lan_giao: string;
  ghi_chu: string;
}

const tabItems = [
  { label: "Đơn vận chuyển", key: "Tất cả" },
  { label: "Chờ xử lý", key: "Chờ xử lý" },
  { label: "Đang giao hàng", key: "Đang giao hàng" },
  { label: "Giao hàng thành công", key: "Giao hàng thành công" },
  { label: "Giao hàng thất bại", key: "Giao hàng thất bại" },
];

const AllTransport: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<Transport[]>([]);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Tất cả");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
  };

  const { data } = useQuery({
    queryKey: ["vanchuyen"],
    queryFn: async () => {
      const response = await instance.get(`/vanchuyen`);
      return response.data;
    },
  });
  const nav = useNavigate();
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    nav("/login");
  };

  useEffect(() => {
    if (data?.data) {
      let filtered = data.data;

      // Tìm kiếm theo mã vận chuyển
      if (searchText) {
        filtered = filtered.filter((item: Transport) =>
          item.ma_van_chuyen.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      // Lọc theo khoảng thời gian
      if (dateRange) {
        const [start, end] = dateRange;
        filtered = filtered.filter((item: Transport) => {
          const itemDate = new Date(item.created_at)
            .toISOString()
            .split("T")[0];
          return itemDate >= start && itemDate <= end;
        });
      }

      // Lọc theo trạng thái vận chuyển
      if (activeTab !== "Tất cả") {
        filtered = filtered.filter(
          (item: Transport) => item.trang_thai_van_chuyen === activeTab
        );
      }

      // Sắp xếp để đơn vận chuyển mới nhất lên trên cùng
      filtered = filtered.sort((a: any, b: any) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });

      setFilteredData(filtered);
    }
  }, [searchText, dateRange, activeTab, data]);

  const columns: TableColumnsType<{
    id: number;
    created_at: string;
    don_hang_id: number;
    trang_thai_van_chuyen: string;
  }> = [
    {
      title: "Tất cả",
      className: "text-xl w-1/2",
      dataIndex: "created_at",
      key: "created_at",
      render: (_, record) => (
        <div className="border rounded-lg p-4 mb-4">
          <TransportDetail record={record} />
        </div>
      ),
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-0 p-0 lg:gap-6 lg:px-6 lg:py-10 container">
      <MainHeader /> {/* Logo và các thành phần khác trong MainHeader */}
      {/* Các thành phần còn lại */}
      <h1 className="text-2xl mx-2 font-medium">Đơn hàng vận chuyển</h1>
      <div className="lg:mx-10 mx-3 bg-white">
        <Tabs
          defaultActiveKey="Tất cả"
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={tabItems}
        />
        <div className="mb-4">
          <Space>
            <Input
              placeholder="Tìm kiếm"
              prefix={<SearchOutlined />}
              onChange={handleSearchChange}
            />
            <RangePicker onChange={handleDateRangeChange} />
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10, className: "my-5" }}
        />
      </div>
    </main>
  );
};

export default AllTransport;
