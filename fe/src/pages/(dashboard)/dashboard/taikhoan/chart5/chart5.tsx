import React from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import instance from "@/configs/admin";
import { useQuery } from "@tanstack/react-query";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

// const dataSource = Array.from({ length: 100 }).map<DataType>((_, i) => ({
//   key: i,
//   name: `Edward King ${i}`,
//   age: 32,
//   address: `London, Park Lane no. ${i}`,
// }));

interface Chart5Props {
  chart5: DataType[];
}

const Chart5: React.FC<Chart5Props> = ({ chart5 }) => {
  // const { data: chart5 } = useQuery({
  //   queryKey: ["dashboardtable2chart5"],
  //   queryFn: async () => {
  //     const response = await instance.get(
  //       "thong-ke/top-10-khach-hang-tieu-bieu"
  //     );
  //     return response.data;
  //   },
  // });
  // console.log(chart5);
  const columns: TableColumnsType<DataType> = [
    {
      title: "Tên khách hàng",
      dataIndex: "ten_khach_hang",
      width: 200,
    },
    {
      title: "số điện thoại",
      dataIndex: "so_dien_thoai",
      width: 200,
    },
    {
      title: "Số đơn",
      dataIndex: "tong_so_don",
    },
    {
      title: "Số đơn thành công",
      dataIndex: "so_don_thanh_cong",
    },
    {
      title: "Số đơn hoàn",
      dataIndex: "so_don_huy",
    },
    {
      title: "Giá trị đơn thành công",
      dataIndex: "tong_tien_mua_hang",
      render: (value) => (
        <span>
          {value
            ? value.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })
            : "___________"}
        </span>
      ),
    },
  ];

  return (
    <Table<DataType>
      columns={columns}
      dataSource={chart5}
      scroll={{ y: 600 }}
      pagination={{ pageSize: 10, className: "my-2" }}
    />
  );
};

export default Chart5;
