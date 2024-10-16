import React from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "Tên khách hàng",
    dataIndex: "name",
    width: 150,
  },
  {
    title: "số điện thoại",
    dataIndex: "age",
    width: 150,
  },
  {
    title: "Số đơn",
    dataIndex: "age",
  },
  {
    title: "Số đơn thành công",
    dataIndex: "age",
  },
  {
    title: "Số đơn hoàn",
    dataIndex: "age",
  },
  {
    title: "Giá trị đơn thành công",
    dataIndex: "age",
  },
];

const dataSource = Array.from({ length: 100 }).map<DataType>((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}));

const Chart5: React.FC = () => {
  return (
    <Table<DataType>
      columns={columns}
      dataSource={dataSource}
      pagination={{
        pageSize: 10, // Default page size
        showSizeChanger: true, // Enable page size changer
        pageSizeOptions: ["10", "20", "50", "100"], // Page size options as strings
      }}
      scroll={{ y: 600 }}
    />
  );
};

export default Chart5;
