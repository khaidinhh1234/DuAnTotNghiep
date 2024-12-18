import React, { useState } from "react";
import { Modal, Button, Tag, Descriptions } from "antd";

interface RefundDetailProps {
  record: any;
}

const RefundDetail: React.FC<RefundDetailProps> = ({ record }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "cho_xac_nhan":
        return "blue";
      case "hoan_thanh_cong":
        return "green";
      case "tu_choi":
        return "red";
      default:
        return "default";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "cho_xac_nhan":
        return "Chờ xác nhận";
      case "hoan_thanh_cong":
        return "Hoàn thành";
      case "tu_choi":
        return "Từ chối";
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Xem chi tiết</Button>

      <Modal
        title="Chi tiết yêu cầu hoàn hàng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Mã đơn hàng" span={2}>
            {record.don_hang.ma_don_hang}
          </Descriptions.Item>
          <Descriptions.Item label="Thông tin người đặt" span={2}>
            <div className="space-y-2">
              <div>
                <strong>Tên người đặt:</strong>{" "}
                {record.don_hang.ten_nguoi_dat_hang || "Chưa cập nhật"}
              </div>
              <div>
                <strong>Số điện thoại:</strong>{" "}
                {record.don_hang.so_dien_thoai_nguoi_dat_hang ||
                  "Chưa cập nhật"}
              </div>
              <div>
                <strong>Địa chỉ:</strong>{" "}
                {record.don_hang.dia_chi_nguoi_dat_hang || "Chưa cập nhật"}
              </div>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Số tiền hoàn">
            {formatCurrency(record.so_tien_hoan)}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            <Tag color={getStatusColor(record.trang_thai)}>
              {formatStatus(record.trang_thai)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Lý do hoàn tiền" span={2}>
            {record.ly_do}
          </Descriptions.Item>

          <Descriptions.Item label="Thời gian hoàn">
            {record.thoi_gian_hoan}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái đơn hàng">
            {record.don_hang.trang_thai_don_hang}
          </Descriptions.Item>

          <Descriptions.Item label="Tổng tiền đơn hàng" span={2}>
            {formatCurrency(record.don_hang.tong_tien_don_hang)}
          </Descriptions.Item>

          <Descriptions.Item label="Phương thức thanh toán" span={2}>
            {record.don_hang.phuong_thuc_thanh_toan}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái thanh toán" span={2}>
            {record.don_hang.trang_thai_thanh_toan}
          </Descriptions.Item>

          {record.giao_dich_vi && (
            <>
              <Descriptions.Item label="Mã giao dịch ví" span={2}>
                {record.giao_dich_vi.ma_giao_dich}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Trạng thái giao dịch">
                <Tag
                  color={
                    record.giao_dich_vi.trang_thai === "thanh_cong"
                      ? "green"
                      : "blue"
                  }
                >
                  {record.giao_dich_vi.trang_thai === "thanh_cong"
                    ? "Thành công"
                    : "Đang xử lý"}
                </Tag>
              </Descriptions.Item> */}
            </>
          )}
        </Descriptions>
      </Modal>
    </>
  );
};

export default RefundDetail;
