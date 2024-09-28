import React, { useState } from "react";
import { Button, Flex, Input, message, Popconfirm, Select, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
const datas = [
  {
    value: "1",
    label: "Xác nhận đơn hàng",
  },
  {
    value: "2",
    label: "Hoàn tất đơn hàng",
  },
  {
    value: "3",
    label: "Xác nhận Thanh toán",
  },
  {
    value: "4",
    label: "Hủy đơn hàng",
  },
];
const columns: TableColumnsType<DataType> = [
  {
    title: "Mã Đơn hàng",
    dataIndex: "ma_don_hang",
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
            (record.trang_thai_don_hang === "Chờ xác nhận"
              ? "text-yellow-400" // Chờ xác nhận: màu vàng nhạt
              : record.trang_thai_don_hang === "Đã xác nhận"
                ? "text-orange-500" // Đã xác nhận: màu cam đậm
                : record.trang_thai_don_hang === "Đang xử lý"
                  ? "text-blue-500" // Đang xử lý: màu xanh dương
                  : record.trang_thai_don_hang === "Đang giao hàng"
                    ? "text-purple-500" // Đang giao hàng: màu tím
                    : record.trang_thai_don_hang === "Đã giao hàng thành công"
                      ? "text-green-500" // Đã giao hàng thành công: màu xanh lá
                      : "text-red-500") // Các trạng thái khác: màu đỏ
          }
        >
          {record.trang_thai_don_hang === "Chờ xác nhận"
            ? "Chờ xác nhận"
            : record.trang_thai_don_hang === "Đã xác nhận"
              ? "Đã xác nhận"
              : record.trang_thai_don_hang === "Đang xử lý"
                ? "Đang xử lý"
                : record.trang_thai_don_hang === "Đang giao hàng"
                  ? "Đang giao hàng"
                  : record.trang_thai_don_hang === "Đã giao hàng thành công"
                    ? "Giao Thành công"
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
            record.trang_thai_thanh_toan === "Đã thanh toán"
              ? "text-green-500 font-bold text-[15px]"
              : record.trang_thai_thanh_toan === "Chờ xử lý"
                ? "text-blue-500 font-bold text-[15px]"
                : "text-yellow-500 font-bold text-[15px]"
          }
        >
          {record.trang_thai_thanh_toan === "Đã thanh toán"
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
              ? "text-orange-500 font-bold text-[15px]"
              : record.trang_thai_van_chuyen === "Chờ lấy hàng"
                ? "text-blue-500 font-bold text-[15px]"
                : record.trang_thai_van_chuyen === "Đang giao hàng"
                  ? "text-green-500 font-bold text-[15px]"
                  : record.trang_thai_van_chuyen === "Giao hàng thành công"
                    ? "text-teal-500 font-bold text-[15px]"
                    : "text-red-500 font-bold text-[15px]" // Trạng thái khác
          }
        >
          {record.trang_thai_van_chuyen === "Chờ xử lý"
            ? "Chờ xử lý"
            : record.trang_thai_van_chuyen === "Chờ lấy hàng"
              ? "Chờ lấy hàng"
              : record.trang_thai_van_chuyen === "Đang giao hàng"
                ? "Đang giao hàng"
                : record.trang_thai_van_chuyen === "Giao hàng thành công"
                  ? "Giao hàng thành công"
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
            record.trang_thai_thanh_toan === "Chưa thanh toán"
              ? "text-red-500 font-bold text-[15px]" // Màu đỏ cho "Chưa thanh toán"
              : record.trang_thai_thanh_toan === "Đã thanh toán"
                ? "text-green-500 font-bold text-[15px]" // Màu xanh lá cho "Đã thanh toán"
                : "text-gray-500 font-bold text-[15px]" // Màu xám cho các trạng thái khác
          }
        >
          {record.trang_thai_thanh_toan === "Chưa thanh toán"
            ? "Chưa Nhận"
            : record.trang_thai_thanh_toan === "Đã thanh toán"
              ? "Đã Nhận"
              : "Không thu tiền"}
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

const OrderAdmin: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [trangthai, setTrangThai] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [formcheck, setFormCheck] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ORDERS"],
    queryFn: async () => {
      const response = await instance.get("/admin/donhang");
      return response.data;
    },
  });
  const order: DataType[] | undefined = data?.data;
  // console.log("order", order);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (data: React.Key[]) => {
      const trangthais =
        trangthai === "1"
          ? "Đã xác nhận"
          : trangthai === "2"
            ? "Đang xử lý"
            : trangthai === "3"
              ? "Đã giao hàng thành công"
              : "Đã hủy hàng";

      const response = await instance.post(
        "admin/donhang/trang-thai-don-hang",
        {
          trang_thai_don_hang: trangthais,
          id: data,
        }
      );
      start();
      message.open({
        type: "success",
        content: "Cập nhật trạng thái đơn hàng thành công",
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ORDERS"],
      });
      setLoading(false);
    },
    onError: () => {
      setLoading;
    },
  });

  const start = () => {
    setFormCheck(!formcheck);
    // setLoading(true);
    // ajax request after empty completing
    // setTimeout(() => {
    // console.log("selectedRowKeys", selectedRowKeys);
    // setLoading(false);
    // }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    // console.log("selectedRowKeys changed: ", newSelectedRowKeys);
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
  const handleChange = (value: string) => {
    setTrangThai(value);
  };
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
          <Flex align="center" gap="middle" className="relative">
            <Button
              type="primary"
              onClick={start}
              disabled={!hasSelected}
              loading={loading}
              className="text-white"
            >
              Thao tác
            </Button>

            {formcheck && (
              <div className="bg-white absolute left-0 top-10 z-10 w-80 h-36 rounded-lg shadow-md p-3">
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
                    onConfirm={() => mutate(selectedRowKeys)}
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
