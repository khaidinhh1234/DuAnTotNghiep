// import { SearchOutlined } from "@ant-design/icons";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { 
//   Button, DatePicker, Flex, Input, message, 
//   Popconfirm, Select, Space, Spin, Table, Tabs 
// } from "antd";
// import type { InputRef, TableColumnsType } from "antd";
// import React, { useEffect, useRef, useState } from "react";
// import Highlighter from "react-highlight-words";
// import instance from "@/configs/admin";

// const { RangePicker } = DatePicker;

// interface ReturnOrderType {
//   id: number;
//   don_hang_id: number;
//   user_id: number;
//   shipper_id: number;
//   ma_hoan_hang: string;
//   ngay_tao: string;
//   trang_thai_hoan_hang: string;
//   ngay_lay_hang: string | null;
//   ngay_hoan_hang_thanh_cong: string | null;
//   created_at: string;
//   updated_at: string;
//   hoan_tien_id: number;
// }

// const ReturnOrders1: React.FC = () => {
//   const [searchText, setSearchText] = useState("");
//   const [filteredData, setFilteredData] = useState<ReturnOrderType[]>([]);
//   const searchInput = useRef<InputRef>(null);

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["RETURN_ORDERS"],
//     queryFn: async () => {
//       const response = await instance.get("/hoanhang/danh-sach");
//       return response.data;
//     },
//   });

//   const returnOrders: ReturnOrderType[] | undefined = data?.data;

//   const columns: TableColumnsType<ReturnOrderType> = [
//     {
//       title: "Mã hoàn hàng",
//       dataIndex: "ma_hoan_hang",
//       key: "ma_hoan_hang",
//       sorter: (a, b) => a.ma_hoan_hang.localeCompare(b.ma_hoan_hang),
//     },
//     {
//       title: "Ngày tạo",
//       dataIndex: "ngay_tao",
//       key: "ngay_tao",
//       render: (date) => new Date(date).toLocaleDateString("vi-VN"),
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "trang_thai_hoan_hang",
//       key: "trang_thai_hoan_hang",
//       render: (status) => (
//         <div className={`font-bold ${
//           status === "Trả hàng thành công" ? "text-green-500" :
//           status === "Chờ lấy hàng hoàn" ? "text-yellow-500" :
//           "text-gray-500"
//         }`}>
//           {status}
//         </div>
//       ),
//     },
//     {
//       title: "Mã đơn hàng",
//       dataIndex: "don_hang_id",
//       key: "don_hang_id",
//     }
//   ];

//   useEffect(() => {
//     if (returnOrders) {
//       setFilteredData(returnOrders);
//     }
//   }, [returnOrders]);

//   const handleDateChange = (_: any, dateStrings: [string, string]) => {
//     const [startDate, endDate] = dateStrings;
//     const filtered = returnOrders?.filter((record) => {
//       const recordDate = new Date(record.ngay_tao);
//       return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
//     });
//     setFilteredData(filtered || []);
//   };

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const searchValue = e.target.value.toLowerCase();
//     const filtered = returnOrders?.filter((item) => 
//       item.ma_hoan_hang.toLowerCase().includes(searchValue) ||
//       item.trang_thai_hoan_hang.toLowerCase().includes(searchValue)
//     );
//     setFilteredData(filtered || []);
//     setSearchText(searchValue);
//   };
//   const [activeTab, setActiveTab] = useState<string>("Tất cả");

//   const tabItems = [
//     { label: "Tổng đơn hàng", key: "Tất cả" },
//     { label: "Chờ lấy hàng hoàn", key: "Chờ lấy hàng hoàn" },
//     { label: "Đang vận chuyển", key: "Đang vận chuyển" },
//     { label: "Trả hàng thành công", key: "Trả hàng thành công" },

//   ];
//   if (isLoading) return (
//     <div className="flex items-center justify-center mt-[250px]">
//       <Spin size="large" />
//     </div>
//   );

//   if (isError) return <div>Error loading return orders</div>;

//   return (
//     <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//       <div className="flex items-center justify-between">
//         <h1 className="font-semibold md:text-3xl">Quản lý hoàn hàng</h1>
//       </div>
//       <Tabs
//           defaultActiveKey="Tất cả"
//           activeKey={activeTab}
//           onChange={(key) => setActiveTab(key)}
//           items={tabItems}
//         />
//       <Flex gap="middle" vertical>
//         <div className="flex gap-3">
//           <Space>
//             <Input
//               placeholder="Tìm kiếm"
//               prefix={<SearchOutlined />}
//               onChange={handleSearch}
//               value={searchText}
//             />
//             <RangePicker onChange={handleDateChange} />
//           </Space>
//         </div>

//         <Table<ReturnOrderType>
//           columns={columns}
//           dataSource={filteredData}
//           loading={isLoading}
//           pagination={{ pageSize: 10 }}
//           rowKey="id"
//         />
//       </Flex>
//     </main>
//   );
// };

// export default ReturnOrders1;
import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, DatePicker, Flex, Input, Spin, Table, Tabs } from "antd";
import type { InputRef, TableColumnsType } from "antd";
import React, { useEffect, useRef, useState } from "react";
import instance from "@/configs/admin";
import Detail from "./detail";

const { RangePicker } = DatePicker;

interface ReturnOrderType {
  id: number;
  don_hang_id: number;
  user_id: number;
  shipper_id: number;
  ma_hoan_hang: string;
  ngay_tao: string;
  trang_thai_hoan_hang: string;
  ngay_lay_hang: string | null;
  ngay_hoan_hang_thanh_cong: string | null;
  created_at: string;
  updated_at: string;
  hoan_tien_id: number;
}

const ReturnOrders1: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<ReturnOrderType[]>([]);
  const [activeTab, setActiveTab] = useState<string>("Tất cả");
  const searchInput = useRef<InputRef>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["RETURN_ORDERS"],
    queryFn: async () => {
      const response = await instance.get("/hoanhang/danh-sach");
      return response.data;
    },
  });

  const returnOrders: ReturnOrderType[] | undefined = data?.data;

  const columns: TableColumnsType<ReturnOrderType> = [
    {
      title: "Mã hoàn hàng",
      dataIndex: "ma_hoan_hang",
      key: "ma_hoan_hang",
      sorter: (a, b) => a.ma_hoan_hang.localeCompare(b.ma_hoan_hang),
    },
    {
      title: "Ngày tạo",
      dataIndex: "ngay_tao",
      key: "ngay_tao",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
      sorter: (a, b) => new Date(a.ngay_tao).getTime() - new Date(b.ngay_tao).getTime(),
    },
   
      {
        title: "Ngày lấy hàng",
        dataIndex: "ngay_lay_hang",
        key: "ngay_lay_hang",
        render: (date) => date ? new Date(date).toLocaleDateString("vi-VN") : "Chưa lấy hàng",
      },
      {
        title: "Ngày hoàn thành",
        dataIndex: "ngay_hoan_hang_thanh_cong",
        key: "ngay_hoan_hang_thanh_cong",
        render: (date) => date ? new Date(date).toLocaleDateString("vi-VN") : "Chưa hoàn thành",
      },
      {
        title: "Trạng thái",
        dataIndex: "trang_thai_hoan_hang",
        key: "trang_thai_hoan_hang",
        render: (status) => (
          <div
          className={`font-bold ${
            status === "Trả hàng thành công"
              ? "text-green-500"
              : status === "Chờ lấy hàng hoàn"
              ? "text-yellow-500"
              : status === "Đang vận chuyển"
              ? "text-blue-500"
              : "text-gray-500"
          }`}
        >
          {status}
        </div>
        
        ),
      },
      {
        title: "Quản trị",
        dataIndex: "products",
        render: (_, record) => <Detail record={record} />,
      },
  ];

  useEffect(() => {
    if (returnOrders) {
      const filtered = returnOrders.filter((order) => {
        const matchesSearch =
          searchText === "" ||
          order.ma_hoan_hang.toLowerCase().includes(searchText.toLowerCase()) ||
          order.trang_thai_hoan_hang.toLowerCase().includes(searchText.toLowerCase());

        const matchesTab =
          activeTab === "Tất cả" || order.trang_thai_hoan_hang === activeTab;

        return matchesSearch && matchesTab;
      });
      setFilteredData(filtered);
    }
  }, [returnOrders, searchText, activeTab]);

  const handleDateChange = (_: any, dateStrings: [string, string]) => {
    const [startDate, endDate] = dateStrings;
    if (!startDate || !endDate) {
      setFilteredData(returnOrders || []);
      return;
    }

    const filtered = returnOrders?.filter((record) => {
      const recordDate = new Date(record.ngay_tao);
      return (
        recordDate >= new Date(startDate) &&
        recordDate <= new Date(endDate) &&
        (activeTab === "Tất cả" || record.trang_thai_hoan_hang === activeTab)
      );
    });
    setFilteredData(filtered || []);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const tabItems = [
    { label: "Tổng đơn hàng", key: "Tất cả" },
    { label: "Chờ lấy hàng hoàn", key: "Chờ lấy hàng hoàn" },
    { label: "Đang vận chuyển", key: "Đang vận chuyển" },
    { label: "Trả hàng thành công", key: "Trả hàng thành công" },
  ];

  if (isLoading)
    return (
      <div className="flex items-center justify-center mt-[250px]">
        <Spin size="large" />
      </div>
    );

  if (isError) return <div>Error loading return orders</div>;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <strong>Vận chuyển</strong>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Hoàn hàng</h1>
      </div>
      
      <Tabs
        defaultActiveKey="Tất cả"
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        items={tabItems}
      />

      <Flex gap="middle" vertical>
        <div className="flex gap-3">
          <Input
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined />}
            onChange={handleSearch}
            value={searchText}
            style={{ width: 300 }}
          />
          <RangePicker onChange={handleDateChange} />
        </div>

        <Table<ReturnOrderType>
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          pagination={{ pageSize: 10, className: "my-5" }}
          rowKey="id"
        />
      </Flex>
    </main>
  );
};

export default ReturnOrders1;
