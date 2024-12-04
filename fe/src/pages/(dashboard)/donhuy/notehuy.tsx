import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import instance from "@/configs/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Notehuy = ({ id }: { id: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [note, setNote] = useState(
    "Xin lỗi, đơn hàng này không thể hủy. Bạn vui lòng tiếp tục theo dõi đơn hàng của mình."
  ); // Thêm state cho lý do hủy

  // Hiển thị modal
  const showModal = () => {
    setIsVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsVisible(false);
  };
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async ({ id, note }: { id: number; note: string }) => {
      const res = await instance.put(`donhang/xac-nhan-huy-hang/${id}`, {
        trang_thai: "tu_choi",
        ly_do_tu_choi: note,
      });
      message.success("Đã từ chối  hủy đơn hàng thành công");
      return res.data;
    },
    onSuccess: () => {
      setIsVisible(false);
      queryClient.invalidateQueries({
        queryKey: ["donhuy"],
      });
    },
  });

  // Xử lý xác nhận hủy đơn hàng

  // Xử lý xác nhận hủy đơn hàng
  const handleConfirm = () => {
    // console.log("Lý do hủy: ", note);
    mutate({ id, note });
    setIsVisible(false); // Đóng modal sau khi xác nhận
  };

  return (
    <div>
      <Button
        onClick={showModal}
        className="bg-gradient-to-l from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-bold border border-red-300"
      >
        Từ chối
      </Button>
      <Modal
        title="Xác nhận hủy đơn hàng"
        visible={isVisible}
        onCancel={handleCancel}
        footer={null} // Bỏ footer nếu không cần
        width={500} // Đổi chiều rộng modal
        bodyStyle={{
          padding: "0px", // Tùy chỉnh padding của nội dung
        }}
        headerStyle={{
          backgroundColor: "#1890ff", // Đổi màu nền của header
          color: "white", // Đổi màu chữ của header
          fontSize: "16px", // Đổi font-size của nội dung
        }}
        centered // Căn giữa modal
      >
        <div>
          <p className="mb-4">Bạn có chắc chắn muốn hủy đơn hàng này không?</p>

          {/* Phần textarea cho lý do hủy */}
          <textarea
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Nhập lý do hủy đơn hàng (nếu có)"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)} // Lưu giá trị nhập vào state note
          ></textarea>

          {/* Nút điều hướng */}
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={handleCancel} // Đóng modal khi nhấn "Hủy"
            >
              Hủy
            </Button>
            <Button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700"
              onClick={handleConfirm} // Xử lý logic hủy đơn
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Notehuy;
