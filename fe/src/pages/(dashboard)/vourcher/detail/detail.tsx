import { Modal } from "antd";
import { useState } from "react";

const Detail = ({ record }: any) => {
  const [open, setOpen] = useState(false);

  //   const { data } = useQuery({
  //     queryKey: ["ORDER_DETAIL", record.id],
  //     queryFn: async () => {
  //       const response = await instance.get(`/donhang/${record.id}`);
  //       return response.data;
  //     },
  //   });
  // const { data: vanchuyen, isLoading } = useQuery({
  //   queryKey: ["vanchuyen"],
  //   queryFn: async () => {
  //     const response = await instance.get("/vanchuyen");
  //     return response.data;
  //   },
  // });
  // const { data: danhgia  } = useQuery({
  //   queryKey: ["danhgiasanpham"],
  //   queryFn: async () => {
  //     const response = await instance.get(`/danhsachdanhgia`);
  //     return response.data;
  //   },
  // });
  //   const mutation = useMutation({
  //     mutationFn: async ({
  //       id,
  //       phan_hoi,
  //     }: {
  //       id: number | string;
  //       phan_hoi: string;
  //     }) => {
  //       const response = await instance.post(`/danhsachdanhgia/${id}`, {
  //         phan_hoi,
  //       });
  //       return response.data;
  //     },
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["ORDER_DETAIL"] });
  //     },
  //     onError: (error) => {
  //       console.error("Error:", error);
  //     },
  //   });
  //   const products = data?.data?.don_hang?.chi_tiets?.map((item: any) => {
  //     return {
  //       ...item,
  //     };
  //   });
  //   // console.log(record, "toan");
  //   // const donhang = data?.data;
  //   const thongtin = data?.data.thong_tin;

  // console.log("data", products);
  // console.log(vanchuyen, "vanchuyen");
  const handleCancel = () => {
    setOpen(false);
  };

  //   const { mutate } = useMutation({
  //     mutationFn: async ({ id, action }: any) => {
  //       // console.log("data", id, action);

  //       try {
  //         const response = await instance.put("/donhang/trang-thai-don-hang", {
  //           trang_thai_don_hang: action,
  //           id: [id],
  //         });
  //         const error = response.data.message;

  //         if (error === "Cập nhật trạng thái đơn hàng thành công") {
  //           message.open({
  //             type: "success",
  //             content: error,
  //           });
  //         } else {
  //           message.open({
  //             type: "success",
  //             content: error,
  //           });
  //         }
  //         return response.data;
  //       } catch (error) {
  //         message.open({
  //           type: "error",
  //           content: "Không thể cập nhật trạng thái đơn hàng!",
  //         });
  //       }
  //     },
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({
  //         queryKey: ["ORDERS"],
  //       });
  //     },
  //   });

  const ngayKhongThoiGian = record?.ngay_bat_dau.split(" ")[0];
  const ngayketthucThoiGian = record?.ngay_ket_thuc.split(" ")[0];
  const ngay_bat_dau_suu_tam = record?.ngay_bat_dau_suu_tam.split(" ")[0];

  console.log(record);
  return (
    <div>
      {" "}
      <div onClick={() => setOpen(true)}>
        {" "}
        <div className="max-w-96 grid grid-cols-6  bg-slate-100  rounded-lg hover:shadow-black/30 shadow-lg mx-auto ">
          <div className="px-4 py-5 text-center col-span-2">
            <h2 className="text-gray-700 text-md font-semibold">LÊN TỚI</h2>
            <h1 className="text-red-600 text-lg font-bold">
              {record.giam_gia.toLocaleString()}{" "}
              {record.loai === "tien_mat" ? "VNĐ" : "%"}
            </h1>
            <h2 className="text-gray-700 text-xs font-bold">GLOW CLOTHING</h2>
          </div>

          {/* Phần bên phải: Nội dung clearance sale */}
          <div className="col-span-4 px-4 py-3 bg-gradient-to-r from-slate-400 to-black text-center  rounded-e-lg ">
            <h1 className="text-white text-md font-semibold tracking-tight">
              <h5>{record.mo_ta}</h5>
            </h1>
            <h1 className="text-white text-lg font-extrabold mt-1">
              {record.ma_code}
            </h1>
            <button className="mt-3 px-4 py-1 bg-white text-red-600 font-medium rounded-full hover:bg-gray-100 transition duration-300">
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
      <Modal
        centered
        open={open}
        width={900}
        className=""
        okText="Đồng ý"
        footer={null}
        onCancel={handleCancel}
        closable={false} // Ẩn dấu X
      >
        <div className="max-w-4xl h-[400px] grid grid-cols-6 bg-slate-100 rounded-lg shadow-lg hover:shadow-black/30 mx-auto scale-125">
          <div className="px-4 py-5 text-center col-span-2 my-auto">
            <h2 className="text-gray-700 text-3xl font-bold">LÊN TỚI</h2>
            <h1 className="text-red-600 text-7xl font-black">
              {record.giam_gia.toLocaleString()}
              {record.loai === "tien_mat" ? "VNĐ" : "%"}
            </h1>
            <h2 className="text-gray-700 text-4xl font-bold">
              GLOW <br /> CLOTHING
            </h2>
          </div>

          <div className="col-span-4 px-10 py-10 bg-gradient-to-r from-slate-400 to-black text-center rounded-e-lg ">
            <h1 className="text-white text-xl font-semibold tracking-tight">
              {record.mo_ta}
            </h1>{" "}
            <h1 className="text-white text-xl font-semibold tracking-tight my-3">
              {record?.san_phams.length !== 0
                ? "Áp dụng sản phẩm"
                : record?.danh_mucs.length !== 0
                  ? "Áp dụng danh mục"
                  : "Áp dụng toàn bộ sản phẩm"}
            </h1>
            <h1 className="text-white text-3xl font-extrabold my-7">
              {record.ma_code}
            </h1>
            <div className="grid grid-cols-6 ">
              <div className="col-span-4 text-start">
                <h1 className="text-white text-xl font-semibold tracking-tight">
                  Số lượng : <span>{record?.so_luong} Lượt</span>
                </h1>{" "}
                <h1 className="text-white text-xl font-semibold tracking-tight">
                  Số tiền tối thiểu:{" "}
                  {(record?.chi_tieu_toi_thieu).toLocaleString("vi-VN")} ₫
                </h1>{" "}
                <h1 className="text-white text-xl font-semibold tracking-tight">
                  Ngày bắt đầu sử dụng: {ngay_bat_dau_suu_tam}
                </h1>{" "}
                <h1 className="text-white text-xl font-semibold tracking-tight">
                  {ngayKhongThoiGian} - {ngayketthucThoiGian}
                </h1>
              </div>{" "}
              <div className="col-span-2 text-end">
                <h1 className="text-white text-xl font-semibold tracking-tight">
                  Hạng thành viên
                </h1>{" "}
                <div className="font-bold text-lg text-white leading-tight">
                  {record.hang_thanh_viens.map((item: any, index: number) => (
                    <span key={item.ten_hang_thanh_vien}>
                      {item.ten_hang_thanh_vien}
                      {index < record.hang_thanh_viens.length - 1 && ", "}{" "}
                    </span>
                  ))}
                </div>
                <img src="" alt="" />
              </div>
            </div>
            {/* <button className="mt-3 px-5 py-2 bg-white text-red-600 font-medium rounded-full hover:bg-gray-100 transition duration-300">
              Xem chi tiết
            </button> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Detail;
