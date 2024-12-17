import { Modal, Button, Table, Spin } from "antd";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/admin";

const OrderDetail = ({ record }: any) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lengthslengths, setLengths] = useState(2);
  // Fetch chi tiết đơn hàng
  const { data, isLoading } = useQuery({
    queryKey: ["ORDER_DETAILS", record],
    queryFn: async () => {
      const response = await instance.get(`donhangchitiet/${record}`);
      return response.data;
    },
    enabled: isModalVisible, // Chỉ gọi API khi modal mở
  });
  console.log(data);
  // Mở Modal
  const showModal = () => setIsModalVisible(true);
  // Đóng Modal
  const handleCancel = () => setIsModalVisible(false);

  return (
    <>
      <Button
        type="link"
        onClick={showModal}
        className="text-blue-500 hover:text-blue-700"
      >
        {record}
      </Button>
      <Modal
        title={
          <h2 className="text-2xl font-semibold text-gray-900">
            Chi tiết đơn hàng
          </h2>
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        className="p-4"
      >
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Thông tin đơn hàng */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-700">
                Thông tin đơn hàng
              </h3>
              <p className="text-gray-600">
                <span className="font-medium">Mã đơn hàng:</span>{" "}
                <span className="text-blue-700">
                  {" "}
                  {record ?? data?.don_hang?.ma_don_hang}
                </span>
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Khách hàng:</span>{" "}
                <span className="">
                  {data?.data?.thong_tin?.ten_nguoi_dat_hang ??
                    "Không hiển thị dữ liệu"}
                </span>
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Tổng tiền:</span>{" "}
                <span className="">
                  {data?.data?.tong_thanh_tien_san_pham?.toLocaleString() ?? 0}{" "}
                  VNĐ
                </span>
              </p>
            </div>

            {/* Chi tiết sản phẩm */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Chi tiết sản phẩm
              </h3>
              <Table
                dataSource={
                  data?.data?.chi_tiet_cua_don_hang?.slice(0, lengthslengths) ||
                  []
                }
                columns={[
                  {
                    title: "Sản phẩm",
                    dataIndex: "san_pham",
                    key: "san_pham",
                    render: (_, record: any) => (
                      <div className="flex items-center space-x-4 ">
                        <img
                          src={record.anh_bien_the[0]}
                          alt={record.ten_san_pham}
                          className="w-20 h-24 object-cover rounded-md shadow-sm"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {record.ten_san_pham}
                          </p>
                          <p className="text-sm text-gray-500">
                            Màu: {record.mau_bien_the || "Không có biến thể"} |
                            Size:{" "}
                            {record.kich_thuoc_bien_the || "Không có biến thể"}
                          </p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Số lượng",
                    dataIndex: "so_luong",
                    key: "so_luong",
                    render: (text) => (
                      <span className="text-gray-700 font-medium">{text}</span>
                    ),
                  },
                  {
                    title: "Giá",
                    dataIndex: "gia",
                    key: "gia",
                    render: (text) => (
                      <span className="text-blue-600 font-medium">
                        {text?.toLocaleString()} VNĐ
                      </span>
                    ),
                  },
                ]}
                pagination={false}
                rowKey="id"
                className="rounded-lg shadow"
                scroll={{ y: "auto" }}
              />
              {
                // Nếu có nhiều hơn 10 sản phẩm, hiển thị nút xem thêm
                data?.data?.chi_tiet_cua_don_hang?.length > lengthslengths && (
                  <div
                    className="text-center mt-4 cursor-pointer"
                    onClick={() => setLengths(lengthslengths + 1)}
                  >
                    Xem thêm
                  </div>
                )
              }
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default OrderDetail;
