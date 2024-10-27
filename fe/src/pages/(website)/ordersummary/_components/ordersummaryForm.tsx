import { sanPham2 } from "@/assets/img";

const Order = () => {
  return (
    <div className="lg:col-span-6 xl:col-span-8 md:col-span-4 md:w-full w-[425px]">
      <div className="mb-7">
        <div className="flex items-center space-x-0">
          <div className="pl-1">
            <i
              className="fa-regular fa-house bg-blackL w-11 h-11 rounded-lg px-[10px] py-3 text-xl mb-2"
              style={{ color: "#ffffff" }}
            ></i>
          </div>
          <hr className="m-0 dashed-black" />
          <div className="text-center">
            <i className="fa-light fa-credit-card bg-blackL text-white w-11 h-11 rounded-lg px-[10px] py-3 text-xl mb-2"></i>
          </div>
          <hr className="m-0 dashed-black" />
          <div className="pr-1 text-center">
            <i className="fa-light fa-file-invoice bg-blackL text-white w-11 h-11 rounded-lg px-[10px] py-3 text-xl mb-2"></i>
          </div>
        </div>
        <div className="flex justify-between space-x-0">
          <div className="text-center">
            <span>Địa chỉ</span>
          </div>
          <div className="text-center">
            <span>Phương thức thanh toán</span>
          </div>
          <div className="text-center">
            <span className="">Đặt hàng</span>
          </div>
        </div>
      </div>

      <div className="mt-[30px]">
        <h3 className="title-h3">Dự kiến giao hàng: 22 Tháng 2, 2024</h3>

        <div className="px-2 mb-8">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex gap-5 px-2 items-center border-b border-hrBlack py-5"
            >
              <img src={sanPham2} alt="Sản phẩm" className="w-12 h-12" />
              <div className="px-1">
                <h3 className="font-bold my-1">Đầm in Moana Hồng</h3>
                <p>$80.00</p>
                <p>
                  Size: <span>S</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-[755px]">
          <h3 className="title-h3">Địa chỉ giao hàng</h3>
          <div className="py-6 items-center flex justify-between border-b border-hrBlack">
            <div className="mb-3">
              <h4 className="font-bold text-xl">Robert Fox</h4>
              <p className="my-2 w-96 lg:w-[720px]">
                FR7V+8CF, Hồng Vũ Thắng Lợi, Khu đô thị, Tp. Sông Công, Thái
                Nguyên 250000
              </p>
            </div>
            <div className="text-lg rounded-lg bg-slate-100 px-[9px] py-1 text-center">
              <i className="fa-regular fa-pen-to-square lowercase"></i>
            </div>
          </div>

          <h3 className="title-h3 mt-8">Phương thức thanh toán</h3>
          <div className="py-6 flex justify-between border-b lg:w-[755px] border-hrBlack">
            <div className="title-h3">
              <span>Thẻ ghi nợ(.... ... ... ..89)</span>
            </div>
            <div className="text-lg rounded-lg bg-slate-100 px-[9px] py-1 text-center">
              <i className="fa-regular fa-pen-to-square lowercase"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
