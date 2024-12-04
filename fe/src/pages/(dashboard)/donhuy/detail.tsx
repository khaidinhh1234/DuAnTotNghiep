import React, { useState } from "react";
import { Modal, Button, Tag, Descriptions } from "antd";
import FormatDate from "@/components/hook/formatdata";

interface RefundDetailProps {
  record: any;
}

const DonhuyDetail: React.FC<RefundDetailProps> = ({ record }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Chờ xác nhận hủy hàng":
        return "blue";
      case "Hủy hàng":
        return "green";
      case "tu_choi":
        return "red";
      default:
        return "red";
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
      <Button onClick={() => setIsModalOpen(true)}>Xem chi tiết </Button>
      <Modal
        title="Chi tiết yêu cầu hủy hàng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Mã đơn hàng" span={2}>
            {record.ma_don_hang}
          </Descriptions.Item>
          <Descriptions.Item label="Thông tin người đặt" span={2}>
            <div className="space-y-2">
              <div>
                <strong>Tên người đặt:</strong>{" "}
                {record.ten_nguoi_dat_hang || "Chưa cập nhật"}
              </div>
              <div>
                <strong>Số điện thoại:</strong>{" "}
                {record.so_dien_thoai_nguoi_dat_hang || "Chưa cập nhật"}
              </div>
              <div>
                <strong>Địa chỉ:</strong>{" "}
                {record.dia_chi_nguoi_dat_hang || "Chưa cập nhật"}
              </div>
            </div>
          </Descriptions.Item>

          <Descriptions.Item label="Số tiền hoàn trả">
            {
              record.trang_thai_thanh_toan === "Đã thanh toán"
                ? formatCurrency(record.tong_tien_don_hang)
                : "0 đ" // Hiển thị "0 đ" nếu chưa thanh toán
            }
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            <Tag color={getStatusColor(record.trang_thai_don_hang)}>
              {record.trang_thai_don_hang === "Chờ xác nhận hủy hàng"
                ? "Chờ xác nhận"
                : record.trang_thai_don_hang === "Hủy hàng"
                  ? "Đã xác nhận"
                  : "Từ chối"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Lý do hoàn tiền" span={2}>
            {record.li_do_huy_hang}
          </Descriptions.Item>

          <Descriptions.Item label="Thời gian hoàn">
            {FormatDate(record.created_at)}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái đơn hàng">
            {record.trang_thai_don_hang}
          </Descriptions.Item>

          <Descriptions.Item label="Tổng tiền đơn hàng" span={2}>
            {formatCurrency(record.tong_tien_don_hang)}
          </Descriptions.Item>

          <Descriptions.Item label="Phương thức thanh toán" span={2}>
            {record.phuong_thuc_thanh_toan}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái thanh toán" span={2}>
            {record.trang_thai_thanh_toan}
          </Descriptions.Item>

          {record.giao_dich_vi && (
            <>
              <Descriptions.Item label="Mã giao dịch ví" span={2}>
                {record.giao_dich_vi.ma_giao_dich}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái giao dịch">
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
              </Descriptions.Item>
            </>
          )}
        </Descriptions>
      </Modal>
    </>
  );
};

export default DonhuyDetail;
