import React, { useState } from "react";
import { Table, Space, Tag, Button, message, Popconfirm, Modal } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TableColumnsType } from "antd";
import instance from "@/configs/admin";
import { CopyOutlined } from "@ant-design/icons";

interface BankInfo {
  id: number;
  user_id: number;
  tai_khoan_ngan_hang: string;
  ten_chu_tai_khoan: string;
  ngan_hang: string;
  logo_ngan_hang: string;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

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
  ngan_hang: BankInfo;
}

const WithdrawalRequests: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBank, setSelectedBank] = useState<BankInfo | null>(null);
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
      try {
        const response = await instance.post(`/rut-tien/xac-nhan/${id}`, {
          trang_thai: "da_rut",
        });
        return response.data;
      } catch (error: any) {
        message.error("Xác nhận rút tiền thất bại");
        throw new Error("Xác nhận rút tiền thất bại");
      }
    },
    onSuccess: () => {
      message.success("Xác nhận rút tiền thành công");
      queryClient.invalidateQueries({ queryKey: ["withdrawal-requests"] });
    },
  });
  const { mutate: rejectWithdrawal } = useMutation({
    mutationFn: async (id: number) => {
      try {
        const response = await instance.post(`/rut-tien/xac-nhan/${id}`, {
          trang_thai: "tu_choi",
        });
        return response.data;
      } catch (error: any) {
        message.error("Từ chối yêu cầu rút tiền thất bại");
        throw new Error("Từ chối yêu cầu rút tiền thất bại");
      }
    },
    onSuccess: () => {
      message.success("Từ chối yêu cầu rút tiền thành công");
      queryClient.invalidateQueries({ queryKey: ["withdrawal-requests"] });
    },
  });
  const showBankModal = (bankInfo: BankInfo) => {
    setSelectedBank(bankInfo);
    setIsModalVisible(true);
  };

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
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã rút":
        return "green";
      case "Chờ duyệt":
        return "blue";
      case "Từ chối":
        return "red";
      default:
        return "default";
    }
  };

  const columns: TableColumnsType<WithdrawalRequest> = [
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
      title: "Thông tin ngân hàng",
      dataIndex: "ngan_hang",
      key: "ngan_hang",
      width: "15%",
      render: (bank: BankInfo) => (
        <Button type="link" onClick={() => showBankModal(bank)}>
          {bank.ngan_hang}
        </Button>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
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
      width: "20%",
      render: (_, record) => (
        <Space>
          {record.trang_thai === "Chờ duyệt" && (
            <>
              <Popconfirm
                title="Xác nhận rút tiền"
                description="Bạn có chắc chắn muốn xác nhận yêu cầu rút tiền này?"
                onConfirm={() => confirmWithdrawal(record.id)}
                okButtonProps={{
                  className:
                    "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border-none font-medium",
                }}
                cancelButtonProps={{
                  className:
                    "hover:bg-gray-100 border border-gray-300 text-gray-600 font-medium",
                }}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <Button
                  type="primary"
                  className="bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold"
                >
                  Xác nhận rút tiền
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Từ chối rút tiền"
                description="Bạn có chắc chắn muốn từ chối yêu cầu rút tiền này?"
                onConfirm={() => rejectWithdrawal(record.id)}
                okButtonProps={{
                  className:
                    "bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border-none font-medium",
                }}
                cancelButtonProps={{
                  className:
                    "hover:bg-gray-100 border border-gray-300 text-gray-600 font-medium",
                }}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <Button
                  danger
                  type="primary"
                  className="bg-gradient-to-l from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600 border border-red-300 font-bold"
                >
                  Từ chối
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="md:text-base">
            Quản trị / <span className="font-semibold">Yêu cầu rút tiền</span>
          </h1>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold md:text-3xl">
            Danh sách yêu cầu rút tiền
          </h1>
        </div>

        <Table
          columns={columns}
          dataSource={data?.data}
          pagination={{
            pageSize: 10,
            className: "my-5",
          }}
          rowKey="id"
          loading={isLoading}
        />
      </main>

      <Modal
        title="Thông tin ngân hàng"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={480}
      >
        {selectedBank && (
          <div className="w-full max-w-md mx-auto">
            <div className="rounded-2xl bg-white p-6">
              <div className="mb-6">
                <div
                  className="relative h-56 w-full rounded-xl p-6 text-white shadow-md"
                  style={{
                    backgroundImage:
                      "url('/istockphoto-1332736514-1024x1024.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute right-6 top-6 text-xl font-bold italic tracking-wider text-white drop-shadow-lg">
                    <h2 className="text-lg font-semibold">
                      {selectedBank.ngan_hang}
                    </h2>
                  </div>
                  <div className="absolute left-6 top-4 h-14 w-20 rounded shadow">
                    <img
                      src={selectedBank.logo_ngan_hang}
                      alt={selectedBank.ngan_hang}
                      className="h-14 w-20 object-contain"
                    />
                  </div>
                  <div className="absolute bottom-6 left-8 ">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-lg font-semibold">
                        STK: {selectedBank.tai_khoan_ngan_hang}
                      </p>
                      <CopyOutlined
                        className="cursor-pointer hover:text-blue-400 transition-colors -mt-4"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            selectedBank.tai_khoan_ngan_hang
                          );
                          message.success("Đã sao chép số tài khoản");
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold">
                        Chủ TK: {selectedBank.ten_chu_tai_khoan}
                      </p>
                      <CopyOutlined
                        className="cursor-pointer hover:text-blue-400 transition-colors -mt-4"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            selectedBank.ten_chu_tai_khoan
                          );
                          message.success("Đã sao chép tên chủ tài khoản");
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Ngày tạo</span>
                  <span className="font-medium">
                    {formatDate(selectedBank.created_at)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Mã ngân hàng</span>
                  <span className="font-medium">#{selectedBank.id}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default WithdrawalRequests;
