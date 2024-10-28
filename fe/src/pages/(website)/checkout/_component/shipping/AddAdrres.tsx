import { useEffect } from "react";

const AddAddressForm = ({
  register,
  handleSubmit,
  watch,
  onAddAddress,
}: any) => {
  const name = watch("name");
  const mobileNumber = watch("mobileNumber");
  const addressLine1 = watch("addressLine1");
  const note = watch("note");
  useEffect(() => {
    // Kiểm tra nếu cả 4 trường có dữ liệu
    if (name && mobileNumber && addressLine1 && note) {
      const formData = { name, mobileNumber, addressLine1, note };
      onAddAddress(formData);
      // Gửi dữ liệu đến API hoặc xử lý dữ liệu

      // Thực hiện gửi dữ liệu formData ở đây
      // Ví dụ: gửi dữ liệu qua hàm submitData(formData);
    }
  }, [name, mobileNumber, addressLine1, note]);
  return (
    <div className="">
      <h3 className="title-h3">Thêm địa chỉ mới</h3>
      <form className="my-7" onSubmit={(e) => e.preventDefault()}>
        <div className="my-5">
          <label htmlFor="name" className="text-md px-1">
            Họ và Tên
          </label>
          <br />
          <input
            type="text"
            {...register("name")}
            placeholder="Nhập họ và tên"
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
            Địa chỉ nhận hàng
          </label>
          <br />
          <input
            type="text"
            {...register("addressLine1")}
            placeholder="Nhập địa chỉ nhận hàng"
            className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
          />
        </div>
        {/* <div className="my-5">
          <label htmlFor="addressLine2" className="text-md px-3">
            Khu vực, Xóm, Đường, Khu vực, Làng
          </label>
          <br />
          <input
            type="text"
            className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
          />
        </div> */}
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
        </div> */}
        <div className="my-5">
          <label htmlFor="pinCode" className="text-md px-3">
            Ghi chú
          </label>
          <br />
          <textarea
            rows={4}
            cols={50}
            {...register("note")}
            placeholder="Ghi chú"
            className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
          ></textarea>
        </div>
        {/* <div className="my-5">
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
        </div> */}
        {/* <div className="my-5 flex items-center px-2">
          <input type="checkbox" id="useDefault" className="dashed-line" />
          <label htmlFor="useDefault" className="text-md px-3">
            Sử dụng làm địa chỉ mặc định
          </label>
        </div> */}
        {/* <a
          href="paymentmethod.html"
          className="text-center hidden lg:block btn-black px-10 w-[320px] py-4 rounded-lg text-md font-medium"
        >
          Thêm địa chỉ mới
        </a> */}
      </form>
    </div>
  );
};

export default AddAddressForm;
