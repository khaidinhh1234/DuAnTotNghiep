const SettingPage = () => {
  return (
    <>
      <div className="lg:col-span-9  col-span-8 lg:pl-5">
        {/* Nội dung */}
        <div className="flex justify-between items-center border-b border-hrBlack pb-4 mb-5">
          <div className="">
            <h4 className="font-bold text-base mb-2">Giao diện</h4>
            <p className="text-[#A4A1AA]">
              Tùy chỉnh giao diện của bạn trên thiết bị
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input className="sr-only peer" type="checkbox" />
            <div className="w-24 h-12 rounded-full ring-0 peer duration-500 outline-none bg-gray-200 overflow-hidden before:flex before:items-center before:justify-center after:flex after:items-center after:justify-center before:content-['☀️'] before:absolute before:h-10 before:w-10 before:top-1/2 before:bg-white before:rounded-full before:left-1 before:-translate-y-1/2 before:transition-all before:duration-700 peer-checked:before:opacity-0 peer-checked:before:rotate-90 peer-checked:before:-translate-y-full shadow-lg shadow-gray-400 peer-checked:shadow-lg peer-checked:shadow-gray-700 peer-checked:bg-[#383838] after:content-['🌑'] after:absolute after:bg-[#1d1d1d] after:rounded-full after:top-[4px] after:right-1 after:translate-y-full after:w-10 after:h-10 after:opacity-0 after:transition-all after:duration-700 peer-checked:after:opacity-100 peer-checked:after:rotate-180 peer-checked:after:translate-y-0" />
          </label>
        </div>
        <div className="flex justify-between items-center border-b border-hrBlack pb-4 mb-5">
          <div className="">
            <h4 className="font-bold text-base mb-2">Ngôn ngữ</h4>
            <p className="text-[#A4A1AA]">Chọn ngôn ngữ của bạn</p>
          </div>
          <select
            name=""
            id=""
            className="bg-neutral-100 hover:bg-neutral-200 focus:ring-2 focus:ring-blue-500 rounded-md pl-3 py-2 text-sm "
          >
            <option value={1}>Tiếng Anh</option>
            <option value={2}>Tiếng Việt</option>
            <option value={3}>Tiếng Trung</option>
            <option value={2}>Tiếng Nhật</option>
          </select>
        </div>
        <div className="flex justify-between items-center border-b border-hrBlack pb-4 mb-5">
          <div className="">
            <h4 className="font-bold text-base mb-2">Xác thực hai yếu tố</h4>
            <p className="text-[#A4A1AA]">
              Bảo vệ tài khoản của bạn bằng cách bật 2FA qua email{" "}
            </p>
          </div>
          <div>
            <label className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-gray-900">
              <input
                className="peer sr-only"
                id="AcceptConditions"
                type="checkbox"
              />
              <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent" />
            </label>
          </div>
        </div>
        <div className="flex justify-between items-center border-b border-hrBlack pb-4 mb-5">
          <div className="">
            <h4 className="font-bold text-base mb-2">Thông báo đẩy</h4>
            <p className="text-[#A4A1AA]">Nhận thông báo đẩy </p>
          </div>
          <div>
            <label className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-gray-900">
              <input
                className="peer sr-only"
                id="AcceptConditions"
                type="checkbox"
              />
              <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent" />
            </label>
          </div>
        </div>
        <div className="flex justify-between items-center border-b border-hrBlack pb-4 mb-5">
          <div className="">
            <h4 className="font-bold text-base mb-2">
              Thông báo trên máy tính
            </h4>
            <p className="text-[#A4A1AA]">Nhận thông báo đẩy trên máy tính</p>
          </div>
          <div>
            <label className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-gray-900">
              <input
                className="peer sr-only"
                id="AcceptConditions"
                type="checkbox"
              />
              <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent" />
            </label>
          </div>
        </div>
        <div className="flex justify-between items-center border-b border-hrBlack pb-4 mb-5">
          <div className="">
            <h4 className="font-bold text-base mb-2">Thông báo qua email</h4>
            <p className="text-[#A4A1AA]">Nhận thông báo qua email </p>
          </div>
          <div>
            <label className="relative inline-block h-8 w-14 cursor-pointer rounded-full bg-gray-300 transition [-webkit-tap-highlight-color:_transparent] has-[:checked]:bg-gray-900">
              <input
                className="peer sr-only"
                id="AcceptConditions"
                type="checkbox"
              />
              <span className="absolute inset-y-0 start-0 m-1 size-6 rounded-full bg-gray-300 ring-[6px] ring-inset ring-white transition-all peer-checked:start-8 peer-checked:w-2 peer-checked:bg-white peer-checked:ring-transparent" />
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingPage;
