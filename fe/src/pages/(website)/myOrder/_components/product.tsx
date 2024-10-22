import { sanPham2 } from "@/assets/img";

// Component hiển thị thông tin sản phẩm
const ProductItem = ({ status, price }: any) => {
  return (
    <div className="py-6 flex justify-between border-b border-hrBlack">
      <div className="grid justify-between">
        <div className="flex gap-5 items-center ">
          <div className=" rounded-md text-center">
            {" "}
            <img
              src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729223981/ao-khoac-nu-SKN7004-DEN_1_jjbtoe.webp"
              alt="Sản phẩm"
              className="w-20 h-24 rounded-md mb-5"
            />
            <a
              href="#"
              className={`text-xs px-3 py-1 rounded-sm ${status === "Delivered" ? "delivered" : "inprocrass"}`}
            >
              {status === "Delivered" ? "Đã Giao" : "Đang Xử Lý"}
            </a>
          </div>
          <div className="px-1">
            <h3 className="font-bold my-1">Váy In Họa Tiết Moana Hồng</h3>
            <p
              className={`font-bold md:hidden block ${status === "Delivered" ? "" : "hidden"}`}
            >
              Giá: ${price}
            </p>
            <p>
              Size: <span>S</span>
            </p>
            <p className="mb-10">Số lượng: 1</p>{" "}
            <span className="">
              Sản phẩm của bạn đã{" "}
              {status === "Delivered" ? "được giao" : "đang được xử lý"}
            </span>
          </div>
        </div>
      </div>
      <div
        className={`text-center py-8 font-bold ${status === "Delivered" ? "md:block hidden" : ""}`}
      >
        <p>{price.toLocaleString("vi-VN")} đ</p>
      </div>
      <div className="hidden sm:block">
        <button className="hover:bg-blackL hover:text-white shadow font-medium shadow-black/50 text-sm py-3 px-6 mb-2 rounded-lg">
          Xem Đơn Hàng
        </button>
        <br />
        <button
          className={`${
            status === "Delivered"
              ? "bg-[#FF7262] hover:bg-[#e9b2ac]"
              : "bg-[#FF7262] hover:bg-[#e9b2ac]"
          } shadow-lg shadow-slate-600/50 text-white w-[145px] text-sm py-3 rounded-lg`}
        >
          {status === "Delivered" ? "Hủy Đơn Hàng" : "Hủy Đơn Hàng"}
        </button>
      </div>
    </div>
  );
};

// Component hiển thị danh sách sản phẩm
const ProductList = () => {
  return (
    <div className="lg:col-span-9 col-span-8 lg:pl-9">
      <ProductItem status="Delivered" price={8000000} />
      <ProductItem status="In Progress" price={8000000} />
      <ProductItem status="In Progress" price={8000000} />
    </div>
  );
};

export default ProductList;
