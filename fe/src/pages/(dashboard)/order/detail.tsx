import instance from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";
import { Button, Modal } from "antd";
import { useState } from "react";

const Detail = ({ record }: any) => {
  const [open, setOpen] = useState(false);
  console.log(record);
  const { data, isLoading } = useQuery({
    queryKey: ["ORDER_DETAIL", record.id],
    queryFn: async () => {
      const response = await instance.get(`/admin/donhang/${record.id}`);
      return response.data;
    },
  });
  if (isLoading) {
    return <div>Loading...</div>;
  }
  const orderId = data.data;
  console.log(orderId);
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div>
      {" "}
      <Button onClick={() => setOpen(true)}>Xem chi tiết </Button>
      <Modal
        centered
        open={open}
        width={1200}
        className=" "
        okText="Đồng ý"
        footer={null}
        onCancel={handleCancel}
      >
        <h1 className="text-3xl font-bold">Chi tiết đơn hàng </h1>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            {" "}
            <div className="py-1 px-5 border bg-slate-100 rounded-md flex justify-between items-center">
              <div className="">
                <h4 className="text-lg font-bold">
                  Đơn Hàng: <span className="text-blue-500">{record.id}</span>
                </h4>
                <p className="text-base">Ngày tạo :{record.created_at}</p>
              </div>{" "}
              <div
                className={`${record.trang_thai_don_hang === "Chờ xác nhận" ? "bg-yellow-500" : "bg-green-500"}  text-white px-2 py-1 font-bold rounded-lg`}
              >
                {record.trang_thai_don_hang}
              </div>
            </div>
            <div className="bg-slate-100 border px-5  my-5">
              <h1 className="text-lg font-bold mt-5 ">Tất Cả Sản Phẩm</h1>{" "}
              <hr />
              <div className="my-5">
                <table>
                  <thead>
                    <tr className="*:px-12 *:text-base">
                      <th className=" w-[30%]"></th>

                      <th className="w-[15%]">Số Lượng</th>
                      <th className="w-[20%]">Giá</th>
                      <th className="w-[35%]">Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="flex gap-5 items-center  w-[50%]">
                          <img
                            src={
                              "data:image/jpeg;base64,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"
                            }
                            alt=""
                            className="w-20 h-20 object-cover"
                          />
                          <div>
                            <h1 className=" font-bold truncate w-40">
                              Phần Chi tiết các thông tin sản phẩm
                            </h1>
                            <div className="flex gap-2">
                              <p className="text-base">
                                Màu : <span> Vàng</span>
                              </p>
                              <p className="text-base">
                                Size : <span>XL</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center w-30 font-semibold  w-[20%]">
                        {" "}
                        1
                      </td>
                      <td className="text-center w-[20%] font-semibold  ">
                        100.000.000 VND
                      </td>
                      <td className="text-center w-[35%] font-semibold">
                        100.000.000 VND
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="grid grid-cols-2 gap-5 my-5">
                  <div>
                    <div className="flex justify-between">
                      <p>Kho lấy hàng</p> <span> Hà Nội</span>
                    </div>
                    <div className="flex justify-between">
                      <p>Mã Vận chuyển</p> <span> 100023874</span>
                    </div>
                    <div className="flex justify-between">
                      <p>Nhà Vận chuyển</p> <span> Hà Nội</span>
                    </div>
                  </div>{" "}
                  <div>
                    <div className="flex justify-between">
                      <p>Trạng thái vận chuyển</p>{" "}
                      <span
                        className={`   ${
                          record.trang_thai_don_hang == "Chờ xác nhận"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        } text-white px-2 font-bold rounded-lg h-6`}
                      >
                        {" "}
                        {record.trang_thai_don_hang == "Chờ xác nhận"
                          ? "Chờ xác nhận"
                          : "Đang giao hàng"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <p>Tổng khối lượng</p> <span> 0.00kg</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5">
              <h1 className="text-xl font-bold mt-5">Đã nhận hàng</h1>
              <div className="grid grid-cols-1 gap-5 w-full">
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">
                    Số lượng sản phẩm :{" "}
                  </h1>
                  <p className="text-base font-semibold">
                    <span>76</span> sản phẩm
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">Tổng tiền hàng</h1>
                  <p className="text-base font-semibold">
                    <span>10093456</span> VNĐ
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">Giảm giá</h1>
                  <p className="text-base font-semibold">
                    <span>34</span> %
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">Vận chuyển</h1>
                  <p className="text-base font-semibold">
                    <span>20.000</span> VNĐ
                  </p>
                </div>
                <div className="flex justify-between">
                  <h1 className="text-lg font-semibold">
                    Tổng giá trị đơn hàng <br />
                    <p className="text-gray-600 font-normal">tiền mặt</p>
                  </h1>
                  <p className="text-lg font-bold">1000000 VNĐ</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-3  ">
            <div className=" bg-slate-100 p-5 border rounded-lg">
              <h5 className="text-blue-800 text-lg">Xác nhận đơn hàng </h5>
              <hr />
              <p> Vui lòng xác nhận đơn hàng đã nhận hàng</p>
              <button className="px-14 py-2 border bg-blue-950 rounded-lg text-white hover:bg-blue-700">
                Xác nhận đơn hàng
              </button>
            </div>{" "}
            <div className=" bg-slate-100 p-5 border rounded-lg my-2">
              <h5 className="text-blue-800 text-lg">Thông tin khách hàng</h5>
              <hr />
              <h5 className="text-blue-600 my-2">
                {record.ten_nguoi_dat_hang}
              </h5>
              <hr />
              <h5 className="text-blue-800 text-lg my-2">Người liên hệ</h5>
              <h5 className="text-black my-2">{record.ten_nguoi_dat_hang}</h5>
              <p>
                Số điện thoại :{" "}
                <span>{record.so_dien_thoai_nguoi_dat_hang}</span>
              </p>
              <h5 className="text-blue-800">
                Địa chỉ Giao hàng: <span>{record?.dia_chi_nguoi_dat_hang}</span>
              </h5>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Detail;
