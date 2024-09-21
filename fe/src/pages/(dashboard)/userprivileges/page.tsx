import instance from "@/configs/axios";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Input,
  Space,
  Table,
  TableColumnsType,
  TableProps,
} from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

const { Search } = Input;

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

interface UserPrivilegeDataType {
  key: React.Key;
  privilege: string;
  description: string;
}

const columns: TableColumnsType<UserPrivilegeDataType> = [
  {
    title: "Vai trò",
    dataIndex: "ten_vai_tro",
  },
  {
    title: "Mô tả vai trò",
    dataIndex: "mo_ta",
  },
  {
    title: "Hành động",
    render: (_, record) => (
      <Space>
        <Button
          className="bg-white text-red-500 border border-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 shadow-md transition-colors"
          style={{ marginRight: 5 }}
        >
          Xem Quyền
        </Button>

        <Link to="">
          <Button className="text-white bg-black rounded-lg hover:bg-orange-50 hover:text-black shadow-xl shadow-black/20  transition-colors hover:border-0">
            Cập nhật
          </Button>
        </Link>
      </Space>
    ),
  },
];

// const data: UserPrivilegeDataType[] = [
//   {
//     key: "1",
//     privilege: "Quản lý tài khoản",
//     description: "Có quyền truy cập và quản lý các tài khoản người dùng",
//   },
//   {
//     key: "2",
//     privilege: "Xem báo cáo",
//     description: "Có thể xem các báo cáo thống kê",
//   },
//   {
//     key: "3",
//     privilege: "Quản lý sản phẩm",
//     description: "Quản lý và cập nhật thông tin sản phẩm",
//   },
//   {
//     key: "3",
//     privilege: "Quản lý danh mục",
//     description: "Quản lý và cập nhật thông tin sản phẩm",
//   },
//   {
//     key: "3",
//     privilege: "Quản lý bài viết",
//     description: "Quản lý và cập nhật thông tin sản phẩm",
//   },
//   {
//     key: "3",
//     privilege: "Quản lý vận chuyển",
//     description: "Quản lý và cập nhật thông tin sản phẩm",
//   },
// ];

const UserPrivilegeAdmin = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userPrivileges"],
    queryFn: async () => {
      const response = await instance.get("/admin/vaitro");
      return response.data;
    },
  });
  const vaitro = data?.data;
  console.log(vaitro);
  const [filteredData, setFilteredData] = useState(data?.data);

  const onSearch = (value: string) => {
    const filtered = data?.data?.filter(
      (item: any) =>
        item.ten_vai_tro.toLowerCase().includes(value.toLowerCase())
      // ||
      //   item.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const rowSelection: TableRowSelection<UserPrivilegeDataType> = {
    onChange: (selectedRowKeys) => {
      console.log("Selected Row Keys:", selectedRowKeys);
    },
  };
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold">Vai trò</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Quản lý vai trò</h1>
        <Link to="/admin/ADmin/userprivileges/add-permission">
          <Button className="bg-black text-white" icon={<PlusOutlined />}>
            Thêm vai trò mới
          </Button>
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <Search
          placeholder="Tìm kiếm quyền hoặc mô tả"
          allowClear
          onSearch={onSearch}
          style={{ width: 300 }}
        />
      </div>
      <div>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowSelection={rowSelection}
        />
      </div>
    </main>
  );
};

export default UserPrivilegeAdmin;
