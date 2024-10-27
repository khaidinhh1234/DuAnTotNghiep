import { SmileOutlined, TruckOutlined } from "@ant-design/icons";
import { Button, message, Steps, theme } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
const Test = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  // const current = 1;
  const steps = [
    {
      title: "Địa chỉ",
      content: "Đơn hàng đã đặt",

      icon:
        current >= 0 ? (
          <i
            className="fa-regular fa-house bg-blackL rounded-lg px-[14px] py-3 text-2xl mb-2"
            style={{ color: "#ffffff" }}
          ></i>
        ) : (
          <i className="fa-regular fa-house bg-stone-200  rounded-lg px-[14px] py-3 text-2xl mb-2"></i>
        ),
    },
    {
      title: "Thanh toán ",
      content: "Đã xác nhận ",

      icon:
        current >= 1 ? (
          <i className="fa-light fa-credit-card bg-blackL rounded-lg px-[14px] py-3 text-2xl mb-2 text-white"></i>
        ) : (
          <i className="fa-light fa-credit-card bg-stone-200  rounded-lg px-[14px] py-3 text-2xl mb-2"></i>
        ),
    },
    {
      title: "Mua  ",
      content: "Đã xác nhận ",

      icon:
        current >= 2 ? (
          <i className="fa-light fa-file-invoice bg-blackL rounded-lg px-[18px] py-3 text-3xl mb-2"></i>
        ) : (
          <i className="fa-light fa-file-invoice bg-stone-200  rounded-lg px-[18px] py-3 text-3xl mb-2"></i>
        ),
    },
  ];

  return (
    <section className="container">
      <div className="lg:mx-12 mx-6 lg:my-[84px] my-[42px]">
        <h1 className="h1cart">Shipping Address</h1>
        <div className="grid lg:grid-cols-12 lg:gap-20 px-0 justify-center">
          <div className="lg:col-span-6 xl:col-span-8 md:col-span-4 md:w-full w-[425px]">
            <div className="col-span-12 w-full">
              <Steps
                current={current}
                labelPlacement="vertical"
                className="flex justify-between items-center "
                items={steps.map((step, index) => ({
                  title: (
                    <div
                      className={`text-center  w-40${
                        current === index ? "text-black" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </div>
                  ),
                  icon: (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        current === index
                          ? "bg-black text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {step.icon}
                    </div>
                  ),
                }))}
              />
              <div className="mt-6">
                <div className="mb-6 text-center">{steps[current].content}</div>
                {current < steps.length - 1 && (
                  <Button type="primary" onClick={next}>
                    Tiếp theo
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={() => message.success("ok ok ok ok oko ko ko")}
                  >
                    Mua hàng
                  </Button>
                )}
                {current > 0 && (
                  <Button className="mx-2" onClick={prev}>
                    Quay lại
                  </Button>
                )}
              </div>
            </div>
          </div>
          {/* <Subtotal /> */}
        </div>
      </div>
    </section>
  );
};

export default Test;
