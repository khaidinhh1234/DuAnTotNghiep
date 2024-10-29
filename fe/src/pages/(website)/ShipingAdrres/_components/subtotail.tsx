const Subtotal = () => (
  <div className="lg:col-span-4 col-span-6">
    <div className="border px-4 py-1 lg:w-[359px] rounded-md">
      <h1 className="text-xl font-bold mt-4">Chi tiết đơn hàng</h1>
      <div className="flex justify-between font-bold border-hrBlack border-b ">
        <h4>Tổng giá trị sản phẩm</h4>
        <span className="px-2">$200.00</span>
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
        <div className="py-4">
          <div className=" flex justify-between font-medium border-hrBlack">
            <p>Tiết kiệm</p>
            <span className="px-2 text-red-500">$5.00</span>
          </div>
          <div className=" flex justify-between font-medium border-hrBlack">
            <p>Phí giao hàng</p>
            <span className="px-2">$5.00</span>
          </div>
          <div className=" flex justify-between font-medium border-hrBlack">
            <p>Giảm giá vận chuyển</p>
            <span className="px-2 text-red-500">$5.00</span>
          </div>
        </div>
        <div className="flex justify-between font-bold ">
          <h4>Tổng cộng</h4>
          <span>$205.00</span>
        </div>
      </div>
      <div className="flex justify-end text-red-500 mb-8">
        <span>Bạn đã tiết kiệm được 469.100 đ</span>
      </div>
      <a href="/shippingAddressPage">
        <button
          type="submit"
          className=" block btn-black px-10 w-[320px] my-4 mx-auto py-4 rounded-lg text-md font-medium"
        >
          Đặt hàng ngay
        </button>
      </a>
    </div>
  </div>
);

export default Subtotal;
