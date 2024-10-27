const AddAddressForm = () => {
  return (
    <div className="mt-[60px]">
      <h3 className="title-h3">Thêm địa chỉ mới</h3>
      <form className="my-7">
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
            placeholder="Nhập số điện thoại"
            className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
          />
        </div>
        <div className="my-5">
          <label htmlFor="addressLine1" className="text-md px-3">
            Căn hộ, Số nhà, Tòa nhà, Công ty, Căn hộ
          </label>
          <br />
          <input
            type="text"
            className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
          />
        </div>
        <div className="my-5">
          <label htmlFor="addressLine2" className="text-md px-3">
            Khu vực, Xóm, Đường, Khu vực, Làng
          </label>
          <br />
          <input
            type="text"
            className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
          />
        </div>
        <div className="my-5">
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
        </div>
        <a
          href="paymentmethod.html"
          className="text-center hidden lg:block btn-black px-10 w-[320px] py-4 rounded-lg text-md font-medium"
        >
          Thêm địa chỉ mới
        </a>
      </form>
    </div>
  );
};

export default AddAddressForm;
