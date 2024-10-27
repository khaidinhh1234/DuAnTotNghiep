import { Button, message, Steps } from "antd";
import { useState } from "react";
import Subtotal from "../ordersummary/_components/subtotail";
// import AddAddressForm from "../ShipingAdrres/_components/AddAdrres";

import AddAddressForm from "./_component/shipping/AddAdrres";
import Payment from "./_component/payment/payment";
import ShippingAddress from "./_component/shipping/ShippingAddress";

// import ShippingAddress from "../ShipingAdrres/_components/ShippingAddress";
const Layoutcheckout = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  // const current = 1;
  const Diachi = () => (
    <>
      <ShippingAddress current={current} steps={steps} next={next} />
    </>
  );
  const Thanhtoan = () => (
    <>
      <Payment current={current} steps={steps} next={next} prev={prev} />
    </>
  );
  const steps = [
    {
      title: "Địa chỉ",
      content: (
        <>
          <Diachi />
        </>
      ),

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
      content: (
        <>
          <Thanhtoan />
        </>
      ),

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
        <h1 className="h1cart">
          {current == 0
            ? "Địa chỉ giao hàng"
            : current == 1
              ? "Phương thức thanh toán"
              : current == 2
                ? "Đặt Hàng"
                : ""}
        </h1>
        <div className="grid lg:grid-cols-12 lg:gap-20 px-0 justify-center">
          <div className="lg:col-span-6 xl:col-span-8 md:col-span-4 md:w-full w-[425px]">
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
              <div className="">{steps[current].content}</div>

              {current === steps.length - 1 && (
                <Button
                  type="primary"
                  onClick={() => message.success("ok ok ok ok oko ko ko")}
                >
                  Mua hàng
                </Button>
              )}
            </div>
          </div>
          <Subtotal />
        </div>
      </div>
    </section>
  );
};

export default Layoutcheckout;
