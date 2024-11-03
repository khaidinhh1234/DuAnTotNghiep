import React from "react";
import { Table, Space, Tag, Button, message, Popconfirm } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TableColumnsType } from "antd";
import instance from "@/configs/admin";

interface WithdrawalRequest {
  id: number;
  vi_tien_id: number;
  ngan_hang_id: number;
  so_tien: number;
  trang_thai: string;
  created_at: string | null;
  updated_at: string;
  deleted_at: null;
  vi_tien: {
    id: number;
    user_id: number;
    so_du: number;
    created_at: string;
    updated_at: string;
    deleted_at: null;
  };
}

const WithdrawalRequests: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["withdrawal-requests"],
    queryFn: async () => {
      const res = await instance.get("/danh-sach-yeu-cau-rut-tien");
      return res.data;
    },
  });

  const { mutate: confirmWithdrawal } = useMutation({
    mutationFn: async (id: number) => {
      const response = await instance.post(`/rut-tien/xac-nhan/${id}`, {
        trang_thai: "da_rut"
      });
      return response.data;
    },
    onSuccess: () => {
      message.success("Xác nhận rút tiền thành công");
      queryClient.invalidateQueries({ queryKey: ["withdrawal-requests"] });
    },
    onError: () => {
      message.error("Xác nhận rút tiền thất bại");
    },
  });
  

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã rút":
        return "green";
      case "Chờ duyệt":
        return "blue";
      default:
        return "default";
    }
  };

  const columns: TableColumnsType<WithdrawalRequest> = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    //   width: "5%",
    // },
    {
      title: "Mã ví",
      dataIndex: ["vi_tien", "id"],
      key: "vi_tien_id",
      width: "10%",
    },
    {
      title: "Số tiền rút",
      dataIndex: "so_tien",
      key: "so_tien",
      render: (amount) => formatCurrency(amount),
      width: "15%",
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
      width: "12%",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => formatDate(date),
      width: "15%",
    },
    {
      title: "Số dư ví",
      dataIndex: ["vi_tien", "so_du"],
      key: "so_du",
      render: (amount) => formatCurrency(amount),
      width: "15%",
    },
    {
      title: "Thao tác",
      key: "action",
      width: "13%",
      render: (_, record) => (
        <Space>
          {record.trang_thai === "Chờ duyệt" && (
            <Popconfirm
              title="Xác nhận rút tiền"
              description="Bạn có chắc chắn muốn xác nhận yêu cầu rút tiền này?"
              onConfirm={() => confirmWithdrawal(record.id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <Button 
                type="primary"
                className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold"              >
                Xác nhận rút tiền
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold">Yêu cầu rút tiền</span>
        </h1>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Danh sách yêu cầu rút tiền</h1>
      </div>
      
      <Table
  columns={columns}
  dataSource={data?.data}
  pagination={{ 
    pageSize: 10, 
    className: "my-5",  }}
  rowKey="id"
  loading={isLoading}
/>
    </main>
  );
};

export default WithdrawalRequests;
