import React, { useEffect } from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/admin";
import { Dayjs } from "dayjs";

interface DataType {
  key: React.Key;
  MSP: string;
  name: string;
  age: number;
  address: string;
  sl: number;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "Mã sản phẩm",
    dataIndex: "ma_san_pham",
    width: 150,
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "ten_san_pham",
    width: 150,
  },
  {
    title: "Số lượng bán ra",
    dataIndex: "so_luong_ban_ra",
    width: 150,
  },
  {
    title: "Số lượng thực bán",
    dataIndex: "so_luong_thuc_ban",
    width: 150,
  },
  {
    title: "Tiền hàng",
    dataIndex: "tien_hang",
    render: (value) => {
      return <div>{value?.toLocaleString("vi-VN")}đ </div>;
    },
  },
  {
    title: "Doanh số",
    dataIndex: "doanh_so",
    render: (value) => {
      return <div>{value?.toLocaleString("vi-VN")}đ</div>;
    },
  },
  {
    title: "SL đơn hàng",
    dataIndex: "so_luong_don_hang",
  },
];

interface Chart6Props {
  datestart: Dayjs;

  dateend: Dayjs;

  top: number;
}
const Chart6: React.FC<Chart6Props> = ({ datestart, dateend, top }) => {
  // console.log(datestart, dateend, top);

  const date =
    datestart && dateend && top
      ? { ngay_bat_dau: datestart, ngay_ket_thuc: dateend, top: top }
      : {};

  // console.log("Date object:", date);

  const { data, refetch } = useQuery({
    queryKey: ["sanphamtable2chart6", datestart, dateend, top],
    queryFn: async () => {
      // console.log("Sending request with date:", date);
      try {
        const response = await instance.post(
          "thong-ke/san-pham-all-time",
          date
        );
        return response.data;
      } catch (error) {
        throw new Error("Error fetching data");
      }
    },
    enabled: Boolean(datestart && dateend && top),
  });

  useEffect(() => {
    if (datestart && dateend && top) {
      refetch();
    }
  }, [datestart, dateend, top, refetch]);

  // console.log("API response:", data);
  const table = data?.data || [];

  return (
    <Table<DataType>
      columns={columns}
      dataSource={table ? table : []}
      pagination={{ pageSize: 10, className: "my-5" }}
      scroll={{ y: 600 }}
      bordered
      summary={() => {
        return (
          <Table.Summary fixed>
            <Table.Summary.Row className="font-bold">
              <Table.Summary.Cell index={0}>Tổng</Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                {data?.tong_so_luong_ban_ra}
              </Table.Summary.Cell>

              <Table.Summary.Cell index={3}>
                {data?.tong_so_luong_thuc_ban}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                {data?.tong_tien_hang?.toLocaleString("vi-VN")}đ
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}>
                {data?.tong_doanh_so?.toLocaleString("vi-VN")}đ
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6}>
                {data?.tong_so_luong_don_hang}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        );
      }}
    />
  );
};

export default Chart6;
