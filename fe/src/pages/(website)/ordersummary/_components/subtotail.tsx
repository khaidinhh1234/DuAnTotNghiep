import { Button, message } from "antd";

const Subtotal = ({ current, steps, next, prev }: any) => (
  <div className="lg:col-span-4 col-span-6">
    <div className="border px-4 py-1 lg:w-[359px] rounded-md">
      <h1 className="text-xl font-bold mt-4">Chi tiết đơn hàng</h1>
      <div className="flex justify-between font-bold border-hrBlack border-b ">
        <h4>Tổng giá trị sản phẩm</h4>
        <span className="px-2">{(17236245).toLocaleString("vn-VN")} ₫</span>
      </div>

      <div className="py-4">
        {/* <label className="text-xs">Nhập mã giảm giá</label> */}
        {/* <label className="text-xs">Nhập mã giảm giá</label>
        <br />
        <div className="flex mb-2">
          <input
            type="text"
            placeholder="FLAT50"
            className="lg:w-[218px] w-[300px] h-[56px] px-4 rounded-s-lg focus:outline-none border border-l-2 border-t-2 border-blackL border-r-0"
          />
          <button className="bg-black hover:bg-stone-700 w-[101px] h-[55px] border border-black rounded-r-lg text-white">
            Áp dụng
          </button>
        </div> */}
        <div className=" flex justify-between font-medium border-hrBlack">
          <p>Tiết kiệm</p>
          {/* <span className="px-2">{formatCurrency(finalTotal)}</span> */}
          <span className="px-2 text-red-500">
            - {17236245 > 0 ? (17236245).toLocaleString("vn-VN") : 0} ₫
          </span>
        </div>

        <div className="flex justify-between font-medium mb-0 border-hrBlack">
          <p>Phí giao hàng</p>
          {/* <span className="px-2">{formatCurrency(finalTotal)}</span> */}
          <span className="px-2">
            {17236245 > 0 ? (17236245).toLocaleString("vn-VN") : 0} ₫
          </span>
        </div>
        <div className="flex justify-between font-medium border-b border-hrBlack">
          <p>Giảm giá vận chuyển</p>
          {/* <span className="px-2">{formatCurrency(finalTotal)}</span> */}
          <span className="px-2 text-red-500">
            - {17236245 > 0 ? (17236245).toLocaleString("vn-VN") : 0} ₫
          </span>
        </div>
      </div>
      <div className="flex justify-between font-bold mb-2 ">
        <h4>Tổng cộng</h4>
        <span> {17236245 > 0 ? (17236245).toLocaleString("vn-VN") : 0} ₫</span>
      </div>

      <div className="">
        {current < steps.length - 1 && current == 0 && (
          <button
            onClick={next}
            className=" btn-black px-10 w-[320px] my-4 mx-auto py-3 rounded-lg text-md font-medium flex items-center justify-center"
          >
            Giao hàng <i className="fa-solid fa-arrow-right ml-2 text-xl"></i>
          </button>
        )}
        {current < steps.length - 1 && current > 0 && (
          <button
            onClick={next}
            className=" btn-black px-10 w-[320px] my-4 mx-auto py-4 rounded-lg text-md font-medium flex items-center justify-center"
          >
            Thanh toán <i className="fa-solid fa-arrow-right ml-2 text-xl"></i>
          </button>
        )}
        {current === steps.length - 1 && (
          <button
            type="submit"
            className="block btn-black px-10 w-[320px] my-4 mx-auto py-4 rounded-lg text-md font-medium"
            onClick={() => message.success("ok ok ok ok oko ko ko")}
          >
            Đặt hàng ngay
          </button>
        )}
        {current > 0 ? (
          <button
            type="submit"
            className="block btn-black px-10 w-[320px] my-4 mx-auto py-4 rounded-lg text-md font-medium"
            onClick={prev}
          >
            Quay lại
          </button>
        ) : (
          <a
            href="/gio-hang"
            className="block btn-black px-10 w-[320px] my-4 mx-auto py-4 rounded-lg text-md font-medium text-center"
          >
            Quay lại giỏ hàng
          </a>
        )}
        {/* </Link> */}
      </div>
    </div>
  </div>
);

export default Subtotal;
