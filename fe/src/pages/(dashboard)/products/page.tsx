import React, { useState } from "react";
import { Input, Popconfirm, Space, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { Button } from "@/components/ui/button";
import { DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Search } = Input;
type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

interface DataType {
  key: React.Key;
  anh_san_pham: string;
  ten_san_pham: string;
  id_danh_muc: string;
  luot_xem: number;
  mo_ta_ngan: string;
  noi_dung: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: "Ảnh sản phẩm",
    render: (record) => (
      <img
        src={record.anh_san_pham}
        alt=""
        className="w-20 h-20 object-cover rounded-lg p-2 border "
      />
    ),
    className: "pl-10",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "ten_san_pham",
  },
  {
    title: "Danh mục",
    dataIndex: "id_danh_muc",
  },

  {
    title: "Mô tả Ngắn",
    dataIndex: "mo_ta_ngan",
  },
  {
    title: "Nội dung",
    dataIndex: "noi_dung",
    className: "w-96",
  },
  {
    title: "Lượt xem",
    dataIndex: "luot_xem",
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
    anh_san_pham: "https://picsum.photos/id/10/300/300",
    ten_san_pham: "John abc",
    luot_xem: 32,
    id_danh_muc: "áo sơ mi",

    mo_ta_ngan: "New York No. 1 Lake Park",
    noi_dung:
      "Nàng sẽ ngay lập tức tăng điểm nữ tính mà vẫn vô cùng thoải mái cùng chiếc áo thun này. Sản phẩm được thiết kế với cổ rộng giúp tôn lên chiếc cổ thanh mảnh cùng xương quai xanh kiểu diễm. Dáng áo croptop cũng phù hợp để hack dáng hơn khi lên đồ. ",
  },
  {
    key: "2",
    anh_san_pham: "https://picsum.photos/id/10/300/300",
    ten_san_pham: "Jim Green",
    id_danh_muc: "quần dài",
    luot_xem: 42,
    mo_ta_ngan: "London No. 1 Lake Park",
    noi_dung:
      "Nàng sẽ ngay lập tức tăng điểm nữ tính mà vẫn vô cùng thoải mái cùng chiếc áo thun này. Sản phẩm được thiết kế với cổ rộng giúp tôn lên chiếc cổ thanh mảnh cùng xương quai xanh kiểu diễm. Dáng áo croptop cũng phù hợp để hack dáng hơn khi lên đồ. ",
  },
  {
    key: "3",
    anh_san_pham: "https://picsum.photos/id/10/300/300",
    ten_san_pham: "Joe Black",
    luot_xem: 32,
    id_danh_muc: "quần đùi",
    mo_ta_ngan: "Sidney No. 1 Lake Park",
    noi_dung:
      "Nàng sẽ ngay lập tức tăng điểm nữ tính mà vẫn vô cùng thoải mái cùng chiếc áo thun này. Sản phẩm được thiết kế với cổ rộng giúp tôn lên chiếc cổ thanh mảnh cùng xương quai xanh kiểu diễm. Dáng áo croptop cũng phù hợp để hack dáng hơn khi lên đồ. ",
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
  const [searchText, setSearchText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(searchText);
      // Thực hiện hành động tìm kiếm tại đây
    }
  };
  const products = [...data].reverse();

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
        <div className="max-w-xs my-2">
          <Input
            placeholder="Tìm kiếm..."
            size="large"
            value={searchText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={products}
        />
      </div>
    </main>
  );
};

export default ProductsAdmin;
