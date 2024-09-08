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
      "Nàng sẽ ngay lập tức tăng điểm nữ tính mà vẫn vô cùng thoải mái cùng chiếc áo thun này. Danh mụcđược thiết kế với cổ rộng giúp tôn lên chiếc cổ thanh mảnh cùng xương quai xanh kiểu diễm. Dáng áo croptop cũng phù hợp để hack dáng hơn khi lên đồ. ",
  },
  {
    key: "2",
    anh_san_pham: "https://picsum.photos/id/10/300/300",
    ten_san_pham: "Jim Green",
    id_danh_muc: "quần dài",
    luot_xem: 42,
    mo_ta_ngan: "London No. 1 Lake Park",
    noi_dung:
      "Nàng sẽ ngay lập tức tăng điểm nữ tính mà vẫn vô cùng thoải mái cùng chiếc áo thun này. Danh mụcđược thiết kế với cổ rộng giúp tôn lên chiếc cổ thanh mảnh cùng xương quai xanh kiểu diễm. Dáng áo croptop cũng phù hợp để hack dáng hơn khi lên đồ. ",
  },
  {
    key: "3",
    anh_san_pham: "https://picsum.photos/id/10/300/300",
    ten_san_pham: "Joe Black",
    luot_xem: 389,
    id_danh_muc: "quần đùi",
    mo_ta_ngan: "Sidney No. 1 Lake Park",
    noi_dung:
      "Nàng sẽ ngay lập tức tăng điểm nữ tính mà vẫn vô cùng thoải mái cùng chiếc áo thun này. Danh mụcđược thiết kế với cổ rộng giúp tôn lên chiếc cổ thanh mảnh cùng xương quai xanh kiểu diễm. Dáng áo croptop cũng phù hợp để hack dáng hơn khi lên đồ. ",
  },
];

const CategoriesRemote: React.FC = () => {
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
      title: "#ID",
      width: "10%",
      key: "id",
      dataIndex: "key",
    },
    {
      title: "Tên danh mục",
      dataIndex: "ten_san_pham",
      key: "ten_san_pham",
      width: "50%",
      ...getColumnSearchProps("ten_san_pham"),
      sorter: (a: any, b: any) => a.ten_san_pham.length - b.ten_san_pham.length,
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
          <Link to={"/admin/categories/edit/1"}>
            <Button className="  border bg-black  rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
             Khôi phục
            </Button>
          </Link>
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
          Quản trị / Danh mục /
          <span className="font-semibold px-px=">Thùng rác</span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className=" font-semibold md:text-3xl"> Thùng rác</h1>
        <div>
          {" "}
          <Link to="/admin/categories">
            <Button className="ml-auto bg-black text-white rounded-lg  py-1">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      <div className="max-w-4xl">
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

export default CategoriesRemote;
