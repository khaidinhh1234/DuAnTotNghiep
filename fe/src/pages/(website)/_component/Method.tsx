const Method = () => {
  return (
    <>
      <section className="bg-neutral-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">
            {/* Phần tử 1 */}
            <div className="text-center flex flex-col items-center">
              <i className="fa-regular fa-box text-5xl text-primary mb-4"></i>
              <h3 className="font-bold text-lg lg:text-xl mt-3 mb-2">
                Miễn phí vận chuyển
              </h3>
              <p className="text-sm lg:text-base">
                Miễn phí vận chuyển cho đơn hàng trên 500.000đ
              </p>
            </div>
            {/* Phần tử 2 */}
            <div className="text-center flex flex-col items-center">
              <i className="fa-regular fa-circle-dollar text-5xl text-primary mb-4"></i>
              <h3 className="font-bold text-lg lg:text-xl mt-3 mb-2">
                Đảm bảo hoàn tiền
              </h3>
              <p className="text-sm lg:text-base">
                Trong vòng 30 ngày để đổi hàng
              </p>
            </div>
            {/* Phần tử 3 */}
            <div className="text-center flex flex-col items-center">
              <i className="fa-regular fa-headphones text-5xl text-primary mb-4"></i>
              <h3 className="font-bold text-lg lg:text-xl mt-3 mb-2">
                Hỗ trợ trực tuyến
              </h3>
              <p className="text-sm lg:text-base">
                24 giờ một ngày, 7 ngày một tuần
              </p>
            </div>
            {/* Phần tử 4 */}
            <div className="text-center flex flex-col items-center">
              <i className="fa-light fa-credit-card text-5xl text-primary mb-4"></i>
              <h3 className="font-bold text-lg lg:text-xl mt-3 mb-2">
                Thanh toán linh hoạt
              </h3>
              <p className="text-sm lg:text-base">
                Thanh toán bằng nhiều thẻ tín dụng
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Method;
