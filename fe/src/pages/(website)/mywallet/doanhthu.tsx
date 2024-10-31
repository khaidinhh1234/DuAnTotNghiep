import React from "react";
import { Tabs } from "antd";
import { LeftOutlined, MoreOutlined, WalletOutlined } from "@ant-design/icons";

const RevenuePage = () => {
  return (
    <div className="bg-gray-50 h-screen flex items-center justify-center">
      <div className="bg-white w-full max-w-lg md:max-w-2xl lg:max-w-3xl shadow-md rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <button className="text-red-500">
            <LeftOutlined className="text-xl" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Doanh thu</h1>
          <button className="text-red-500">
            <MoreOutlined className="text-xl" />
          </button>
        </div>

        {/* Tabs */}
        <Tabs
          defaultActiveKey="1"
          centered
          tabBarStyle={{ borderBottom: "1px solid #f0f0f0" }}
          items={[
            {
              key: "1",
              label: <span className="text-red-500">Chưa thanh toán</span>,
              children: (
                <div className="flex flex-col items-center justify-center h-96 md:h-80 lg:h-96">
                  <p className="text-4xl md:text-5xl font-bold text-red-500">₫0</p>
                  <div className="flex items-center mt-1 text-gray-500 text-sm md:text-base">
                    <WalletOutlined className="mr-1" />
                    Shopee Đảm Bảo
                  </div>
                  <div className="mt-6 flex flex-col items-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 md:h-16 md:w-16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a2 2 0 002 2h10a2 2 0 002-2V10M9 21h6"
                      />
                    </svg>
                    <p className="mt-2 md:text-lg">Không có lịch sử giao dịch</p>
                  </div>
                </div>
              ),
            },
            {
              key: "2",
              label: <span className="text-gray-500">Đã thanh toán</span>,
              children: (
                <div className="flex flex-col items-center justify-center h-96 md:h-80 lg:h-96">
                  <p className="text-lg text-gray-500">Đã thanh toán</p>
                  {/* Bạn có thể thêm nội dung của phần "Đã thanh toán" ở đây */}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default RevenuePage;
