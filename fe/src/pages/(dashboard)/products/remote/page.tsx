import React, { useRef, useState } from "react";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";

interface DataType {
  key: React.Key;
  anh_san_pham: string;
  ten_san_pham: string;
  id_danh_muc: string;
  luot_xem: number;
  mo_ta_ngan: string;
  noi_dung: string;
}

type DataIndex = keyof DataType;

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
    luot_xem: 389,
    id_danh_muc: "quần đùi",
    mo_ta_ngan: "Sidney No. 1 Lake Park",
    noi_dung:
      "Nàng sẽ ngay lập tức tăng điểm nữ tính mà vẫn vô cùng thoải mái cùng chiếc áo thun này. Sản phẩm được thiết kế với cổ rộng giúp tôn lên chiếc cổ thanh mảnh cùng xương quai xanh kiểu diễm. Dáng áo croptop cũng phù hợp để hack dáng hơn khi lên đồ. ",
  },
];

const ProductsRemote: React.FC = () => {
  // const [searchText, setSearchText] = useState
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

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
      width: "15%",
      key: "anh_san_pham",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "ten_san_pham",
      key: "ten_san_pham",
      width: "15%",
      ...getColumnSearchProps("ten_san_pham"),
      sorter: (a: any, b: any) => a.ten_san_pham.length - b.ten_san_pham.length,
    },
    {
      title: "Danh mục",
      dataIndex: "id_danh_muc",
      key: "id_danh_muc",
      width: "15%",
      ...getColumnSearchProps("id_danh_muc"),
      sorter: (e: any, c: any) => e.id_danh_muc.length - c.id_danh_muc.length,
    },
    {
      title: "Mô tả Ngắn",
      dataIndex: "mo_ta_ngan",
      width: "10%",
      key: "mo_ta_ngan",
    },
    {
      title: "Nội dung",
      dataIndex: "noi_dung",
      className: "w-96",

      key: "noi_dung",
    },
    {
      title: "Lượt xem",
      dataIndex: "luot_xem",
      width: "7%",

      sorter: (a: any, b: any) => a.luot_xem - b.luot_xem,
      sortDirections: ["descend", "ascend"],
      key: "luot_xem",
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
            <Button className="bg-white text-red-500 border border-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 shadow-md transition-colors">
            Xóa
            </Button>
          </Popconfirm>
          <Button className="bg-white text-red-500 border border-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 shadow-md transition-colors">
          Khôi phục
          </Button>
        </Space>
      ),
    },
  ];
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
          Quản trị / Sản phẩm /{" "}
          <span className="font-semibold px-px=">Thùng rác </span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className=" font-semibold md:text-3xl"> Thùng rác</h1>
        <div>
          {" "}
          <Link to="/admin/products">
            <Button className="ml-auto bg-black text-white rounded-lg  py-1">
              Quay lại
            </Button>
          </Link>
        </div>
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
        <Table columns={columns} dataSource={data} />;
      </div>
    </main>
  );
};

export default ProductsRemote;
