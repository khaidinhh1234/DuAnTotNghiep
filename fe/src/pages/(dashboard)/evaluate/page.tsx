import { IEvaluate } from "@/common/types/evaluate";
import instance from "@/configs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Modal, Popconfirm, Rate, Space, Table, TableColumnsType } from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";

const EvaluateAdmin = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  
  // Query to fetch data from API
  const { data, isLoading, isError } = useQuery({
    queryKey: ['danhgiasanpham'],
    queryFn: async () => {
      const response = await instance.get(`/admin/danhsachdanhgia`);
      return response.data;
    },
  });

  // Mutation to send replies to API
  const mutation = useMutation({
    mutationFn: async (id: number | string) => {
      const response = await instance.post(`/admin/danhsachdanhgia/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['danhgiasanpham']);
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });

  const hideEvaluate = useMutation({
    mutationFn: async (id: number) => {
      await instance.delete(`/admin/danhsachdanhgia/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['danhgiasanpham']);
    },
    onError: (error) => {
      console.error('Error hiding review:', error);
    },
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvaluate, setCurrentEvaluate] = useState<IEvaluate | null>(null);

  // Functions to handle modal behavior
  const showModal = (record: IEvaluate) => {
    setCurrentEvaluate(record);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (currentEvaluate && reply[currentEvaluate.id]) {
      mutation.mutate({ id: currentEvaluate.id, reply: reply[currentEvaluate.id] });
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleReplyChange = (id: number, value: string) => {
    setReply((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Loading and error handling
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Đã xảy ra lỗi khi tải dữ liệu.</p>;

  // Prepare data for the table
  const dataSource = data?.data.map((evaluate: IEvaluate) => ({
    key: evaluate.id,
    ...evaluate,
    user_id: evaluate.user?.ten || "Chưa có dữ liệu",
    san_pham_id: evaluate.san_pham?.ten_san_pham || "Chưa có dữ liệu",
  })) || [];

  // Define columns for the table
  const columns: TableColumnsType<IEvaluate> = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Nội dung",
      key: "mo_ta",
      render: (record: IEvaluate) => (
        <div>
          {record.reply ? `Phản hồi: ${record.reply}` : `${record.user?.ten || "Người dùng ẩn"}: ${record.mo_ta}`}
        </div>
      ),
    },
    {
      title: "Chất lượng sản phẩm",
      key: "chat_luong_san_pham",
      render: (record: IEvaluate) => (
        <div>{record.san_pham?.ten_san_pham || "Sản phẩm ẩn"}: {record.chat_luong_san_pham}</div>
      ),
    },
    {
      title: "Chất lượng",
      key: "chat_luong",
      render: (record: IEvaluate) => (
        <div>
          <div><span>Sản phẩm: </span><Rate disabled value={record.so_sao_san_pham} /></div>
          <div><span>Vận chuyển: </span><Rate disabled value={record.so_sao_dich_vu_van_chuyen} /></div>
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "hanh_dong",
      render: (_, record: IEvaluate) => (
        <Space>
          <Button type="primary" onClick={() => showModal(record)} disabled={!!record.phan_hoi}>Phản hồi</Button>
          <Popconfirm title="Bạn có chắc muốn ẩn đánh giá này không?" onConfirm={() => hideEvaluate.mutate(record.id)}>
            <Button type="default" danger>Ẩn</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Đánh giá sản phẩm</h1>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
      />
      <Modal title="Phản hồi đánh giá" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {currentEvaluate && (
          <div className="flex flex-col gap-2">
            <p><strong>Đánh giá của khách hàng:</strong> {currentEvaluate.mo_ta}</p>
            <Input.TextArea
              rows={4}
              value={reply[currentEvaluate.id] || ""}
              onChange={(e) => handleReplyChange(currentEvaluate.id, e.target.value)}
              placeholder="Nhập phản hồi"
              disabled={!!currentEvaluate.phan_hoi} // Disable if there's already a reply
            />
          </div>
        )}
      </Modal>
    </main>
  );
};

export default EvaluateAdmin;
