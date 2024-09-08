import { PlusOutlined } from "@ant-design/icons";
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
    title: "Quyền",
    dataIndex: "privilege",
  },
  {
    title: "Mô tả",
    dataIndex: "description",
  },
];

const data: UserPrivilegeDataType[] = [
  {
    key: "1",
    privilege: "Quản lý tài khoản",
    description: "Có quyền truy cập và quản lý các tài khoản người dùng",
  },
  {
    key: "2",
    privilege: "Xem báo cáo",
    description: "Có thể xem các báo cáo thống kê",
  },
  {
    key: "3",
    privilege: "Quản lý sản phẩm",
    description: "Quản lý và cập nhật thông tin sản phẩm",
  },
  {
    key: "3",
    privilege: "Quản lý danh mục",
    description: "Quản lý và cập nhật thông tin sản phẩm",
  },
  {
    key: "3",
    privilege: "Quản lý bài viết",
    description: "Quản lý và cập nhật thông tin sản phẩm",
  },
  {
    key: "3",
    privilege: "Quản lý vận chuyển",
    description: "Quản lý và cập nhật thông tin sản phẩm",
  },
];

const UserPrivilegeAdmin = () => {
  const [filteredData, setFilteredData] = useState(data);

  const onSearch = (value: string) => {
    const filtered = data.filter(
      (item) =>
        item.privilege.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const rowSelection: TableRowSelection<UserPrivilegeDataType> = {
    onChange: (selectedRowKeys) => {
      console.log("Selected Row Keys:", selectedRowKeys);
    },
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold">Phân quyền admin</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Phân quyền</h1>
        <Link to="/admin/add-permission">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm tài khoản mới
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
