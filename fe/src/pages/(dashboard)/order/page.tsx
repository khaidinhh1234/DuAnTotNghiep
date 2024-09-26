import React, { useState } from "react";
import { Button, Flex, Input, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/axios";
import Detail from "./detail";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

interface DataType {
  created_at: string | number | Date;
  id: number;
  user_id: number;
  ghi_chu: string;
  trang_thai_don_hang: string;
  phuong_thuc_thanh_toan: string;
  tong_tien_don_hang: string;
  ten_nguoi_dat_hang: string;
  so_dien_thoai_nguoi_dat_hang: string;
  dia_chi_nguoi_dat_hang: string;
  ma_giam_gia: string;
  so_tien_giam_gia: string;
  trang_thai_thanh_toan: string;
  duong_dan: string;
  trang_thai_van_chuyen: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "Mã Đơn hàng",
    dataIndex: "id",
  },
  {
    title: "Ngày tạo",
    // dataIndex: "created_at",/
    render: (_, record) => {
      const date = new Date(record.created_at);
      return (
        <div>
          {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
        </div>
      );
    },
  },
  {
    title: "Khách hàng",
    dataIndex: "ten_nguoi_dat_hang",
  },
  {
    title: "Sản phẩm",
    dataIndex: "products",
    render: (_, record) => <Detail record={record} />,
  },
  {
    title: "Trạng thái",
    dataIndex: "trang_thai_don_hang",
    render: (_, record) => {
      return (
        <div
          className={
            "font-bold text-[15px] " +
            (record.trang_thai_don_hang === "Chờ xử lý"
              ? "text-blue-500"
              : record.trang_thai_don_hang == "Chờ xác nhận"
                ? "text-yellow-300"
                : record.trang_thai_don_hang === "Đã xác nhận"
                  ? "text-orange-500"
                  : record.trang_thai_don_hang === "Thành công"
                    ? "text-green-500"
                    : "text-red-500")
          }
        >
          {record.trang_thai_don_hang === "Chờ xử lý"
            ? "Chờ xử lý"
            : record.trang_thai_don_hang === "Chờ xác nhận"
              ? "Chờ xác nhận"
              : record.trang_thai_don_hang === "Đã xác nhận"
                ? "Đã xác nhận"
                : record.trang_thai_don_hang === "Thành công"
                  ? "Thành công"
                  : "Hủy"}
        </div>
      );
    },
  },
  {
    title: "Thanh toán",
    render: (_, record) => {
      return (
        <div
          className={
            record.trang_thai_thanh_toan === "Thành công"
              ? "text-green-500 font-bold text-[15px]"
              : record.trang_thai_thanh_toan === "Chờ xử lý"
                ? "text-blue-500 font-bold text-[15px]"
                : "text-yellow-500 font-bold text-[15px]"
          }
        >
          {record.trang_thai_thanh_toan === "Thành công"
            ? "Đã thanh toán"
            : record.trang_thai_thanh_toan === "Chờ xử lý"
              ? "Chờ xử lý"
              : "Chưa thanh toán"}
        </div>
      );
    },
  },
  {
    title: "Giao hàng",
    render: (_, record) => {
      return (
        <div
          className={
            record.trang_thai_van_chuyen === "Chờ xử lý"
              ? "text-teal-600 font-bold text-[15px]"
              : record.trang_thai_van_chuyen === "Chờ lấy hàng"
                ? "text-teal-600 font-bold text-[15px]"
                : record.trang_thai_van_chuyen === "Đang giao hàng"
                  ? "text-teal-600 font-bold text-[15px]"
                  : record.trang_thai_van_chuyen === "Đang ship hàng"
                    ? "text-purple-600 font-bold text-[15px]"
                    : record.trang_thai_van_chuyen === "Giao thành công"
                      ? "text-teal-600 font-bold text-[15px]"
                      : "text-red-500 font-bold text-[15px]" // Add a default case for the ternary operator
          }
        >
          {record.trang_thai_van_chuyen === "Chờ xử lý"
            ? "Chờ xử lý"
            : record.trang_thai_van_chuyen === "Chờ lấy hàng"
              ? "Chờ lấy hàng"
              : record.trang_thai_van_chuyen === "Đang giao hàng"
                ? "Đang giao hàng"
                : record.trang_thai_van_chuyen === "Đang ship hàng"
                  ? "Đang ship hàng"
                  : record.trang_thai_van_chuyen === "Giao thành công"
                    ? "Giao thành công"
                    : "Hủy"}
        </div>
      );
    },
  },
  {
    title: "COD",
    render: (_, record) => {
      return (
        <div
          className={
            record.trang_thai_don_hang === "Thành công"
              ? "text-green-500 font-bold text-[15px]"
              : "text-yellow-500 font-bold text-[15px]"
          }
        >
          {record.trang_thai_don_hang === "Thành công"
            ? "Đã Nhận"
            : "Chưa Nhận"}
        </div>
      );
    },
  },
  {
    title: "Tổng tiền",
    dataIndex: " tong_tien_don_hang",
    render: (_, record) => {
      return (
        <div>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(Number(record.tong_tien_don_hang))}
        </div>
      );
    },
  },

  // {
  //   title: "Quản trị",
  //   key: "action",
  //   render: (_, record) => (
  //     <Space>
  //       <Button className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
  //         Cập nhật
  //       </Button>
  //     </Space>
  //   ),
  // },
];

// const dataSource = Array.from<DataType>({ length: 46 }).map<DataType>(
//   (_, i) => ({
//     key: i,
//     name: `Edward King ${i}`,
//     age: 32,
//     address: `London, Park Lane no. ${i}`,
//   })
// );

const OrderAdmin: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ORDERS"],
    queryFn: async () => {
      const response = await instance.get("/admin/donhang");
      return response.data;
    },
  });
  const order: DataType[] | undefined = data?.data;
  // console.log(order);
  const start = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  interface OrderData extends DataType {
    key: React.Key;
  }

  const dataSource: OrderData[] | undefined = order?.map(
    (item: DataType, i: number): OrderData => ({
      ...item,
      key: i,
    })
  );

  const hasSelected = selectedRowKeys.length > 0;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold">Đơn hàng</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Đơn hàng</h1>
      </div>
      <div>
        {" "}
        <div className="max-w-xs my-2">
          <Input
            placeholder="Tìm kiếm..."
            size="large"
            // value={searchText}
            // onChange={(e) => setSearchText(e.target.value)}
            // onKeyDown={handleKeyDown}
          />
        </div>
        <Flex gap="middle" vertical>
          <Flex align="center" gap="middle">
            <Button
              type="primary"
              onClick={start}
              disabled={!hasSelected}
              loading={loading}
            >
              Reload
            </Button>
            {hasSelected ? `Đã chọn ${selectedRowKeys.length} đơn` : null}
          </Flex>
          <Table<DataType>
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
          />
        </Flex>
      </div>
    </main>
  );
};

export default OrderAdmin;
