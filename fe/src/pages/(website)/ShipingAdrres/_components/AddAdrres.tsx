const AddAddressForm = ({ register, products, errors }: any) => {
  // console.log("products", products);
  return (
    <div className="">
      <h3 className="title-h3">Sản phẩm đã đặt</h3>
      {/* <div className="px-2 mb-8">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="flex gap-5 px-2 items-center border-b border-hrBlack py-5"
          >
            <img src={sanPham2} alt="Sản phẩm" className="w-12 h-12" />
            <div className="px-1">
              <h3 className="font-bold my-1">Đầm in Moana Hồng</h3>
              <p>$80.00</p>
              <p>
                Size: <span>S</span>
              </p>
            </div>
          </div>
        ))}
      </div> */}
      <table className="min-w-full overflow-x-auto bg-white shadow-md rounded-lg">
        <thead>
          <tr className="text-left border-b border-gray-200">
            <th className="font-semibold text-gray-700 px-4 py-2">Sản phẩm</th>
            <th className="font-semibold text-gray-700 px-4 py-2">Giá</th>
            <th className="lg:text-center hidden lg:table-cell font-semibold text-gray-700 px-4 py-2">
              Số lượng
            </th>
            <th className="font-semibold text-gray-700 px-4 py-2">Tổng tiền</th>
          </tr>
        </thead>

        <tbody>
          {products &&
            products?.map(
              (product: {
                id: string;
                hinh_anh: string;
                ten_san_pham: string;
                kich_thuoc: string;
                mau_sac: string;
                gia_hien_tai: number;
                so_luong: number;
              }) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-200 hover:bg-gray-100 text-sm sm:text-base"
                >
                  <td className="px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 ">
                    <img
                      src={product.hinh_anh}
                      alt={product.ten_san_pham}
                      className="w-16 h-20 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-700 text-base sm:text-lg">
                        {product.ten_san_pham}
                      </h3>
                      <p className="text-gray-600">
                        Size: <span>{product.kich_thuoc}</span>, Màu:{" "}
                        <span>{product.mau_sac}</span>
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    {product.gia_hien_tai.toLocaleString("vi-VN")}₫
                  </td>
                  <td className="px-4 py-2 hidden lg:table-cell text-center">
                    {product.so_luong.toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-2">
                    {(product.gia_hien_tai * product.so_luong).toLocaleString(
                      "vi-VN"
                    )}
                    ₫
                  </td>
                </tr>
              )
            )}
        </tbody>
      </table>

      <h3 className="title-h3 mt-5">Địa chỉ giao hàng</h3>
      <div className="my-5">
        <label htmlFor="ten_nguoi_dat_hang" className="text-md px-1">
          Tên
        </label>
        <br />
        <input
          type="text"
          {...register("ten_nguoi_dat_hang", { required: true })}
          placeholder="Nhập tên"
          className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
        />
        {errors.ten_nguoi_dat_hang && (
          <p className="text-red-600 mt-1">
            {errors.ten_nguoi_dat_hang?.message}
          </p>
        )}
      </div>
      <div className="my-5">
        <label htmlFor="so_dien_thoai_nguoi_dat_hang" className="text-md px-1">
          Số điện thoại
        </label>
        <br />
        <input
          type="text"
          {...register("so_dien_thoai_nguoi_dat_hang", { required: true })}
          placeholder="Nhập số điện thoại"
          className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
        />
        {errors.so_dien_thoai_nguoi_dat_hang && (
          <p className="text-red-600 mt-1">
            {errors.so_dien_thoai_nguoi_dat_hang?.message}
          </p>
        )}
      </div>
      <div className="my-5">
        <label htmlFor="email_nguoi_dat_hang" className="text-md px-1">
          Email{" "}
        </label>
        <br />
        <input
          type="email"
          {...register("email_nguoi_dat_hang", { required: true })}
          placeholder="Nhập Email"
          className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
        />
        {errors.email_nguoi_dat_hang && (
          <p className="text-red-600 mt-1">
            {errors.email_nguoi_dat_hang?.message}
          </p>
        )}
      </div>
      <div className="my-5">
        <label htmlFor="dia_chi_nguoi_dat_hang" className="text-md px-3">
          Địa chỉ giao hàng
        </label>
        <br />
        <input
          {...register("dia_chi_nguoi_dat_hang", { required: true })}
          placeholder="Nhập địa chỉ"
          type="text"
          className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
        />
        {errors.dia_chi_nguoi_dat_hang && (
          <p className="text-red-600 mt-1">
            {errors.dia_chi_nguoi_dat_hang?.message}
          </p>
        )}
      </div>
      <div className="my-5">
        <label htmlFor="ghichu" className="text-md px-3">
          Ghi chú
        </label>
        <br />

        <textarea
          {...register("ghi_chu")}
          placeholder="Nhập ghi chú"
          rows={5}
          className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
        ></textarea>
      </div>

      {/* <div className="my-5">
          <label htmlFor="city" className="text-md px-3">
            Thành phố
          </label>
          <br />
          <select
            id="city"
            className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
          >
            <option value="1">Hà Nội</option>
            <option value="2">Huế</option>
            <option value="3">Hồ Chí Minh</option>
          </select>
        </div>
        <div className="my-5">
          <label htmlFor="pinCode" className="text-md px-3">
            Mã vùng
          </label>
          <br />
          <input
            type="text"
            placeholder="Nhập mã vùng"
            className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
          />
        </div>
        <div className="my-5">
          <label htmlFor="state" className="text-md px-3">
            Tỉnh/Thành
          </label>
          <br />
          <select
            id="state"
            className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
          >
            <option value="1">Chọn Tỉnh/Thành</option>
            <option value="2">Huế</option>
            <option value="3">Hồ Chí Minh</option>
          </select>
        </div>
        <div className="my-5 flex items-center px-2">
          <input type="checkbox" id="useDefault" className="dashed-line" />
          <label htmlFor="useDefault" className="text-md px-3">
            Sử dụng làm địa chỉ mặc định
          </label>
        </div> */}
      {/* <h3 className="title-h3">Phương thức vận chuyển</h3>
      <p className="text-gray-500">
        Lựa chọn phương thức thanh toán phù hợp nhất cho bạn
      </p>
      <div className="border-t border-hrBlack pt-7 mb-5 flex items-center custom-radio justify-between mr-20">
        <div className="flex items-center">
          {" "}
          <input
            type="radio"
            value="giaohang"
            {...register("shippingMethod")}
            className="bg-blackL "
          />
          <label htmlFor="googlePay" className="title-h3 px-3">
            Tiêu chuẩn ( 3-5 ngày )
          </label>{" "}
        </div>
        <h1 className="title-h3">20.000 đ</h1>
      </div>{" "}
      <div className="border-t border-hrBlack pt-7 mb-5 flex items-center custom-radio justify-between mr-20">
        <div className="flex items-center">
          {" "}
          <input
            type="radio"
            value="hoatoc"
            {...register("shippingMethod")}
            className="bg-blackL "
          />
          <label htmlFor="googlePay" className="title-h3 px-3">
            Giao hàng Hoả tốc ( 1-2 ngày )
          </label>{" "}
        </div>
        <h1 className="title-h3">40.000 đ</h1>
      </div> */}
      <div className="flex ">
        {" "}
        <h3 className="title-h3">Phương thức thanh toán</h3>
        {errors.phuong_thuc_thanh_toan && (
          <h3 className="title-h3 text-lg font-medium mx-10 text-red-500">
            Vui lòng chọn phương thức thanh toán
          </h3>
        )}
      </div>
      <p className="text-gray-500">
        Lựa chọn phương thức thanh toán phù hợp nhất cho bạn
      </p>
      <div className="border-t border-hrBlack pt-7 mb-5 flex items-center custom-radio">
        <input
          type="radio"
          value="Momo_QR"
          {...register("phuong_thuc_thanh_toan", { required: true })}
          className="bg-blackL"
        />
        <label htmlFor="googlePay" className="title-h3 px-3">
          Thanh toán qua MoMo QR
        </label>
      </div>
      <div className="border-t border-hrBlack pt-4 mb-5 flex items-center custom-radio">
        <input
          type="radio"
          id="paypal"
          value="Momo_ATM"
          {...register("phuong_thuc_thanh_toan", { required: true })}
          className="bg-blackL"
        />
        <label htmlFor="paypal" className="title-h3 px-3">
          Thanh toán qua MoMo ATM
        </label>
      </div>
      <div className="border-t border-hrBlack pt-4 mb-7 flex items-center custom-radio">
        <input
          type="radio"
          id="cashOnDelivery"
          value="Thanh toán khi nhận hàng"
          {...register("phuong_thuc_thanh_toan", { required: true })}
          className="bg-blackL"
        />
        <label htmlFor="cashOnDelivery" className="title-h3 px-3">
          Thanh toán khi nhận hàng
        </label>
      </div>
    </div>
  );
};

export default AddAddressForm;
