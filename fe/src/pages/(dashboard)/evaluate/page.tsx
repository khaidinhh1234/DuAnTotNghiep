import { IEvaluate } from "@/common/types/evaluate";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Popconfirm, Rate, Space, Table } from "antd";
import { useState } from "react";

// Dữ liệu giả
const fakeEvaluateData: IEvaluate[] = [
  {
    id: 1,
    user_id: 101,
    san_pham_id: 1001,
    so_sao_san_pham: 5,
    so_sao_dich_vu_van_chuyen: 4,
    noi_dung: "Sản phẩm rất tốt, chất lượng cao",
    trang_thai: true,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: 2,
    user_id: 102,
    san_pham_id: 1002,
    so_sao_san_pham: 3,
    so_sao_dich_vu_van_chuyen: 3,
    noi_dung: "Sản phẩm tạm ổn nhưng giao hàng chậm",
    trang_thai: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
];

// Lấy dữ liệu giả
const fetchEvaluateData = async (): Promise<IEvaluate[]> => {
  return new Promise<IEvaluate[]>((resolve) => {
    setTimeout(() => {
      resolve(fakeEvaluateData);
    }, 500);
  });
};

// Gửi phản hồi lên API
const sendReply = async ({ id, reply }: { id: number; reply: string }) => {
  console.log(`Gửi phản hồi cho đánh giá ID: ${id}, Phản hồi: ${reply}`);
  // Gửi dữ liệu lên server để lưu phản hồi
  // await instance.post(`/admin/sanpham/danhgia/${id}/phanhoi`, { reply });
};

const EvaluateAdmin = () => {
  const { data = [], isLoading, isError } = useQuery<IEvaluate[]>({
    queryKey: ["danhgia"],
    queryFn: fetchEvaluateData,
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data) => {
      // Your mutation logic here, e.g., API call
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });

  const [reply, setReply] = useState<{ [key: number]: string }>({});

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Đã xảy ra lỗi khi tải dữ liệu.</p>;
  }

  const handleReplyChange = (id: number, value: string) => {
    setReply((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSendReply = (id: number) => {
    if (reply[id]) {
      mutation.mutate({ id, reply: reply[id] });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Người dùng",
      key: "user_id",
      render: (record: IEvaluate) => `User ${record.user_id}`,
    },
    {
      title: "Sản phẩm",
      key: "san_pham_id",
      render: (record: IEvaluate) => `Sản phẩm ${record.san_pham_id}`,
    },
    {
      title: "Nội dung",
      key: "noi_dung",
      render: (record: IEvaluate) => (
        <div>
          <p>{record.noi_dung}</p>
          <Space direction="vertical">
            <Input.TextArea
              rows={3}
              value={reply[record.id] || ""}
              onChange={(e) => handleReplyChange(record.id, e.target.value)}
              placeholder="Nhập phản hồi của bạn..."
            />
            <Button
              type="primary"
              onClick={() => handleSendReply(record.id)}
              disabled={!reply[record.id]}
            >
              Gửi phản hồi
            </Button>
          </Space>
        </div>
      ),
    },
    {
      title: "Chất lượng",
      key: "chat_luong",
      render: (record: IEvaluate) => (
        <div>
          <div>
            <span>Sản phẩm: </span>
            <Rate disabled value={record.so_sao_san_pham} />
          </div>
          <div>
            <span>Vận chuyển: </span>
            <Rate disabled value={record.so_sao_dich_vu_van_chuyen} />
          </div>
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "hanh_dong",
      render: (_, record: IEvaluate) => (
        <Space>
          <Button type="primary">Duyệt</Button>
          <Popconfirm
            title="Bạn có chắc muốn ẩn đánh giá này không?"
            onConfirm={() => console.log("Ẩn đánh giá:", record.id)}
          >
            <Button type="default" danger>
              Ẩn
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
        <Table columns={columns} dataSource={data} rowKey="id" />
      </div>
    </main>
  );
};

export default EvaluateAdmin;
