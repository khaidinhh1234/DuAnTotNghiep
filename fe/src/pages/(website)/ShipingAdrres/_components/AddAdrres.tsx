import { sanPham2 } from "@/assets/img";

const AddAddressForm = ({ register }: any) => {
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
      <table className="min-w-full  ">
        <thead>
          <tr className="text-left border-b border-gray-200">
            <th className="font-semibold text-gray-700 px-4 py-2">Sản phẩm</th>
            <th className="font-semibold text-gray-700 px-4 py-2">Giá</th>
            <th className="lg:text-center hidden lg:table-cell font-semibold text-gray-700 px-4 py-2">
              Số lượng
            </th>
            <th className="font-semibold text-gray-700 px-4 py-2">Tổng tiền</th>
            {/* <th className="font-semibold text-gray-700 px-4 py-2">Xóa</th> */}
          </tr>
        </thead>

        <tbody>
          {" "}
          <tr
            // key={product.id}
            className="border-b border-gray-200 hover:bg-gray-100"
          >
            <td className="px-4 py-2">
              <div className="flex items-center gap-4">
                <img
                  src={"product.hinh_anh"}
                  alt={"product.ten_san_pham"}
                  className="w-12 h-12 object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-700">
                    'sdifhsiudfng'
                  </h3>
                  <p className="text-gray-500">{345}, 'XV'</p>
                </div>
              </div>
            </td>
            <td className="px-4 py-2">{6345}</td>
            <td className="px-4 py-2">
              <div className="flex items-center justify-center  rounded-lg">
                {12312}
              </div>
            </td>

            <td className="px-4 py-2">{12312}</td>
          </tr>
        </tbody>
      </table>

      <h3 className="title-h3">Địa chỉ giao hàng</h3>

      <div className="my-5">
        <label htmlFor="name" className="text-md px-1">
          Tên
        </label>
        <br />
        <input
          type="text"
          placeholder="Nhập tên"
          className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
        />
      </div>
      <div className="my-5">
        <label htmlFor="mobileNumber" className="text-md px-1">
          Số điện thoại
        </label>
        <br />
        <input
          type="number"
          {...register("mobileNumber")}
          placeholder="Nhập số điện thoại"
          className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
        />
      </div>
      <div className="my-5">
        <label htmlFor="addressLine1" className="text-md px-3">
          Địa chỉ giao hàng
        </label>
        <br />
        <input
          type="text"
          className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
        />
      </div>
      <div className="my-5">
        <label htmlFor="addressLine2" className="text-md px-3">
          Ghi chú
        </label>
        <br />
        <input
          type="text"
          className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
        />
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
      <h3 className="title-h3">Phương thức thanh toán</h3>
      <p className="text-gray-500">
        Lựa chọn phương thức thanh toán phù hợp nhất cho bạn
      </p>

      <div className="border-t border-hrBlack pt-7 mb-5 flex items-center custom-radio">
        <input
          type="radio"
          id="googlePay"
          name="paymentMethod"
          className="bg-blackL"
        />
        <label htmlFor="googlePay" className="title-h3 px-3">
          Thanh toán bằng thẻ MoMo
        </label>
      </div>
      <div className="border-t border-hrBlack pt-4 mb-5 flex items-center custom-radio">
        <input
          type="radio"
          id="paypal"
          name="paymentMethod"
          className="bg-blackL"
        />
        <label htmlFor="paypal" className="title-h3 px-3">
          MoMo Quét mã QR
        </label>
      </div>
      <div className="border-t border-hrBlack pt-4 mb-7 flex items-center custom-radio">
        <input
          type="radio"
          id="cashOnDelivery"
          name="paymentMethod"
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
