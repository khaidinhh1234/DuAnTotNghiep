import { IEvaluate } from "@/common/types/evaluate";
import instance from "@/configs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Input,
  Modal,
  Popconfirm,
  Rate,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import { useState } from "react";
import { useParams } from "react-router-dom";

const EvaluateAdmin = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();

  // Query to fetch evaluations
  const { data, isLoading, isError } = useQuery({
    queryKey: ["danhgiasanpham"],
    queryFn: async () => {
      const response = await instance.get(`/admin/danhsachdanhgia`);
      return response.data;
    },
  });

  // Mutation to send replies to API
  const mutation = useMutation({
    mutationFn: async ({
      id,
      phan_hoi,
    }: {
      id: number | string;
      phan_hoi: string;
    }) => {
      const response = await instance.post(`/admin/danhsachdanhgia/${id}`, {
        phan_hoi,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["danhgiasanpham"] });
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const hideEvaluate = useMutation({
    mutationFn: async (id: number) => {
      await instance.delete(`/admin/danhsachdanhgia/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["danhgiasanpham"] });
    },
    onError: (error) => {
      console.error("Error hiding review:", error);
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvaluate, setCurrentEvaluate] = useState<IEvaluate | null>(
    null
  );
  const [phan_hoi, setphan_hoi] = useState<{ [key: number]: string }>({});

  const showModal = (record: IEvaluate) => {
    setCurrentEvaluate(record);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (currentEvaluate && phan_hoi[currentEvaluate.id as number]) {
      mutation.mutate({
        id: currentEvaluate.id,
        phan_hoi: phan_hoi[currentEvaluate.id as number],
      });
    }
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handlephan_hoiChange = (id: number, value: string) => {
    setphan_hoi((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Đã xảy ra lỗi khi tải dữ liệu.</p>;

  const dataSource =
    data?.data.map((evaluate: IEvaluate) => ({
      key: evaluate.id,
      ...evaluate,
      user_id: evaluate?.user?.ten || "Chưa có dữ liệu",
      san_pham_id: evaluate.san_pham?.ten_san_pham || "Chưa có dữ liệu",
    })) || [];

  const columns: TableColumnsType<IEvaluate> = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Nội dung",
      key: "mo_ta",
      render: (record: IEvaluate) => (
        <div>
          <p>
            {record.user?.ten || "Người dùng ẩn"}: {record.mo_ta}
          </p>
          {record.phan_hoi && (
            <p>
              <strong>Trả lời:</strong> {record.phan_hoi}
            </p>
          )}
        </div>
      ),
    },

    {
      title: "Chất lượng sản phẩm",
      key: "chat_luong_san_pham",
      render: (record: IEvaluate) => (
        <div>
          {record.san_pham?.ten_san_pham || "Sản phẩm ẩn"}:{" "}
          {record.chat_luong_san_pham}
        </div>
      ),
    },
    {
      title: "Chất lượng",
      width: "20%",
      key: "chat_luong",
      render: (record: IEvaluate) => (
        <div>
          <div className="flex justify-between">
            <span>Sản phẩm: </span>
            <Rate disabled value={record.so_sao_san_pham} />
          </div>
          <div className="flex justify-between">
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
          <Button
            className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
            onClick={() => showModal(record)}
            disabled={!!record.phan_hoi}
          >
            Trả lời
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn ẩn đánh giá này không?"
            onConfirm={() => hideEvaluate.mutate(record.id as number)}
          >
            <Button className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300">
              Ẩn
            </Button>
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
      <Modal
        title="Phản hồi đánh giá"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {currentEvaluate && (
          <div className="flex flex-col gap-2">
            <p>
              <strong>Đánh giá của khách hàng:</strong> {currentEvaluate.mo_ta}
            </p>
            <Input.TextArea
              rows={4}
              value={phan_hoi[currentEvaluate.id as number] || ""}
              onChange={(e) =>
                handlephan_hoiChange(
                  currentEvaluate.id as number,
                  e.target.value
                )
              }
              placeholder="Nhập phản hồi"
              disabled={!!currentEvaluate.phan_hoi}
            />
          </div>
        )}
      </Modal>
    </main>
  );
};

export default EvaluateAdmin;
