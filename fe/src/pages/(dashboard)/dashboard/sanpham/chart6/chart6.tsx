import React from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";

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
    dataIndex: "MSP",
    width: 150,
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    width: 150,
  },
  {
    title: "Số lượng bán ra",
    dataIndex: "age",
    width: 150,
  },
  {
    title: "Số lượng thực bán",
    dataIndex: "age",
    width: 150,
  },
  {
    title: "Tiền hàng",
    dataIndex: "address",
  },
  {
    title: "Doanh số",
    dataIndex: "address",
  },
  {
    title: "SL đơn hàng",
    dataIndex: "sl",
  },
];

const dataSource = Array.from({ length: 100 }).map<DataType>((_, i) => ({
  key: i,
  MSP: `SP_AHDHG00${i}`,
  name: `Sản Phẩm ${i}`,
  age: 32,
  address: `1${i}00234 VNĐ`,
  sl: 32,
}));

const Chart6: React.FC = () => {
  return (
    <Table<DataType>
      columns={columns}
      dataSource={dataSource}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
      scroll={{ y: 600 }}
      bordered
      summary={() => {
        return (
          <Table.Summary fixed>
            <Table.Summary.Row className="font-bold">
              <Table.Summary.Cell index={0}>Tổng</Table.Summary.Cell>
              <Table.Summary.Cell index={1}></Table.Summary.Cell>
              <Table.Summary.Cell index={2}>{2345}</Table.Summary.Cell>

              <Table.Summary.Cell index={3}>24359</Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                {"4.345.333 VNĐ"}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}>
                {"32.032.000 VNĐ"}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6}>{"10.002.023"}</Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        );
      }}
    />
  );
};

export default Chart6;
