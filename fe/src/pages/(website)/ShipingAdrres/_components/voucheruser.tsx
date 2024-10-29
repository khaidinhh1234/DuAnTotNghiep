import { Button, Modal } from "antd";
import React, { useState } from "react";

const Voucheruser = () => {
  const [open, setOpen] = useState(false);
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <div>
      {" "}
      <button
        className="rounded-r-lg py-5 flex justify-between w-full pr-5"
        onClick={() => setOpen(true)}
      >
        {" "}
        <div>
          {" "}
          <i className="fa-regular fa-ticket"></i> Mã giảm giá
        </div>{" "}
        <i className="fa-solid fa-chevron-up fa-rotate-90"></i>
      </button>
      <Modal
        centered
        open={open}
        width={800}
        className=""
        okText="Đồng ý"
        footer={null}
        onCancel={handleCancel}
      >
        <div>
          {/* Overlay */}
          <div className=" flex items-center justify-center  bg-opacity-50">
            {/* Popup container */}
            <div className="bg-white rounded-lg  w-full p-5">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Mã ưu đãi</h2>
              </div>
              {/* Input mã ưu đãi */}
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  placeholder="Nhập mã ưu đãi"
                  className="border border-gray-300 rounded-md px-4 py-2 w-full mr-2"
                />
                <button className="bg-gray-200 text-gray-500 w-40 px-4 py-2 rounded-md hover:bg-gray-300">
                  Sử dụng
                </button>
              </div>
              {/* Voucher List */}
              <div className=" grid grid-cols-2 gap-5">
                {/* Voucher Item 1 */}
                <div className="border border-teal-500 bg-teal-50  rounded-md p-4 flex justify-between items-center  shadow-md shadow-black/50">
                  <div>
                    <span className="bg-teal-500 text-white text-sm px-2 py-1 rounded">
                      Lựa chọn tốt nhất
                    </span>
                    <h3 className="text-lg font-semibold mt-2">Voucher 50K</h3>
                    <p className="text-sm text-gray-500">
                      Giảm 50k cho đơn từ 999k
                    </p>
                    <div className="font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded mt-2">
                      GIAM50
                    </div>
                    <p className="text-sm text-red-500 mt-1">
                      Sắp hết hạn: Còn 2 ngày
                    </p>
                  </div>
                  <div className="text-teal-500">
                    <button className="text-sm font-semibold">Điều kiện</button>
                    <span className="text-2xl ml-4">✔️</span>
                  </div>
                </div>
                {/* Voucher Item 2 */}
                <div className="border rounded-md px-4 flex justify-between items-center ">
                  <div>
                    <span className="bg-teal-500 text-white text-sm px-2 py-1 rounded">
                      Lựa chọn tốt nhất
                    </span>
                    <h3 className="text-lg font-semibold mt-2">Voucher 50K</h3>
                    <p className="text-sm text-gray-500">
                      Giảm 50k cho đơn từ 999k
                    </p>
                    <div className="font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded mt-2">
                      GIAM50
                    </div>
                    <p className="text-sm text-red-500 mt-1">
                      Sắp hết hạn: Còn 2 ngày
                    </p>
                  </div>
                  <div className="text-teal-500">
                    <button className="text-sm font-semibold">Điều kiện</button>
                    <span className="text-2xl ml-4">✔️</span>
                  </div>
                </div>
              </div>
              {/* Continue button */}
              <div className="mt-5">
                <button className="bg-red-600 text-white w-full py-3 font-semibold hover:bg-red-700">
                  Tiếp tục
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Voucheruser;
