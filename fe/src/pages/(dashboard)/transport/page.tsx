import instance from "@/configs/admin";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const PageTransport = () => {
  const { data: chodon } = useQuery({
    queryKey: ["tongquan"],
    queryFn: async () => {
      const res = await instance.get("lay-thong-tin-don");
      return res.data;
    },
  });
  const { data: cholay } = useQuery({
    queryKey: ["tongquan2"],
    queryFn: async () => {
      const res = await instance.get("lay-thong-tin-van-chuyen");
      return res.data;
    },
  });
  const choxacnhan = chodon?.choXacNhan;
  const choThanhToan = chodon?.choThanhToan;
  const chuaGiaoHang = chodon?.chuaGiaoHang;
  const donHoanHang = chodon?.donHoanHang;

  const choLayHang = cholay?.choLayHang;
  const donDangGiao = cholay?.donDangGiao;

  const giaoThatBai = cholay?.giaoThatBai;
  const giaoThanhCong = cholay?.giaoThanhCong;

  return (
    <main className="">
      <div className="flex items-center mt-5 mx-5">
        <h1 className="md:text-base">
          Quản trị / Đơn hàng /<span className="font-semibold">Tổng quan</span>
        </h1>
      </div>
      <div className="flex items-center justify-between mx-5">
        {/* <h1 className="font-semibold md:text-2xl">Tổng quan</h1> */}
      </div>
      <div>
        <div className="px-5 ">
          {/* Header với dropdown chọn ngày và checkbox cập nhật liên tục */}
          {/* <Row justify="space-between" align="middle">
        <Col>
          <Select
            defaultValue="Hôm nay"
            style={{ width: 150 }}
            onChange={handleDateChange}
            suffixIcon={<CaretDownOutlined />}
          >
            <Option value="homnay">Hôm nay</Option>
            <Option value="homqua">Hôm qua</Option>
            <Option value="tuantruoc">Tuần trước</Option>
          </Select>
        </Col>
      </Row> */}

          <div>
            <div style={{ marginTop: 10 }}>
              {/* Đơn hàng */}
              <div className="bg-white  px-7 py-7 rounded-lg my-5">
                <div className="flex items-center ">
                  <h1 className=" font-semibold md:text-2xl">
                    <i className="fa-regular fa-cart-shopping text-[#63E6BE] mr-3"></i>
                    Đơn hàng{" "}
                  </h1>
                </div>
                <div className="grid grid-cols-3 gap-10">
                  {" "}
                  <Link to="/admin/orders/list">
                    <div className="col-span-1 border p-3 text-center rounded-lg">
                      <h3 className="text-lg font-semibold text-slate-700">
                        Đơn chưa xác nhận
                      </h3>
                      <span className="text-2xl font-semibold py-1 text-blue-600">
                        {(
                          choxacnhan?.tong_don_cho_xac_nhan ?? 0
                        ).toLocaleString("vi-VN")}
                      </span>
                      <br />
                      <span className="text-xl text-slate-600">
                        {" "}
                        {choxacnhan?.tong_tien.toLocaleString("vi-VN") ?? 0}đ
                      </span>
                    </div>{" "}
                  </Link>{" "}
                  <Link to="/admin/orders/list">
                    <div className="col-span-1 border p-3 text-center rounded-lg">
                      <h3 className="text-lg font-semibold text-slate-700">
                        Chờ thanh toán
                      </h3>
                      <span className="text-2xl font-semibold py-1 text-blue-600">
                        {(
                          choThanhToan?.tong_don_cho_thanh_toan ?? 0
                        ).toLocaleString("vi-VN")}
                      </span>
                      <br />
                      <span className="text-xl text-slate-600">
                        {(choThanhToan?.tong_tien ?? 0).toLocaleString("vi-VN")}
                        đ
                      </span>
                    </div>
                  </Link>{" "}
                  <Link to="/admin/orders/list">
                    <div className="col-span-1 border p-3 text-center rounded-lg">
                      <h3 className="text-lg font-semibold text-slate-700">
                        Chưa giao hàng
                      </h3>
                      <span className="text-2xl font-semibold py-1 text-blue-600">
                        {(
                          chuaGiaoHang?.tong_don_chua_giao_hang ?? 0
                        ).toLocaleString("vi-VN")}
                      </span>
                      <br />
                      <span className="text-xl text-slate-600">
                        {(chuaGiaoHang?.tong_tien ?? 0).toLocaleString("vi-VN")}
                        đ
                      </span>
                    </div>
                  </Link>{" "}
                </div>
              </div>

              {/* Giao hàng */}
              <div className="bg-white  px-7 py-7 rounded-lg my-5">
                <div className="flex items-center ">
                  <h1 className=" font-semibold md:text-2xl">
                    <i
                      className="fa-regular fa-truck mr-3"
                      style={{ color: "#ffae00" }}
                    ></i>
                    Giao hàng
                  </h1>
                </div>
                <div className="grid grid-cols-2 justify-center gap-3 ">
                  <Link to="/admin/orders/uncomfirmedorder">
                    <div className="col-span-1 border p-3 text-center rounded-lg mx-30">
                      <h3 className="text-lg font-semibold text-slate-700">
                        Chờ lấy hàng
                      </h3>
                      <span className="text-2xl font-semibold py-1 text-blue-600">
                        {(
                          choLayHang?.tong_don_cho_lay_hang ?? 0
                        ).toLocaleString("vi-VN")}
                      </span>
                      <br />
                      <span className="text-xl text-slate-600">
                        {(choLayHang?.tong_tien ?? 0).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </Link>
                  <Link to="/admin/orders/uncomfirmedorder">
                    <div className="col-span-1 border p-3 text-center rounded-lg mx-30">
                      <h3 className="text-lg font-semibold text-slate-700">
                        Đang giao hàng
                      </h3>
                      <span className="text-2xl font-semibold py-1 text-blue-600">
                        {(
                          donDangGiao?.tong_don_dang_giao_hang ?? 0
                        ).toLocaleString("vi-VN")}
                      </span>
                      <br />
                      <span className="text-xl text-slate-600">
                        {(donDangGiao?.tong_tien ?? 0).toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Hoàn hàng */}
              <div className="bg-white  px-7 py-7 rounded-lg my-5 ">
                <div className="flex items-center ">
                  <h1 className=" font-semibold md:text-2xl">
                    <i className="fas fa-globe text-cyan-600 mr-3"></i>
                    Tổng hợp
                  </h1>
                </div>
                <div className="grid grid-cols-3 gap-10">
                  <div className="col-span-1 border p-3 text-center rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-700">
                      Giao thất bại
                    </h3>
                    <span className="text-2xl font-semibold py-1 text-blue-600">
                      {(
                        giaoThatBai?.tong_don_giao_hang_that_bai ?? 0
                      ).toLocaleString("vi-VN")}
                    </span>
                    <br />
                    <span className="text-xl text-slate-600">
                      {(giaoThatBai?.tong_tien ?? 0).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <div className="col-span-1 border p-3 text-center rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-700">
                      Giao thành công
                    </h3>
                    <span className="text-2xl font-semibold py-1 text-blue-600">
                      {(
                        giaoThanhCong?.tong_don_giao_hang_thanh_cong ?? 0
                      ).toLocaleString("vi-VN")}
                    </span>
                    <br />
                    <span className="text-xl text-slate-600">
                      {(giaoThanhCong?.tong_tien ?? 0).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <div className="col-span-1 border p-3 text-center rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-700">
                      Hoàn hàng
                    </h3>
                    <span className="text-2xl font-semibold py-1 text-blue-600">
                      {(donHoanHang?.tong_don_hoan_hang ?? 0).toLocaleString(
                        "vi-VN"
                      )}
                    </span>
                    <br />
                    <span className="text-xl text-slate-600">
                      {(donHoanHang?.tong_tien ?? 0).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PageTransport;
