import React, { useState, useEffect } from "react";
// import { SearchOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Tag,
  Space,
  Button,
  Input,
  DatePicker,
  message,
  Flex,
  Tabs,
  Popconfirm,
  Image,
} from "antd";
import type { TableColumnsType, TableProps } from "antd";
// import type { FilterDropdownProps } from "antd/es/table/interface";
// import Highlighter from "react-highlight-words";
import instance from "@/configs/admin";
import RefundDetail from "./RefundDetail";
import OrderDetail from "../_component/Detaile";

const { RangePicker } = DatePicker;
const { Search } = Input;

interface RefundRequest {
  id: number;
  so_tien_hoan: number;
  ly_do: string;
  trang_thai: string;
  thoi_gian_hoan: string;
  don_hang: {
    ma_don_hang: string;
    tong_tien_don_hang: number;
    trang_thai_don_hang: string;
  };
}

// const statusOptions = [
//   { value: "hoan_thanh_cong", label: "Xác nhận đơn hoàn" },
//   { value: "tu_choi", label: "Từ chối" }
// ];

const RefundRequests: React.FC = () => {
  //   const [searchText, setSearchText] = useState("");
  //   const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [activeTab, setActiveTab] = useState<string>("Tất cả");
  const [filteredData, setFilteredData] = useState<RefundRequest[]>([]);
  //   const searchInput = useRef<InputRef>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["refund-requests"],
    queryFn: async () => {
      const res = await instance.get("/donhanghoan");
      return res.data;
    },
  });
  console.log(data);
  useEffect(() => {
    if (data?.data) {
      if (activeTab === "Tất cả") {
        setFilteredData(data.data);
      } else {
        const filtered = data.data.filter(
          (item: RefundRequest) => item.trang_thai === activeTab
        );
        setFilteredData(filtered);
      }
    }
  }, [data, activeTab]);
  const [actedItems, setActedItems] = useState<number[]>(() => {
    const saved = localStorage.getItem("actedItems");
    return saved ? JSON.parse(saved) : [];
  });

  const { mutate } = useMutation({
    mutationFn: async ({
      ids,
      status,
    }: {
      ids: React.Key[];
      status: string;
    }) => {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append(
        "trang_thai",
        status === "accept" ? "hoan_thanh_cong" : "tu_choi"
      );

      const response = await instance.post(
        `/donhang/xac-nhan-hoan-hang/${ids[0]}`,
        formData
      );

      // Update localStorage when adding new acted items
      const newActedItems = [...actedItems, ids[0] as number];
      setActedItems(newActedItems);
      localStorage.setItem("actedItems", JSON.stringify(newActedItems));

      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật trạng thái thành công");
      queryClient.invalidateQueries({ queryKey: ["refund-requests"] });
      setSelectedRowKeys([]);
    },
  });

  const handleTotalSearch = (value: string) => {
    if (value) {
      const filtered = data?.data.filter((item: RefundRequest) => {
        return (
          item.don_hang.ma_don_hang
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item.ly_do.toLowerCase().includes(value.toLowerCase()) ||
          item.trang_thai.toLowerCase().includes(value.toLowerCase()) ||
          item.don_hang.trang_thai_don_hang
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      });
      setFilteredData(filtered || []);
    } else {
      setFilteredData(data?.data || []);
    }
  };

  const handleDateChange = (_: any, dateStrings: [string, string]) => {
    if (dateStrings[0] && dateStrings[1]) {
      const startDate = new Date(dateStrings[0]);
      const endDate = new Date(dateStrings[1]);
      const filtered = data?.data.filter((item: RefundRequest) => {
        const itemDate = new Date(item.thoi_gian_hoan);
        return itemDate >= startDate && itemDate <= endDate;
      });
      setFilteredData(filtered || []);
    } else {
      setFilteredData(data?.data || []);
    }
  };

  const tabItems = [
    { label: "Tất cả", key: "Tất cả" },
    { label: "Chờ xác nhận hoàn hàng", key: "cho_xac_nhan" },
    { label: "Hoàn hàng", key: "hoan_thanh_cong" },
    { label: "Từ chối", key: "tu_choi" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "cho_xac_nhan":
        return "blue";
      case "hoan_thanh_cong":
        return "green";
      case "tu_choi":
        return "red";
      default:
        return "default";
    }
  };

  const columns: TableColumnsType<RefundRequest> = [
    {
      title: "Mã đơn hàng",
      dataIndex: ["don_hang", "ma_don_hang"],
      key: "ma_don_hang",
      width: "15%",
      render: (_, record) => (
        <div className="">
          <OrderDetail record={record?.don_hang?.ma_don_hang} />
        </div>
      ),
    },
    {
      title: "Số tiền hoàn",
      dataIndex: "so_tien_hoan",
      key: "so_tien_hoan",
      width: "15%",
      render: (amount) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(amount),
    },
    {
      title: "Hình ảnh minh chứng",
      dataIndex: "don_hang",
      width: "20%",
      render: (value) => (
        <Image
          src={value.hinh_anh_hoan_tra}
          alt="minh chứng"
          width={100}
          height={100}
          className="rounded-md object-cover"
          preview={{
            mask: "Click", // Văn bản hiển thị khi hover vào ảnh
          }}
        />
      ),
    },
    {
      title: "Lý do",
      dataIndex: "ly_do",
      key: "ly_do",
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      width: "15%",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === "cho_xac_nhan"
            ? "Chờ xác nhận hoàn hàng"
            : status === "hoan_thanh_cong"
              ? "Đã xác nhận"
              : "Từ chối"}
        </Tag>
      ),
    },
    {
      title: "Thời gian hoàn",
      dataIndex: "thoi_gian_hoan",
      key: "thoi_gian_hoan",
      width: "15%",
    },
    // {
    //     title: "Thao tác",
    //     key: "action",
    //     width: "20%",
    //     render: (_, record) => (
    //         <Space>
    //             {record.trang_thai === "cho_xac_nhan" && (
    //                 <>
    //                     <Popconfirm
    //                         title="Xác nhận yêu cầu"
    //                         description="Bạn có chắc chắn muốn xác nhận yêu cầu này?"
    //                         onConfirm={() => mutate({ ids: [record.id], status: "accept" })}
    //                         okButtonProps={{
    //                             className: "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border-none font-medium"
    //                         }}
    //                         cancelButtonProps={{
    //                             className: "hover:bg-gray-100 border border-gray-300 text-gray-600 font-medium"
    //                         }}
    //                         okText="Xác nhận"
    //                         cancelText="Hủy"
    //                     >
    //                         <Button
    //                             className="bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold"
    //                         >
    //                             Xác nhận
    //                         </Button>
    //                     </Popconfirm>

    //                     <Popconfirm
    //                         title="Từ chối yêu cầu"
    //                         description="Bạn có chắc chắn muốn từ chối yêu cầu này?"
    //                         onConfirm={() => mutate({ ids: [record.id], status: "reject" })}
    //                         okButtonProps={{
    //                             className: "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border-none font-medium"
    //                         }}
    //                         cancelButtonProps={{
    //                             className: "hover:bg-gray-100 border border-gray-300 text-gray-600 font-medium"
    //                         }}
    //                         okText="Xác nhận"
    //                         cancelText="Hủy"
    //                     >
    //                         <Button
    //                             className="bg-gradient-to-l from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-bold border border-red-300"
    //                         >
    //                             Từ chối
    //                         </Button>
    //                     </Popconfirm>
    //                 </>
    //             )}
    //             <RefundDetail record={record} />
    //         </Space>
    //     ),
    // }
    {
      title: "Thao tác",
      key: "action",
      width: "20%",
      render: (_, record) => (
        <Space>
          {!actedItems.includes(record.id) &&
            record.trang_thai === "cho_xac_nhan" && (
              <>
                <Popconfirm
                  title="Xác nhận yêu cầu"
                  description="Bạn có chắc chắn muốn xác nhận yêu cầu này?"
                  onConfirm={() =>
                    mutate({ ids: [record.id], status: "accept" })
                  }
                  okButtonProps={{
                    className:
                      "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border-none font-medium",
                  }}
                  cancelButtonProps={{
                    className:
                      "hover:bg-gray-100 border border-gray-300 text-gray-600 font-medium",
                  }}
                  okText="Xác nhận"
                  cancelText="Hủy"
                >
                  <Button className="bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold">
                    Xác nhận
                  </Button>
                </Popconfirm>

                <Popconfirm
                  title="Từ chối yêu cầu"
                  description="Bạn có chắc chắn muốn từ chối yêu cầu này?"
                  onConfirm={() =>
                    mutate({ ids: [record.id], status: "reject" })
                  }
                  okButtonProps={{
                    className:
                      "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border-none font-medium",
                  }}
                  cancelButtonProps={{
                    className:
                      "hover:bg-gray-100 border border-gray-300 text-gray-600 font-medium",
                  }}
                  okText="Xác nhận"
                  cancelText="Hủy"
                >
                  <Button className="bg-gradient-to-l from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-bold border border-red-300">
                    Từ chối
                  </Button>
                </Popconfirm>
              </>
            )}
          <RefundDetail record={record} />
        </Space>
      ),
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold">Yêu cầu hoàn hàng</span>
        </h1>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Yêu cầu hoàn hàng</h1>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      <Flex gap="middle" vertical>
        <Flex align="center" gap="middle">
          <Space>
            <Search
              placeholder="Tìm kiếm..."
              allowClear
              onSearch={handleTotalSearch}
              style={{ width: 300 }}
            />

            <RangePicker onChange={handleDateChange} />
          </Space>
        </Flex>

        <Table
          // rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          loading={isLoading}
          pagination={{
            pageSize: 10,
            className: "my-5",
          }}
          rowKey="id"
        />
      </Flex>
    </main>
  );
};

export default RefundRequests;
