interface VoucherDetailProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: any;
  onSave: (maCode: string) => void;
  isSaved: boolean;
}

const VoucherDetail = ({
  isOpen,
  onClose,
  voucher,
  onSave,
}: VoucherDetailProps) => {
  if (!isOpen || !voucher) return null;
  console.log(voucher);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <span
          className="text-gray-400 float-right text-3xl font-bold cursor-pointer"
          onClick={onClose}
        >
          &times;
        </span>

        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Chi tiết mã ưu đãi
        </h2>

        <div className="mb-8">
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-4 shadow-md w-full max-w-[450px] min-h-[150px] relative">
            <div className="absolute top-1 -right-1 flex items-center">
              <div className="bg-red-100 text-red-500 font-bold text-sm px-2 py-1 rounded-l-full shadow-md relative">
                x {voucher.so_luong - voucher.so_luong_da_su_dung}
              </div>
              <div
                className="absolute -bottom-1 -right-0 w-1 h-1 bg-[#fe9f8c]"
                style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
              ></div>
            </div>
            <div className="absolute -top-2 right-36 w-4 h-4 bg-gray-100 rounded-full md:block hidden"></div>
            <div className="absolute top-4 right-[9.50rem] bottom-4 border-r border-dashed border-gray-300 md:block hidden"></div>
            <div className="absolute -bottom-2 right-36 w-4 h-4 bg-gray-100 rounded-full md:block hidden"></div>
            <div className="flex-grow">
              <h2 className="text-lg font-semibold">
                {voucher.loai === "tien_mat"
                  ? `Giảm ${voucher.giam_gia.toLocaleString()}đ`
                  : `Giảm ${voucher.giam_gia}%`}
              </h2>
              <p className="text-sm text-gray-600 max-w-[200px] break-words">
                {voucher.loai === "tien_mat"
                  ? `Giảm ${voucher.giam_gia.toLocaleString()}đ`
                  : `Giảm ${voucher.giam_gia}%`}{" "}
                cho đơn từ {voucher.chi_tieu_toi_thieu.toLocaleString()}đ
              </p>
              <div className="bg-[#cfebee] text-[#63b1bc] px-2 py-1 rounded mt-2 inline-block">
                {voucher.ma_code}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-[60px] mt-2">
                <p className="text-red-500 text-sm">
                  HSD: {new Date(voucher.ngay_ket_thuc).toLocaleDateString()}
                </p>
                <a
                  href="#"
                  className="text-gray-700 text-sm -mt-[14px] font-bold "
                >
                  Điều kiện
                </a>
              </div>
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={() => onSave(voucher.ma_code)}
                disabled={voucher.da_thu_thap === 1}
                className={`${
                  voucher.da_thu_thap === 1 ? "bg-gray-400" : "bg-[#63b1bc]"
                } text-white font-semibold py-2 px-8 rounded whitespace-nowrap`}
              >
                {voucher.da_thu_thap === 1 ? "Đã lưu" : "Lưu mã"}
              </button>
            </div>
          </div>
        </div>

        <div className="text-base text-gray-600">
          <ul className="list-none space-y-3">
            <li>
              - Hạn sử dụng:{" "}
              {new Date(voucher.ngay_bat_dau).toLocaleDateString()} -{" "}
              {new Date(voucher.ngay_ket_thuc).toLocaleDateString()}
            </li>
            <li>- Ưu đãi: {voucher.mo_ta}</li>
            <li>- {voucher.ap_dung}</li>
            <li>
              - Đơn tối thiểu {voucher.chi_tieu_toi_thieu.toLocaleString()}đ
            </li>
            <li>- Mỗi khách hàng được dùng duy nhất 1 lần</li>
            <li>- Áp dụng 01 mã ưu đãi/ 01 hoá đơn thanh toán.</li>
          </ul>
        </div>

        <button
          onClick={() => onSave(voucher.ma_code)}
          disabled={voucher.da_thu_thap === 1}
          className={`${
            voucher.da_thu_thap === 1 ? "bg-gray-400" : "bg-black"
          } text-white py-2 px-40 mt-8 block mx-auto text-lg font-semibold`}
        >
          {voucher.da_thu_thap === 1 ? "Đã lưu" : "Lưu mã"}
        </button>
      </div>
    </div>
  );
};

export default VoucherDetail;
