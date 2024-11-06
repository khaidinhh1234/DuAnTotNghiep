import instance from "@/configs/admin";
import { SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Flex,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  TableColumnsType,
  TableProps,
  Tabs,
} from "antd";
import React, { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";
import DetailTS from "./test";

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

const datas = [
  { value: "1", label: "Đang giao hàng" },
  { value: "2", label: "Giao hàng thành công" },
  { value: "3", label: "Giao hàng thất bại" },
];

const Test: React.FC = () => {
  const queryClient = useQueryClient();
  // const { id } = useParams()
  // console.log("Current ID:", id);

  const [trangthai, setTrangThai] = useState<string>();
  const [filteredData, setFilteredData] = useState<Transport[]>([]);
  const [formcheck, setFormCheck] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Tất cả");
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<{
    id: number;
    created_at: string;
    don_hang_id: number;
    trang_thai_van_chuyen: string;
  }> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // const { mutate } = useMutation({
  //   mutationFn: async (data: React.Key[]) => {
  //     try {
  //       const trangthais =
  //         trangthai === "1"
  //           ? "Đang giao hàng"
  //           : trangthai === "2"
  //             ? "Giao hàng thành công"
  //             : trangthai === "3"
  //               ? "Giao hàng thất bại"
  //               : "Không rõ";

  //       const response = await instance.put("vanchuyen/trang-thai-van-chuyen", {
  //         trang_thai_van_chuyen: trangthais,
  //         id: data,
  //       });
  //       const error = response.data.message;
  //       start();
  //       if (error === "Cập nhật trạng thái đơn hàng thành công") {
  //         message.open({
  //           type: "success",
  //           content: error,
  //         });
  //       } else {
  //         message.open({
  //           type: "success",
  //           content: error,
  //         });
  //       }
  //       return response.data;
  //     } catch (error: any) {
  //       console.error(error.message);
  //       throw new Error(error.message);
  //     }
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["vanchuyen"],
  //     });
  //     setLoading(false);
  //   },
  //   onError: (error: any) => {
  //     console.error("Error updating order:", error.message);
  //     message.open({
  //       type: "error",
  //       content: `Cập nhật trạng thái đơn hàng thất bại: ${error.message}`,
  //     });
  //     setLoading(false);
  //   },
  // });

  // const { data, isLoading } = useQuery({
  //   queryKey: ["vanchuyen"],
  //   queryFn: async () => {
  //     const response = await instance.get("/vanchuyen");
  //     return response.data;
  //   },
  // });
  // // console.log(data);
  // // const { data: ttShipper, isLoading: isLoadingShipper } = useQuery({
  // //   queryKey: ["shipper"],
  // //   queryFn: async () => {
  // //     const response = await instance.get(`/vanchuyen/${id}`);
  // //     return response.data;
  // //   },
  // // });

  // // if (isLoading || isLoadingShipper) {
  // //   return <div>Loading...</div>; // Hoặc bạn có thể hiện thị một loader khác
  // // }
  // // const shipperTT = data?.data?.van_chuyen?.shipper
  // // console.log(shipperTT)

  // const start = () => {
  //   setFormCheck(!formcheck);
  // };

  // const transport: Transport[] | undefined = data?.data;

  // useEffect(() => {
  //   if (transport) {
  //     // Nếu tab "Tất cả" được chọn, hiển thị tất cả dữ liệu mà không lọc
  //     if (activeTab === "Tất cả") {
  //       setFilteredData(transport);
  //     } else {
  //       // Lọc dữ liệu theo trạng thái của tab đang được chọn
  //       const filtered = transport.filter(
  //         (item) => item.trang_thai_van_chuyen === activeTab
  //       );
  //       setFilteredData(filtered);
  //     }
  //   }
  // }, [transport, activeTab]);

  // const dataSource: TransportData[] = (filteredData ?? []).map(
  //   (item: any): TransportData => ({
  //     key: item.id,
  //     ...item,
  //     don_hang_id: item.don_hang?.ma_don_hang || "Chưa có dữ liệu",
  //     trang_thai_thanh_toan:
  //       item.don_hang?.trang_thai_thanh_toan || "Chưa có dữ liệu",
  //     shipper_id: item.don_hang?.shipper?.ho_ten || "Chưa có dữ liệu",
  //   })
  // );
  const data = [
    {
      id: 1,
      created_at: "2021-10-10",
      don_hang_id: 1,
      trang_thai_van_chuyen: "Chờ xử lý",
    },
    {
      id: 2,
      created_at: "2021-10-10",
      don_hang_id: 2,
      trang_thai_van_chuyen: "Đang",
    },
  ];
  const handleChange = (value: string) => {
    setTrangThai(value);
  };
  const hasSelected = selectedRowKeys.length > 0;
  const columns: TableColumnsType<{
    id: number;
    created_at: string;
    don_hang_id: number;
    trang_thai_van_chuyen: string;
  }> = [
    // {
    //   title: "Mã vận chuyển",
    //   dataIndex: "ma_van_chuyen",
    //   key: "ma_van_chuyen",
    // },
    // {
    //   title: "Mã đơn hàng",
    //   dataIndex: "don_hang_id",
    //   key: "don_hang_id",
    //   render: (text) => <a>{text}</a>,
    // },
    {
      title: "Tất cả",
      className: "text-xl w-1/2",
      dataIndex: "created_at",
      key: "created_at",
      // sorter: (a, b) =>
      //   new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      render: (_, record) => (
        // const date = new Date(record.created_at);
        // return (
        //   <div>
        //     {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
        //   </div>
        // );
        <div className="border rounded-lg p-4 mb-4">
          <DetailTS />{" "}
          <div className="justify-between flex">
            <div className="flex items-end">
              {" "}
              <span className="md:text-lg text-sm text-red-500 font-semibold">
                Đang giao hàng
              </span>
            </div>
            <div>
              <p className="md:text-lg text-xs text-gray-800 flex items-end justify-end">
                Tổng số tiền (1 sản phẩm):{" "}
                <span className="text-red-500 font-semibold"> ₫724.300</span>
              </p>
              <div className="flex space-x-2 mt-2 justify-end">
                <button className="px-3 py-1 border border-gray-600 text-gray-600 rounded-lg text-xs md:text-base">
                  Giao hàng thất bại
                </button>
                <button className="px-3 py-2 border-red-500 text-red-500 border hover:bg-red-600 hover:text-white rounded-lg text-xs md:text-base">
                  Nhận hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    // {
    //   title: "Trạng thái giao hàng",
    //   dataIndex: "trang_thai_van_chuyen",
    //   key: "trang_thai_van_chuyen",
    //   render: (_, record) => {
    //     return (
    //       <div
    //         className={
    //           "font-bold text-[15px] " +
    //           (record.trang_thai_van_chuyen === "Chờ xử lý"
    //             ? "text-yellow-400"
    //             : record.trang_thai_van_chuyen === "Đang giao hàng"
    //               ? "text-blue-500"
    //               : record.trang_thai_van_chuyen === "Giao hàng thành công"
    //                 ? "text-green-500"
    //                 : record.trang_thai_van_chuyen === "Giao hàng thất bại"
    //                   ? "text-red-500"
    //                   : "text-gray-500")
    //         }
    //       >
    //         {record.trang_thai_van_chuyen}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: "Thanh toán",
    //   dataIndex: "trang_thai_thanh_toan",
    //   key: "trang_thai_thanh_toan",
    //   sorter: (a: any, b: any) =>
    //     a.trang_thai_thanh_toan.localeCompare(b.trang_thai_thanh_toan),
    //   render: (_, record: any) => {
    //     return (
    //       <div
    //         className={
    //           record.trang_thai_thanh_toan === "Đã thanh toán"
    //             ? "text-green-500 font-bold text-[15px]"
    //             : record.trang_thai_thanh_toan === "Chờ xử lý"
    //               ? "text-blue-500 font-bold text-[15px]"
    //               : "text-yellow-500 font-bold text-[15px]"
    //         }
    //       >
    //         {record.trang_thai_thanh_toan === "Đã thanh toán"
    //           ? "Đã thanh toán"
    //           : record.trang_thai_thanh_toan === "Chờ xử lý"
    //             ? "Chờ xử lý"
    //             : "Chưa thanh toán"}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: "Tổng tiền",
    //   dataIndex: "tien_cod",
    //   // key: "tien_cod",
    //   render: (_, record) => {
    //     return (
    //       <div>
    //         {new Intl.NumberFormat("vi-VN", {
    //           style: "currency",
    //           currency: "VND",
    //         }).format(Number(record.tien_cod))}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: "Thao tác",
    //   key: "action",
    //   render: (_, record) => (
    //     // console.log(record),
    //     <Space size="middle">
    //       <DetailTS record={record} />
    //     </Space>
    //   ),
    // },
  ];

  // Tabs để lọc dữ liệu theo trạng thái
  const tabItems = [
    { label: "Đơn vận chuyển", key: "Tất cả" },
    { label: "Chờ xử lý", key: "Chờ xử lý" },
    { label: "Đang giao hàng", key: "Đang giao hàng" },
    { label: "Giao hàng thành công", key: "Giao hàng thành công" },
  ];

  return (
    <main className="flex flex-1 flex-col gap-0 p-0 lg:gap-6 lg:px-6 lg:py-10 container">
      <div className="flex items-center">{/* Header */}</div>
      <div className="flex justify-between items-start mx-10">
        <div className="flex gap-5 items-center">
          <img
            src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729398683/Black_and_White_Circle_Business_Logo_1_ieyoum.png"
            alt="Logo"
            className="w-16 h-16"
          />
          <h1 className="font-semibold md:text-2xl mt-3">
            Giao Hàng Glow Express
          </h1>
        </div>
      </div>

      <div className="lg:mx-10 mx-3 bg-white">
        <Tabs
          defaultActiveKey="Tất cả"
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={tabItems}
        />

        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input placeholder="Tìm kiếm" prefix={<SearchOutlined />} />
            <RangePicker />
          </Space>
        </div>

        {/* <Flex gap="middle" vertical>
          <Flex align="center" gap="middle" className="relative"> */}
        {/* <Button
              type="primary"
              onClick={start}
              disabled={!hasSelected}
              loading={loading}
              className="text-white"
            >
              Thao tác
            </Button> */}

        {/* {formcheck && (
              <div className="bg-slate-400 absolute left-0 top-10 z-10 w-80 h-36 rounded-lg shadow-md p-3">
                <p>Cập nhật trạng thái đơn hàng theo:</p>
                <Select
                  defaultValue={datas[0].label}
                  style={{ width: "100%" }}
                  onChange={handleChange}
                  options={datas}
                />
                <br />
                <div className="my-5 flex justify-between">
                  <Popconfirm
                    title="Trạng thái"
                    description="Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng này?"
                    okText="Có"
                    onConfirm={() => {
                      console.log(
                        "Đã cập nhật trạng thái cho đơn hàng",
                        selectedRowKeys
                      );
                    }}
                    cancelText="Không"
                  >
                    <Button
                      type="primary"
                      className="bg-red-500 text-white hover:bg-red-700"
                      disabled={!hasSelected}
                      loading={loading}
                    >
                      Xác nhận
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            )}
            {hasSelected ? `Đã chọn ${selectedRowKeys.length} đơn` : ""}
          </Flex> */}

        <Table
          // rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          // loading={isLoading}
          pagination={{ pageSize: 10, className: "my-5" }}
        />
        {/* </Flex> */}
      </div>
    </main>
  );
};

export default Test;