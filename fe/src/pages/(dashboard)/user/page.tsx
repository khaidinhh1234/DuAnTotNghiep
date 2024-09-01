import React, { useState } from "react";
import { Popconfirm, Space, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { Button } from "@/components/ui/button";
import { DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
  },
  {
    title: "Giá",
    dataIndex: "age",
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
  },
  {
    title: "Quản trị",
    key: "action",
    render: (_, record) => (
      <Space>
        <Popconfirm
          title="Chuyển vào thùng rác "
          description="Bạn có chắc chắn muốn xóa không?"
          okText="Có "
          cancelText="Không"
        >
          <Button className=" border bg-black  rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
            Xóa
          </Button>
        </Popconfirm>
        <Button className="  border bg-black  rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
          Cập nhật{" "}
        </Button>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
];

const UserAdmin = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
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
        text: "Select Even Row",
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

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className=" md:text-base">
          Quản trị / <span className="font-semibold px-px=">Khách hàng </span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className=" font-semibold md:text-3xl">Khách hàng </h1>
        <Link to="remote">
          <Button className="ml-auto bg-black text-white rounded-lg  py-1">
            <DeleteOutlined className="mr-1" />
            Thùng rác
          </Button>
        </Link>
      </div>
      <div className=" ">
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
        />
      </div>
    </main>
  );
};

export default UserAdmin;
