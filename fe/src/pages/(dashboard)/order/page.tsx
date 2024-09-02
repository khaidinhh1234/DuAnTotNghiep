import {
  Button,
  Popconfirm,
  Popover,
  Space,
  Table,
  TableColumnsType,
  TableProps,
} from "antd";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

interface DataType {
  key: React.Key;
  name: string;
  email: string;
  numberPhone: string;
  address: string;
  products: string;
  priceTotal: number;
  status: string;
}

const content = (
  <div>
    <p>Chi tiết sản phẩm 1</p>
    <p>Chi tiết sản phẩm 2</p>
  </div>
);

const columns: TableColumnsType<DataType> = [
  {
    title: "Họ Tên",
    dataIndex: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Số điện thoại",
    dataIndex: "numberPhone",
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
  },
  {
    title: "Sản phẩm",
    dataIndex: "products",
    render: (_, record) => (
      <Popover content={content} title="Chi tiết sản phẩm" trigger="click">
        <Button>Xem sản phẩm</Button>
      </Popover>
    ),
  },
  {
    title: "Tổng tiền",
    dataIndex: "priceTotal",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (status) =>
      status === "Đã giao hàng" ? "Đã giao hàng" : "Chưa giao hàng",
  },
  {
    title: "Quản trị",
    key: "action",
    render: (_, record) => (
      <Space>
        <Button className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
          Cập nhật
        </Button>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: "1",
    name: "John Brown",
    email: "john@example.com",
    numberPhone: "0987654321",
    address: "New York No. 1 Lake Park",
    products: "Sản phẩm 1",
    priceTotal: 100000,
    status: "Chưa giao hàng",
  },
];

const OrderAdmin = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold">Sản phẩm</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Sản phẩm</h1>
      </div>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
    </main>
  );
};

export default OrderAdmin;
