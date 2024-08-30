import React, { useState } from "react";
import { Input, Popconfirm, Space, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { Button } from "@/components/ui/button";
import { DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

interface DataType {
  key: React.Key;
  image: string;
  title: string;
  price: number;
  description: string;
  quantity: number;

}

const columns: TableColumnsType<DataType> = [
  {
    title: "Ảnh",
    dataIndex: "image",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "title",
  },
  {
    title: "Giá",
    dataIndex: "price",
  },
  {
    title: "Mô tả",
    dataIndex: "description",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
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
    image: "https://picsum.photos/id/10/300/300",
    title: "John abc",
    price: 32,
    description: "New York No. 1 Lake Park",
    quantity: 32,
  },
  {
    key: "2",
    image: "https://picsum.photos/id/10/300/300",
    title: "Jim Green",
    price: 42,
    description: "London No. 1 Lake Park",
    quantity: 32,
  },
  {
    key: "3",
    image: "https://picsum.photos/id/10/300/300",
    title: "Joe Black",
    price: 32,
    description: "Sidney No. 1 Lake Park",
    quantity: 32,
  },
];

const ProductsAdmin = () => {
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
          Quản trị / <span className="font-semibold px-px=">Sản phẩm</span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className=" font-semibold md:text-3xl">Sản phẩm </h1>
       
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

export default ProductsAdmin;
