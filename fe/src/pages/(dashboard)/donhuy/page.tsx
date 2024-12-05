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
import DonhuyDetail from "./detail";
import FormatDate from "@/components/hook/formatdata";
import Notehuy from "./notehuy";
// import RefundDetail from "./RefundDetail";

const { RangePicker } = DatePicker;
const { Search } = Input;

interface RefundRequest {
  id: number;
  so_tien_hoan: number;
  ly_do: string;
  trang_thai: string;
  thoi_gian_hoan: string;
  trang_thai_thanh_toan: string;

  ten_nguoi_dat_hang: string;

  ma_don_hang: string;
  tong_tien_don_hang: number;
  trang_thai_don_hang: string;
  created_at: string;
}

type TableRowSelection<T> = TableProps<T>["rowSelection"];

// const statusOptions = [
//   { value: "hoan_thanh_cong", label: "Xác nhận đơn hoàn" },
//   { value: "tu_choi", label: "Từ chối" }
// ];

const Donhuy: React.FC = () => {
  //   const [searchText, setSearchText] = useState("");
  //   const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [activeTab, setActiveTab] = useState<string>("Tất cả");
  const [filteredData, setFilteredData] = useState<RefundRequest[]>([]);
  //   const searchInput = useRef<InputRef>(null);
  console.log("selectedRowKeys", filteredData);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["donhuy"],
    queryFn: async () => {
      const res = await instance.get("/danh-sach-don-huy");
      return res.data.data;
    },
  });
  console.log(data);
  // useEffect(() => {
  //   if (data?.data) {
  //     if (activeTab === "Tất cả") {
  //       setFilteredData(data.data);
  //     } else {
  //       const filtered = data.data.filter(
  //         (item: RefundRequest) => item.trang_thai === activeTab
  //       );
  //       setFilteredData(filtered);
  //     }
  //   }
  // }, [data, activeTab]);
  // const [actedItems, setActedItems] = useState<number[]>(() => {
  //   const saved = localStorage.getItem("actedItems");
  //   return saved ? JSON.parse(saved) : [];
  // });

  const { mutate } = useMutation({
    mutationFn: async ({
      ids,
      trang_thai,
    }: {
      ids: number;
      trang_thai: string;
    }) => {
      console.log("ids:", trang_thai);
      const response = await instance.put(`/donhang/xac-nhan-huy-hang/${ids}`, {
        trang_thai: trang_thai,
      });

      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật trạng thái thành công");
      queryClient.invalidateQueries({ queryKey: ["donhuy"] });
      // setSelectedRowKeys([]);
    },
    onError: () => {
      message.error("Có lỗi xảy ra khi cập nhật trạng thái");
    },
  });

  // const handleConfirm = (id: number) => {
  //   mutate({ ids: [id], status: "accept" });
  // };

  const handleTotalSearch = (value: string) => {
    if (value) {
      const filtered = data.filter((item: RefundRequest) => {
        console.log("item", item);
        return (
          item.ma_don_hang.toLowerCase().includes(value.toLowerCase()) ||
          (item.trang_thai_thanh_toan === "Đã thanh toán" &&
            item.tong_tien_don_hang
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())) ||
          item.trang_thai_thanh_toan
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item.ten_nguoi_dat_hang.toLowerCase().includes(value.toLowerCase())
        );
      });
      console.log("filtered", filtered);
      setFilteredData(filtered || []);
    } else {
      setFilteredData(data || []);
    }
  };

  const handleDateChange = (_: any, dateStrings: [string, string]) => {
    if (dateStrings[0] && dateStrings[1]) {
      const startDate = new Date(dateStrings[0]);
      const endDate = new Date(dateStrings[1]);
      console.log("startDate", data);
      const filtered = data.filter((item: RefundRequest) => {
        const itemDate = new Date(item.created_at);
        return itemDate >= startDate && itemDate <= endDate;
      });
      console.log("filtered", filtered);
      setFilteredData(filtered || []);
    } else {
      setFilteredData(data || []);
    }
  };

  // const tabItems = [
  //   { label: "Tất cả", key: "Tất cả" },
  //   { label: "Chờ xác nhận ", key: "cho_xac_nhan" },
  //   { label: "Hoàn hàng", key: "hoan_thanh_cong" },
  //   { label: "Từ chối", key: "tu_choi" },
  // ];
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chờ xác nhận hủy hàng":
        return "blue";
      case "Hủy hàng":
        return "green";
      case "tu_choi":
        return "red";
      default:
        return "red";
    }
  };
  const columns: TableColumnsType<RefundRequest> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "ma_don_hang",
      key: "ma_don_hang",
      width: "10%",
      sorter: (a: any, b: any) => a.ma_don_hang.localeCompare(b.ma_don_hang),
    },
    {
      title: "Người đặt hàng",
      dataIndex: "ten_nguoi_dat_hang",
      key: "ten_nguoi_dat_hang",
      width: "15%",
    },

    {
      title: "Trạng thái thanh toán",
      dataIndex: "trang_thai_thanh_toan",
      key: "trang_thai_thanh_toan",
      width: "15%",
      render: (status) => (
        <>
          {status === "Đã thanh toán" ? (
            <span className="inline-block px-5 py-1 text-white bg-green-500 rounded-md font-bold">
              Đã thanh toán
            </span>
          ) : (
            <span className="inline-block px-3 py-1 text-white bg-red-500 rounded-md font-bold">
              Chưa thanh toán
            </span>
          )}
        </>
      ),
    },
    {
      title: "Số tiền hoàn trả",
      dataIndex: "tong_tien_don_hang",
      key: "tong_tien_don_hang",
      width: "15%",
      sorter: (a: any, b: any) => a.tong_tien_don_hang - b.tong_tien_don_hang,
      render: (amount, record) => {
        // Kiểm tra nếu đã thanh toán
        // console.log("record", record);
        if (record.trang_thai_thanh_toan === "Đã thanh toán") {
          return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(amount); // Hiển thị số tiền nếu đã thanh toán
        } else {
          return "0 đ"; // Hiển thị "0 đ" nếu chưa thanh toán
        }
      },
    },

    // {
    //   title: "Hình ảnh minh chứng",
    //   dataIndex: "don_hang",
    //   width: "20%",
    //   render: (value) => (
    //     <Image
    //       src={value.hinh_anh_hoan_tra}
    //       alt="minh chứng"
    //       width={100}
    //       height={100}
    //       className="rounded-md object-cover"
    //       preview={{
    //         mask: "Click", // Văn bản hiển thị khi hover vào ảnh
    //       }}
    //     />
    //   ),
    // },
    {
      title: "Lý do",
      dataIndex: "li_do_huy_hang",
      key: "li_do_huy_hang",
      width: "20%",
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai_don_hang",
      key: "trang_thai_don_hang",
      width: "15%",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status === "Chờ xác nhận hủy hàng"
            ? "Chờ xác nhận"
            : status === "Hủy hàng"
              ? "Đã xác nhận"
              : "Từ chối"}
        </Tag>
        // <></>
      ),
    },
    {
      title: "Thời gian đặt hàng",
      dataIndex: "created_at",
      key: "created_at",
      width: "15%",
      sorter: (a: any, b: any) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      render: (date) => FormatDate(date),
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
          {record.trang_thai_don_hang !== "Hủy hàng" && (
            <div className="flex gap-1">
              <Popconfirm
                title="Xác nhận"
                description="Bạn có chắc chắn muốn xác nhận yêu cầu này?"
                onConfirm={() =>
                  mutate({ ids: record.id, trang_thai: "da_huy" })
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
              {/* 
          <Popconfirm
            title="Từ chối yêu cầu"
            description="Bạn có chắc chắn muốn từ chối yêu cầu này?"
            onConfirm={() => mutate({ ids: record.id, trang_thai: "tu_choi" })}
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
          > */}
              <Notehuy id={record.id} />
              {/* </Popconfirm> */}
            </div>
          )}
          <DonhuyDetail record={record} />
        </Space>
      ),
    },
  ];

  const rowSelection: TableRowSelection<RefundRequest> = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold">Yêu cầu hủy hàng</span>
        </h1>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Yêu cầu hủy đơn hàng</h1>
      </div>

      {/* <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} /> */}

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
          columns={columns}
          dataSource={filteredData ?? data}
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

export default Donhuy;
