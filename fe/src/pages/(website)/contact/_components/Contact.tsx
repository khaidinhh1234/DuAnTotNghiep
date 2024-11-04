import instanceClient from "@/configs/client";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { lienhe } from "@/common/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { lienhetype } from "@/common/types/product";
import { useEffect, useState } from "react";

const ContactPage = ({}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<lienhetype>({
    resolver: zodResolver(lienhe),
  });
  // const { data: websiteInfo } = useQuery({
  //   queryKey: ["websiteInfo"],
  //   queryFn: async () => {
  //     const response = await instanceClient.get("/thong-tin-web");
  //     console.log("Raw API Response:", response.data);
  //     return response.data.data;
  //   },
  // });
  interface WebsiteInfo {
    so_dien_thoai_khieu_nai?: string;
    email?: string;
    dia_chi?: string;
  }
  
  const [websiteInfo, setWebsiteInfo] = useState<WebsiteInfo | null>(null);
  
  useEffect(() => {
    const storedInfo = localStorage.getItem("websiteInfo");
    if (storedInfo) {
      setWebsiteInfo(JSON.parse(storedInfo));
    }
  }, []);

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await instanceClient.post("lienhe", data);
        toast.success("Gửi thông tin thành công");
        return response.data;
      } catch (error) {
        toast.error("Lỗi khi gửi thông tin");
        throw new Error("Lỗi khi gửi thông tin");
      }
    },
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = (data: any) => {
    mutate(data);
    console.log(data);
  };

  return (
    <>
      <main className="py-10">
        <div className="container my-10">
          <div className="grid grid-cols-12 gap-8 mx-14">
            <div className="col-span-12">
              <h1 className="text-4xl font-semibold mb-5 text-center">
                Liên Hệ Chúng Tôi
              </h1>
              <p className="text-lg mb-5 text-center">
                Chúng tôi ở đây để giúp bạn. Nếu bạn có bất kỳ câu hỏi nào hoặc
                cần trợ giúp, vui lòng liên hệ với chúng tôi.
              </p>
              <div className="lg:col-span-6 col-span-12">
                <div className="bg-gray-100 py-5 px-12 rounded-lg w-[700px] mx-auto">
                  <h1 className="text-2xl font-semibold mb-5">
                    Thông Tin Liên Hệ
                  </h1>

                  <div className="flex items-center space-x-3 py-[2px]">
                    <i className="fa-regular fa-phone-volume text-lg" />
                    <span className="text-lg">
                      {" "}
                      {websiteInfo?.so_dien_thoai_khieu_nai || "Đang cập nhật"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 py-[2px]">
                    <i className="fa-light fa-envelope text-lg" />
                    <span className="text-lg">{websiteInfo?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 py-[2px]">
                    <i className="fa-regular fa-location-dot text-lg" />
                    <span className="text-lg mx-3">{websiteInfo?.dia_chi}</span>
                  </div>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col space-y-2">
                  <label htmlFor="name" className="text-lg">
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    placeholder="Tên của bạn"
                    className={`border rounded-lg px-3 py-2 ${
                      errors.name ? "border-red-600" : "border-stone-500"
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="email" className="text-lg">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="Email / Số điện thoại của bạn"
                      className={`border rounded-lg px-3 py-2 ${
                        errors.email ? "border-red-600" : "border-stone-500"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-600 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor="loai_lien_he" className="text-lg">
                      Loại Liên Hệ
                    </label>
                    <select
                      {...register("loai_lien_he")}
                      className="border border-stone-500 rounded-lg px-3 py-2"
                    >
                      <option value="ho_tro">Hỗ trợ</option>
                      <option value="bao_gia">Báo giá</option>
                      <option value="phan_hoi">Phản hồi</option>
                      <option value="thong_bao_san_pham_moi">
                        Thông báo sản phẩm mới
                      </option>
                      <option value="bo_suu_tap">Bộ sưu tập</option>
                      <option value="khac">Khác</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label htmlFor="noi_dung_lien_he" className="text-lg">
                    Tin Nhắn
                  </label>
                  <textarea
                    {...register("noi_dung_lien_he")}
                    rows={5}
                    placeholder="Tin nhắn của bạn"
                    className={`border rounded-lg px-3 py-2 ${
                      errors.noi_dung_lien_he
                        ? "border-red-600"
                        : "border-stone-500"
                    }`}
                  />
                  {errors.noi_dung_lien_he && (
                    <p className="text-red-600 mt-1">
                      {errors.noi_dung_lien_he.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-black lg:text-lg lg:py-2 lg:px-7 py-2 px-5 font-medium rounded-lg"
                >
                  <span>Gửi yêu cầu hỗ trợ</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ContactPage;
