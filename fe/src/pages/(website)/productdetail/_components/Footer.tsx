import React from "react";

const Footer = () => {
  return (
    <div>
      {" "}
      <section>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mt-12 mb-24">
            <div className="mx-auto">
              <i className="fa-regular fa-box text-3xl"></i>
              <h3 className="font-bold text-xl mt-3 mb-2">
                Miễn phí giao hàng
              </h3>
              <p>Với đơn hàng trên 599.000đ.</p>
            </div>
            <div className="mx-auto">
              <i className="fa-regular fa-circle-dollar text-3xl"></i>
              <h3 className="font-bold text-xl mt-3 mb-2">Đảm bảo tiền</h3>
              <p>Trong vòng 30 ngày để đổi trả</p>
            </div>
            <div className="mx-auto">
              <i className="fa-regular fa-headphones text-3xl"></i>
              <h3 className="font-bold text-xl mt-3 mb-2">Hỗ trợ trực tuyến</h3>
              <p>24 giờ một ngày, 7 ngày một tuần</p>
            </div>
            <div className="mx-auto">
              <i className="fa-light fa-credit-card text-3xl"></i>
              <h3 className="font-bold text-xl mt-3 mb-2">
                Thanh toán linh hoạt
              </h3>
              <p>Thanh toán bằng nhiều thẻ tín dụng</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
