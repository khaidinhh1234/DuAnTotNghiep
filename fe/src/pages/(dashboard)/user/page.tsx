import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, TableColumnsType, TableProps } from "antd";
import { Link } from "react-router-dom";
type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

interface DataType {
  key: React.Key;
  first_name: string;
  last_name: string;
  // name: string;
  email: string;
  phoneNumber?: string;
  address: string
}
const columns: TableColumnsType<DataType> = [
  {
    title: "Họ",
    dataIndex: "first_name",
  },
  {
    title: "Tên",
    dataIndex: "last_name",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Số địa thoại",
    dataIndex: "phoneNumber",
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
          title="Khóa tài khoản người dùng"
          description="Bạn có chắc chắn muốn khóa không?"
          okText="Có "
          cancelText="Không"
        >
          <Button className=" border bg-black  rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
            Khóa
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
];
const data: DataType[] = [
  {
    key: "1",
    first_name: "a",
    last_name:"bc",
    email: "john.doe@example.com",
    phoneNumber: "0987654321",
    address: "123 Main St, Anytown, USA",
  },
  {
    key: "2",
    first_name: "a",
    last_name:"bc",
    email: "john.doe@example.com",
    phoneNumber: "0987654321",
    address: "123 Main St, Anytown, USA",
  },
  {
    key: "3",
    first_name: "a",
    last_name:"bc",
    email: "john.doe@example.com",
    phoneNumber: "0987654321",
    address: "123 Main St, Anytown, USA",
  },
];
const UserAdmin = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className=" md:text-base">
          Quản trị / <span className="font-semibold px-px=">Người dùng</span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className=" font-semibold md:text-3xl">Người dùng</h1>
       
        {/* <Link to="remote">
          <Button className="ml-auto bg-black text-white rounded-lg  py-1">
            <DeleteOutlined className="mr-1" />
            Thùng rác
          </Button>
        </Link> */}
      </div>
      <div className=" ">
        <Table
        rowSelection={{
          // type: selectionType,
          // ...rowSelection,
        }}
          // rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
        />
      </div>
    </main>
  )
};

export default UserAdmin;
