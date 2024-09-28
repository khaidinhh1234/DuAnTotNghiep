import { IEvaluate } from "@/common/types/evaluate";
import instance from "@/configs/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input, Popconfirm, Rate, Space, Table, TableColumnsType, Modal, Select } from "antd";
import { useState } from "react";

const EvaluateAdmin = () => {
  const queryClient = useQueryClient();
  const { Option } = Select;

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
    mutationFn: async (data: { id: number, reply: string }) => {
      const response = await instance.post(`/admin/danhsachdanhgia/reply`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['danhgiasanpham']);  // Invalidate cache to refetch data
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });

  // State management for modal and replies
  const [reply, setReply] = useState<{ [key: number]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvaluate, setCurrentEvaluate] = useState<IEvaluate | null>(null);
  const [filter, setFilter] = useState({ product: "", star: "", user: "" });

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

  // Function to update reply state
  const handleReplyChange = (id: number, value: string) => {
    setReply((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
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
        <ExpandableContent content={`${record.user?.ten || "Người dùng ẩn"}: ${record.mo_ta}`} />
      ),
    },
    {
      title: "Chất lượng sản phẩm", 
      key: "chat_luong_san_pham", 
      render: (record: IEvaluate) => (
        <ExpandableContent content={`${record.san_pham?.ten_san_pham || "Sản phẩm ẩn"}: ${record.chat_luong_san_pham}`} />
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
          <Button type="primary" onClick={() => showModal(record)}>Phản hồi</Button>
          <Popconfirm title="Bạn có chắc muốn ẩn đánh giá này không?" onConfirm={() => console.log("Ẩn đánh giá:", record.id)}>
            <Button type="default" danger>Ẩn</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Filter component
  const Filters = () => (
    <div className="flex gap-4 mb-4">
      <Select placeholder="Chọn sản phẩm" style={{ width: 200 }} onChange={(value) => handleFilterChange('product', value)}>
        <Option value="">Tất cả sản phẩm</Option>
        <Option value="sanpham1">Sản phẩm 1</Option>
        <Option value="sanpham2">Sản phẩm 2</Option>
      </Select>
      <Select placeholder="Số sao" style={{ width: 200 }} onChange={(value) => handleFilterChange('star', value)}>
        <Option value="">Tất cả</Option>
        <Option value="5">5 sao</Option>
        <Option value="4">4 sao</Option>
        <Option value="3">3 sao</Option>
      </Select>
      <Input placeholder="Tìm kiếm người dùng" style={{ width: 200 }} onChange={(e) => handleFilterChange('user', e.target.value)} />
    </div>
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Đánh giá sản phẩm</h1>
      </div>
      <Filters />
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
            />
          </div>
        )}
      </Modal>
    </main>
  );
};

// ExpandableContent component definition
const ExpandableContent = ({ content }: { content: string }): JSX.Element => (
  <div>{content}</div>
);

export default EvaluateAdmin;
