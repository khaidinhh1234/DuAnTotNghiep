import {
    Button,
    Popconfirm,
    Space,
    Table,
    TableColumnsType,
    TableProps,
    Tag,
  } from "antd";
  
  type TableRowSelection<T extends object = object> =
    TableProps<T>["rowSelection"];
  
  interface ReviewDataType {
    key: React.Key;
    reviewerName: string;
    reviewerEmail: string;
    product: string;
    rating: number;
    comment: string;
    status: string;
  }
  
  const columns: TableColumnsType<ReviewDataType> = [
    {
      title: "Tên người đánh giá",
      dataIndex: "reviewerName",
    },
    {
      title: "Email",
      dataIndex: "reviewerEmail",
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
    },
    {
      title: "Số sao",
      dataIndex: "rating",
      render: (rating) => (
        <Tag color={rating >= 4 ? "green" : rating >= 2 ? "orange" : "red"}>
          {rating} sao
        </Tag>
      ),
    },
    {
      title: "Nhận xét",
      dataIndex: "comment",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) =>
        status === "Đã duyệt" ? (
          <Tag color="green">Đã duyệt</Tag>
        ) : (
          <Tag color="red">Chưa duyệt</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary">Duyệt</Button>
          <Popconfirm
            title="Bạn có chắc muốn ẩn đánh giá này không?"
            onConfirm={() => console.log("Ẩn đánh giá:", record.key)}
          >
            <Button type="default" danger>
              Ẩn
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  const data: ReviewDataType[] = [
    {
      key: "1",
      reviewerName: "John Brown",
      reviewerEmail: "john@example.com",
      product: "Sản phẩm 1",
      rating: 4,
      comment: "Sản phẩm tốt, giao hàng nhanh.",
      status: "Đã duyệt",
    },
    {
      key: "2",
      reviewerName: "Jane Smith",
      reviewerEmail: "jane@example.com",
      product: "Sản phẩm 2",
      rating: 2,
      comment: "Sản phẩm không như mong đợi.",
      status: "Chưa duyệt",
    },
  ];
  
  const EvaluateAdmin = () => {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="md:text-base">
            Quản trị / <span className="font-semibold">Đánh giá</span>
          </h1>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="font-semibold md:text-3xl">Đánh giá sản phẩm</h1>
        </div>
        <div>
          <Table columns={columns} dataSource={data} />
        </div>
      </main>
    );
  };
  
  export default EvaluateAdmin;
  