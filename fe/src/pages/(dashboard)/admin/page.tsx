import React from 'react';
import {
  Button,
  Popconfirm,
  Space,
  Table,
  TableColumnsType,
  Tag,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

interface UserPrivilegeDataType {
  key: React.Key;
  username: string;
  email: string;
  role: string;
  status: string;
}

const columns: TableColumnsType<UserPrivilegeDataType> = [
  {
    title: 'Tên người dùng',
    dataIndex: 'username',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Vai trò',
    dataIndex: 'role',
    render: (role) =>
      role === 'admin' ? (
        <Tag color="blue">Quản trị viên</Tag>
      ) : (
        <Tag color="geekblue">Người dùng</Tag>
      ),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    render: (status) =>
      status === 'active' ? (
        <Tag color="green">Hoạt động</Tag>
      ) : (
        <Tag color="red">Ngừng hoạt động</Tag>
      ),
  },
  {
    title: 'Hành động',
    key: 'action',
    render: (_, record) => (
      <Space>
        <Link to={`/admin/edit-user/${record.key}`}>
          <Button className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
            Cập nhật
          </Button>
        </Link>
        <Popconfirm
          title="Bạn có chắc muốn khóa người dùng này không?"
          onConfirm={() => console.log('Khóa người dùng:', record.key)}
        >
          <Button className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
            Khóa
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
];

const data: UserPrivilegeDataType[] = [
  {
    key: '1',
    username: 'john_doe',
    email: 'john.doe@example.com',
    role: 'admin',
    status: 'active',
  },
  {
    key: '2',
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    role: 'user',
    status: 'inactive',
  },
];

const PagePrivilegeAdmin = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold">Quản lý tài khoản admin</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Danh sách tài khoản admin</h1>
        <Link to="/admin/add-admin">
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm tài khoản mới
          </Button>
        </Link>
      </div>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
    </main>
  );
};

export default PagePrivilegeAdmin;
