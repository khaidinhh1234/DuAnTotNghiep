import AddAddressForm from "./AddAdrres";

const ShippingAddress = ({ current, next, steps }: any) => {
  return (
    <>
      {/* <Routecheckout /> */}
      {/* <div className="my-5">
        <h3 className="title-h3">Chọn địa chỉ giao hàng</h3>
        <span className="text-[13px]">
          Tôi hoàn toàn yêu thích TopShelfBC; giá cả phải chăng với mọi ngân
          sách và giao hàng rất nhanh, trực tiếp đến cửa nhà! Tôi giới thiệu họ
          cho tất cả bạn bè và gia đình của mình cho nhu cầu 420 của họ.
        </span>
      </div>
      <div className="grid md:grid-cols-12 lg:grid-cols-6 xl:grid-cols-12 grid-cols-4 xl:gap-8 items-center mb-5">
        <div className="col-span-6 bg-slate-50 px-3 py-3 rounded-lg w-[335px]">
          <div className="flex justify-between mb-3">
            <h4 className="font-bold text-xl">Robert Fox</h4>
            <input type="checkbox" name="" id="" className="bg-blackL" />
          </div>
          <span className="text-md">
            FR7V+8CF, Hồng Vũ Thắng Lợi, Khu đô thị, Tp. Sông Công, Thái Nguyên
            250000
          </span>
          <div className="flex justify-around gap-3 *:px-12 *:py-1 my-4 *:rounded-lg">
            <button className="bg-slate-200 hover:bg-blackL hover:text-white">
              <i className="fa-regular fa-pen-to-square lowercase"></i>
              Edit
            </button>
            <button className="bg-rose-100 text-red-400 hover:bg-[#FF7262] hover:text-white">
              <i className="fa-regular fa-trash-can"></i>
              Delete
            </button>
          </div>
        </div>
        <div className="col-span-6 bg-slate-50 px-3 py-3 rounded-lg w-[335px]">
          <div className="flex justify-between mb-3">
            <h4 className="font-bold text-xl">Robert Fox</h4>
            <input type="checkbox" name="" id="" className="bg-blackL" />
          </div>
          <span className="text-md">
            FR7V+8CF, Hồng Vũ Thắng Lợi, Khu đô thị, Tp. Sông Công, Thái Nguyên
            250000
          </span>
          <div className="flex justify-around gap-3 *:px-12 *:py-1 my-4 *:rounded-lg">
            <button className="bg-slate-200 hover:bg-blackL hover:text-white">
              <i className="fa-regular fa-pen-to-square lowercase"></i>
              Edit
            </button>
            <button className="bg-rose-100 text-red-400 hover:bg-[#FF7262] hover:text-white">
              <i className="fa-regular fa-trash-can"></i>
              Delete
            </button>
          </div>
        </div>
      </div> */}
      {/* <Link
        to="/payment"
        className="btn-black px-10 w-[320px] py-4 rounded-lg text-md font-medium"
      >
        Giao ngay
      </Link> */}
      <AddAddressForm />{" "}
      {current < steps.length - 1 && (
        <button
          onClick={next}
          className="btn-black px-10 w-[320px] py-4 rounded-lg text-md font-medium flex items-center justify-center"
        >
          Giao hàng <i className="fa-solid fa-arrow-right ml-2 text-xl"></i>
        </button>
      )}
    </>
  );
};

export default ShippingAddress;
