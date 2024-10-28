import { Button } from "antd";

const Subtotal = () => (
  <div className="lg:col-span-4 col-span-6">
    <div className="border px-4 py-1 lg:w-[359px] rounded-md">
      <h1 className="text-xl font-bold mt-4">Chi tiết đơn hàng</h1>
      <div className="flex justify-between font-bold border-hrBlack border-b ">
        <h4>Tổng giá trị sản phẩm</h4>
        <span className="px-2">{(17236245).toLocaleString("vn-VN")} ₫</span>
      </div>

      <div className="py-4">
        {/* <label className="text-xs">Nhập mã giảm giá</label> */}
        <div className=" flex justify-between font-medium border-hrBlack">
          <p>Tiết kiệm</p>
          {/* <span className="px-2">{formatCurrency(finalTotal)}</span> */}
          <span className="px-2 text-red-500">
            - {17236245 > 0 ? (17236245).toLocaleString("vn-VN") : 0} ₫
          </span>
        </div>
        <div className="py-4">
          <label className="text-xs">Nhập mã giảm giá</label>
          <br />
          <div className="flex">
            <input
              type="text"
              placeholder="FLAT50"
              className="lg:w-[218px] w-[300px] h-[56px] px-4 rounded-s-lg focus:outline-none border border-l-2 border-t-2 border-blackL border-r-0"
            />
            <button className="bg-black hover:bg-stone-700 w-[101px] h-[55px] border border-black rounded-r-lg text-white">
              Áp dụng
            </button>
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

        <div className="flex justify-between font-bold mb-8">
          <h4>Tổng cộng</h4>
          <span>{17236245}</span>
        </div>

        <div className="flex justify-center">
          {/* <Link to="/checkout"> */}
          <Button
            // onClick={handleCheckout}
            className="btn-black rounded-lg mb-4 w-[320px] h-[56px] font-semibold"
            // disabled={
            //   !data?.san_pham_giam_gia.length &&
            //   !data?.san_pham_nguyen_gia.length
            // }
          >
            Mua hàng ()
          </Button>
          {/* </Link> */}
        </div>
      </div>
    </div>
  </div>
);

export default Subtotal;
