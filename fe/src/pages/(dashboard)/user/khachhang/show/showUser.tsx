import instance from "@/configs/admin";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "antd";
import { Link, useParams } from "react-router-dom";
import Detail from "../detail";

const ShowNhanvien = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["USERID", id],
    queryFn: async () => {
      try {
        const res = await instance.get(`/taikhoan/${id}`);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
  });
  const user = data?.data?.tai_khoan;
  console.log(user);
  const trangthai = data?.data;
  // console.log(trangthai);

  const phantram =
    ((trangthai?.tong_tien_don_hang -
      user?.hang_thanh_vien?.chi_tieu_toi_thieu) /
      (user?.hang_thanh_vien?.chi_tieu_toi_da -
        user?.hang_thanh_vien?.chi_tieu_toi_thieu)) *
    100;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className=" md:text-base">
          Quản trị / Tài khoản /{" "}
          <span className="font-semibold px-px=">Khách hàng</span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className=" font-semibold md:text-3xl">Khách hàng </h1>
        <div className="flex"> </div>
      </div>

      <div className="  bg-white p-5 rounded-lg">
        <div className="flex justify-between max-w-[1350px] py-5 px-5 border-b ">
          <div className="text-2xl font-bold">
            <i className="fa-regular fa-cart-shopping text-gray-500 "></i>{" "}
            <span className="px-2">{trangthai?.so_luong_don_hang}</span>
            <br />
            <span className="text-gray-500 text-lg"> Đơn hàng</span>
          </div>
          <div className="text-2xl font-bold">
            <i className="fa-regular fa-star text-gray-500 "></i>
            <span className="px-2">{trangthai?.so_luong_don_hang} </span>
            <br />
            <span className="text-gray-500 text-lg">Đánh giá</span>
          </div>
          <div className="text-2xl font-bold">
            <i className="fa-regular fa-heart text-gray-500"></i>
            <span className="px-2">{trangthai?.so_luong_yeu_thich}</span>
            <br />
            <span className="text-gray-500 text-lg"> Yêu thích </span>
          </div>
          <div className="text-2xl font-bold text-gray-500">
            <i className="fa-solid fa-rotate-reverse"></i>
            <span className="px-2">0 </span>
            <br />
            <span className="text-gray-500 text-lg"> Trả hàng</span>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-1 mt-5">
          <div className="bg-white text-center pt-10 col-span-2 mx-auto">
            <div className="w-40 h-40 mx-auto">
              <img
                src={user?.anh_nguoi_dung}
                alt="Avatar"
                className="w-36 h-36 rounded-full border-2 border-gray-300 object-cover mx-auto"
              />
            </div>

            <div className="flex-grow my-5">
              <h2 className="text-3xl font-semibold text-gray-700">
                {user?.ho} {user?.ten}
              </h2>

              <p className="text-black font-bold">
                Email:{" "}
                <span className="text-gray-500 font-semibold">
                  {user?.email}
                </span>
              </p>
              <p className="text-black font-bold">
                Địa chỉ giao hàng:{" "}
                <span className="text-gray-500 font-semibold">
                  {user?.dia_chi ?? "Chưa cập nhật"}
                </span>
              </p>

              <Link to={`/admin/users/khachhang/edit/${user?.id}`}>
                <button className=" mx-auto flex gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition duration-200">
                  <div>
                    <i
                      className="fa-solid fa-pen-to-square"
                      style={{ color: "#ffffff" }}
                    />
                  </div>
                  Cập nhật
                </button>
              </Link>
            </div>
          </div>
          <div className="col-span-4">
            <div className="grid grid-cols-4  gap-4 shadow-teal-600 shadow-inner rounded-lg p-4 mb-4">
              <div className="col-span-2  px-10 py-4 ">
                <h3 className="font-semibold text-gray-800 text-2xl mb-10">
                  Thông tin cá nhân
                </h3>
                <p className="my-10">
                  <strong>Số điện thoại:</strong>{" "}
                  <span>{user?.so_dien_thoai}</span>
                </p>
                <p className="my-10">
                  <strong>Ngày sinh: </strong>
                  {new Date(user?.ngay_sinh).toLocaleDateString("vi-VN")}
                </p>
                <p className="my-10">
                  <strong>Giới tính:</strong>{" "}
                  <span>
                    {user?.gioi_tinh === "1"
                      ? "Nam"
                      : user?.gioi_tinh == "2"
                        ? "Nữ"
                        : "Khác"}
                  </span>
                </p>
                <p className="my-10">
                  <strong>Vai trò:</strong>{" "}
                  {user?.vai_tros?.map((role: any) => (
                    <span className="px-3 py-1 bg-blue-500 font-bold text-white rounded-md mx-1">
                      {role?.ten_vai_tro}
                    </span>
                  ))}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  <span>{user?.deleted_at ? "Chặn" : "Hoạt động"}</span>
                </p>
              </div>
              <div className="col-span-2 text-center mx-auto">
                <h3 className=" text-gray-400 text-lg">Hạng thành viên</h3>
                <h2 className="text-center text-2xl font-bold">
                  {user?.hang_thanh_vien?.ten_hang_thanh_vien}
                </h2>
                <div className="w-60 mx-auto">
                  <img
                    src={
                      user?.hang_thanh_vien?.anh_hang_thanh_vien
                        ? user?.hang_thanh_vien?.anh_hang_thanh_vien
                        : "https://via.placeholder.com/150"
                    }
                    alt={user?.hang_thanh_vien?.anh_hang_thanh_vien}
                    className="w-full  "
                  />
                </div>
                <p className="flex justify-center items-center gap-3 ">
                  <p className="pt-4">
                    {(user?.hang_thanh_vien?.chi_tieu_toi_thieu
                      ? user?.hang_thanh_vien?.chi_tieu_toi_thieu?.toLocaleString()
                      : 0
                    ).toLocaleString("vi-VN")}{" "}
                  </p>
                  <div className="w-40">
                    <Progress
                      percent={phantram}
                      strokeColor={{
                        "0%": "#6dd5ed",
                        "100%": "#00bfff", // Màu chuyển tiếp
                      }}
                      trailColor="#333"
                      strokeWidth={10}
                      showInfo={false} // Hiện thị tỷ lệ
                      style={{ borderRadius: "25px" }} // Đường viền tròn
                    />
                  </div>{" "}
                  <p className="pt-4">
                    {user?.hang_thanh_vien?.chi_tieu_toi_da
                      ? user?.hang_thanh_vien?.chi_tieu_toi_da?.toLocaleString()
                      : 0}{" "}
                  </p>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="shadow-inner bg-gray-100 p-10 mt-10 rounded-lg mx-10">
          <h3 className="text-2xl font-bold">Danh sách đơn hàng</h3>
          <table className="min-w-full w-full ">
            <tbody>
              {user?.don_hangs.length > 0 ? (
                user?.don_hangs?.map((don_hang: any) => (
                  <tr className="border-b border-gray-200 hover:bg-gray-100 h-20">
                    <td className="py-5">
                      <strong className="text-gray-500">Mã đơn hàng:</strong>
                      <p className="text-gray-600 font-bold my-2">
                        {don_hang?.ma_don_hang}
                      </p>
                    </td>
                    <td className="p-5">
                      <strong className="text-gray-500">Ngày đặt hàng:</strong>
                      <p className="text-gray-600 font-bold my-2">
                        {new Date(don_hang?.created_at).toLocaleDateString(
                          "vi-VN",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </td>

                    <td className="p-5">
                      <strong className="text-gray-500">Đơn giá:</strong>
                      <p className="text-gray-600 font-bold my-2">
                        {don_hang?.tong_tien_don_hang.toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </p>
                    </td>
                    <td className="p-5">
                      <strong className="text-gray-500">Trạng thái:</strong>
                      <p
                        className={`font-bold my-2 ${
                          don_hang?.trang_thai_don_hang === "Chờ xác nhận"
                            ? "text-yellow-500"
                            : don_hang?.trang_thai_don_hang === "Đã xác nhận"
                              ? "text-blue-500"
                              : don_hang?.trang_thai_don_hang === "Đang xử lý"
                                ? "text-orange-500"
                                : don_hang?.trang_thai_don_hang ===
                                    "Đang giao hàng"
                                  ? "text-purple-500"
                                  : don_hang?.trang_thai_don_hang ===
                                      "Đã giao hàng thành công"
                                    ? "text-green-500"
                                    : don_hang?.trang_thai_don_hang ===
                                        "Hủy hàng"
                                      ? "text-red-500"
                                      : ""
                        }`}
                      >
                        {don_hang?.trang_thai_don_hang}
                      </p>
                    </td>
                    <td className="p-5">
                      {/* <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 border transition duration-200">
                        Xem chi tiết
                      </button> */}
                      <Detail record={don_hang} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-gray-200 hover:bg-gray-100 h-20">
                  <td className="py-5">
                    <strong className="text-gray-500">Mã đơn hàng:</strong>
                    <p className="text-gray-600 font-bold my-2">
                      Không có dữ liệu
                    </p>
                  </td>
                  <td className="p-5">
                    <strong className="text-gray-500">Ngày đặt hàng:</strong>
                    <p className="text-gray-600 font-bold my-2">
                      Không có dữ liệu
                    </p>
                  </td>

                  <td className="p-5">
                    <strong className="text-gray-500">Đơn giá:</strong>
                    <p className="text-gray-600 font-bold my-2">
                      Không có dữ liệu
                    </p>
                  </td>
                  <td className="p-5">
                    <strong className="text-gray-500">Trạng thái:</strong>
                    <p
                      className={`font-bold my-2  text-red-500
                                      
                        `}
                    >
                      Không có dữ liệu
                    </p>
                  </td>
                  <td className="p-5">
                    {/* <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 border transition duration-200">
                        Xem chi tiết
                      </button> */}
                    {/* <Detail record={don_hang} /> */}
                    {/* Không có dữ liệu */}
                  </td>
                </tr>
              )}

              {/* Các hàng khác */}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default ShowNhanvien;
