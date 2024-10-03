import { Progress } from "antd";

const ShowUser = () => {
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
            <span className="px-2">29 </span>
            <br />
            <span className="text-gray-500 text-xl"> Đơn hàng</span>
          </div>
          <div className="text-2xl font-bold">
            <i className="fa-regular fa-star text-gray-500 "></i>
            <span className="px-2">100 </span>
            <br />
            <span className="text-gray-500 text-xl">Đánh giá</span>
          </div>
          <div className="text-2xl font-bold">
            <i className="fa-regular fa-heart text-gray-500"></i>
            <span className="px-2">1.093 </span>
            <br />
            <span className="text-gray-500 text-xl"> Yêu thích </span>
          </div>
          <div className="text-2xl font-bold text-gray-500">
            <i className="fa-solid fa-rotate-reverse"></i>
            <span className="px-2">0 </span>
            <br />
            <span className="text-gray-500 text-xl"> Trả hàng</span>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-1 mt-5">
          <div className="bg-white text-center pt-10 col-span-2 ">
            <img
              src="https://res.cloudinary.com/dpypwbeis/image/upload/v1727972418/Screenshot_2024-10-03_230710-transformed_siyn1o.png"
              alt="Avatar"
              className="w-36 h-36 rounded-full border-2 border-gray-300 mx-auto"
            />
            <div className="flex-grow my-5">
              <h2 className="text-3xl font-semibold text-gray-700">
                Nguyễn Thị Hồng
              </h2>

              <p className="text-black font-bold">
                Email:{" "}
                <span className="text-gray-500 font-semibold">
                  khíoai@gmail.com
                </span>
              </p>
              <p className="text-black font-bold">
                Địa chỉ giao hàng:{" "}
                <span className="text-gray-500 font-semibold">
                  123, Đường 3/2, Quận 10
                </span>
              </p>
            </div>
          </div>
          <div className="col-span-4">
            <div className="grid grid-cols-4  gap-4 shadow-teal-600 shadow-inner rounded-lg p-4 mb-4">
              <div className="col-span-2  px-10 py-4 ">
                <h3 className="font-semibold text-gray-800 text-2xl mb-10">
                  Thông tin cá nhân
                </h3>
                <p className="my-10">
                  <strong>Số điện thoại:</strong> <span>0263 281 480</span>
                </p>
                <p className="my-10">
                  <strong>Ngày sinh:</strong> 23/02/2004
                </p>
                <p className="my-10">
                  <strong>Giới tính:</strong> <span>Nữ</span>
                </p>
                <p className="my-10">
                  <strong>Vai trò:</strong> <span>Quản trị viên</span>
                </p>
                <p>
                  <strong>Trạng thái:</strong> <span>Hoạt động</span>
                </p>
              </div>
              <div className="col-span-2 text-center">
                <h3 className=" text-gray-400 text-lg">Hạng thành viên</h3>
                <h2 className="text-center text-2xl font-bold">
                  Khách hàng VIP
                </h2>
                <div className="w-60 mx-auto">
                  <img
                    src="https://res.cloudinary.com/dpypwbeis/image/upload/v1727977025/4235_bdhhkj.png"
                    alt=""
                    className="w-full  "
                  />
                </div>
                <p className="flex justify-center items-center gap-3 ">
                  <p className="pt-4">20M </p>
                  <div className="w-40">
                    <Progress
                      percent={70}
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
                  <p className="pt-4">50M </p>
                </p>
              </div>
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-100 rounded-lg p-4 mb-4">
              <p className="flex justify-center items-center gap-3">
                <div className="w-28">
                  <Progress
                    percent={70}
                    strokeColor={{
                      "0%": "#6dd5ed",
                      "100%": "#00bfff", // Màu chuyển tiếp
                    }}
                    trailColor="#333"
                    strokeWidth={10}
                    showInfo={true} // Hiện thị tỷ lệ
                    format={(percent) => `${percent}%`} // Định dạng hiển thị
                    style={{ borderRadius: "25px" }} // Đường viền tròn
                  />
                </div>
                <span>Đồng</span>
              </p>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Notifications Type
                </h3>
                <p>
                  <strong>Emergency:</strong> 8/11
                </p>
                <p>
                  <strong>Helps:</strong> 4/5
                </p>
                <p>
                  <strong>Number Report:</strong> 5/9{" "}
                  <a href="#" className="text-blue-500">
                    View
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Settings</h3>
                <p>
                  <strong>Language:</strong> Tiếng Việt{" "}
                  <a href="#" className="text-blue-500">
                    Change
                  </a>
                </p>
                <div className="flex items-center">
                  <label className="mr-2">Get Notifications:</label>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    defaultChecked
                  />
                </div>
                <div className="flex items-center">
                  <label className="mr-2">Send to Family:</label>
                  <input type="checkbox" className="form-checkbox" />
                </div>
                <p>
                  <strong>Range Get Notifications:</strong> 5 km
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShowUser;
