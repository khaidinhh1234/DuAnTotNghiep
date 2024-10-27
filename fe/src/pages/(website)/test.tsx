import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Button, message, Steps, theme } from "antd";

const steps = [
  {
    title: "First",
    content: "First-content",
  },
  {
    title: "Second",
    content: "Second-content",
  },
  {
    title: "Last",
    content: "Last-content",
  },
];
const Test = () => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <section className="container">
      <div className="lg:mx-12 mx-6 lg:my-[84px] my-[42px]">
        <h1 className="h1cart">Shipping Address</h1>
        <div className="grid lg:grid-cols-12 lg:gap-20 px-0 justify-center">
          <div className="lg:col-span-6 xl:col-span-8 md:col-span-4 md:w-full w-[425px]">
            <>
              <div className="mb-7">
                <div className="flex items-center space-x-0">
                  <div className="pl-1">
                    <Link to={"/shippingAddressPage"}>
                      <i
                        className="fa-regular fa-house bg-blackL w-11 h-11 rounded-lg px-[10px] py-3 text-xl mb-2"
                        style={{ color: "#ffffff" }}
                      ></i>
                    </Link>
                  </div>
                  <hr className="m-0 dashed-line" />
                  <div className="text-center">
                    <i className="fa-light fa-credit-card bg-stone-100 w-11 h-11 rounded-lg px-[10px] py-3 text-xl mb-2"></i>
                  </div>
                  <hr className="m-0 dashed-line" />
                  <div className="pr-1 text-center">
                    <i className="fa-light fa-file-invoice bg-stone-100 w-11 h-11 rounded-lg px-[10px] py-3 text-xl mb-2"></i>
                  </div>
                </div>
                <div className="flex justify-between space-x-0">
                  <div className="text-center">
                    <span className="">Địa chỉ</span>
                  </div>

                  <div className="text-center">
                    <span>Phương thức thanh toán</span>
                  </div>

                  <div className="text-center">
                    <span>Xem xét</span>
                  </div>
                </div>
              </div>
            </>
            <div>
              <Steps
                current={current}
                className="flex justify-between items-center"
                items={steps.map((step, index) => ({
                  title: step.title,
                  icon: (
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        current === index
                          ? "bg-black text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {index + 1}
                    </div>
                  ),
                }))}
              />
              <div className="mt-6">
                <div className="mb-6 text-center">{steps[current].content}</div>
                {current < steps.length - 1 && (
                  <Button type="primary" onClick={next}>
                    Next
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={() => message.success("Processing complete!")}
                  >
                    Done
                  </Button>
                )}
                {current > 0 && (
                  <Button className="mx-2" onClick={prev}>
                    Previous
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
