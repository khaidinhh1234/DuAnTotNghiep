import instance from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Input,
  Popconfirm,
  Popover,
  Space,
  Table,
  TableColumnsType,
  TableProps,
} from "antd";
import Detail from "./detail";
import { useState } from "react";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

interface DataType {
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
}

const content = (
  <div>
    <p>Chi tiết sản phẩm 1</p>
    <p>Chi tiết sản phẩm 2</p>
  </div>
);

// const data: DataType[] = [
//   {
//     key: "1",
//     name: "John Brown",
//     email: "john@example.com",
//     numberPhone: "0987654321",
//     address: "New York No. 1 Lake Park",
//     products: "Sản phẩm 1",
//     priceTotal: 100000,
//     status: "Chưa giao hàng",
//   },
// ];

const OrderAdmin = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ORDERS"],
    queryFn: async () => {
      const response = await instance.get("/admin/donhang");
      return response.data;
    },
  });
  const columns: TableColumnsType<DataType> = [
    {
      title: "Mã Đơn hàng",
      dataIndex: "id",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
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
                : record.trang_thai_don_hang === "Chờ xác nhận"
                  ? "text-orange-600"
                  : record.trang_thai_don_hang === "Đã xác nhận"
                    ? "text-orange-600"
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
              record.trang_thai_don_hang === "Chờ xử lý"
                ? "text-teal-600 font-bold text-[15px]"
                : record.trang_thai_don_hang === "Chờ lấy hàng"
                  ? "text-teal-600 font-bold text-[15px]"
                  : record.trang_thai_don_hang === "Đang giao hàng"
                    ? "text-teal-600 font-bold text-[15px]"
                    : record.trang_thai_don_hang === "Đang ship hàng"
                      ? "text-purple-600 font-bold text-[15px]"
                      : record.trang_thai_don_hang === "Giao thành công"
                        ? "text-teal-600 font-bold text-[15px]"
                        : "text-red-500 font-bold text-[15px]" // Add a default case for the ternary operator
            }
          >
            {record.trang_thai_don_hang === "Chờ xử lý"
              ? "Chờ xử lý"
              : record.trang_thai_don_hang === "Chờ lấy hàng"
                ? "Chờ lấy hàng"
                : record.trang_thai_don_hang === "Đang giao hàng"
                  ? "Đang giao hàng"
                  : record.trang_thai_don_hang === "Đang ship hàng"
                    ? "Đang ship hàng"
                    : record.trang_thai_don_hang === "Giao thành công"
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

  const order = data?.data;
  console.log(order);

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Giao hàng loạt",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Hủy hàng loạt",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
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
        <Table
          columns={columns}
          rowSelection={rowSelection}
          dataSource={order}
        />
      </div>
    </main>
  );
};

export default OrderAdmin;
