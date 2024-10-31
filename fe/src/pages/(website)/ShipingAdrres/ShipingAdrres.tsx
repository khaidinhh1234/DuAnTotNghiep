import { useForm } from "react-hook-form";
import AddressForm from "./_components/AddAdrres";
import ShippingAddress from "./_components/ShippingAddress";
import Subtotal from "./_components/subtotail";
import { useLocalStorage } from "@/components/hook/useStoratge";
import { useMutation, useQuery } from "@tanstack/react-query";
import instanceClient from "@/configs/client";
import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const ShippingAddressPage = () => {
  const [macode, setmacode] = useState(""); // Trạng thái cho mã khuyến mãi
  const [data, setData] = useState<any>({}); // Trạng thái cho dữ liệu giỏ hàng
  const nav = useNavigate();
  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      try {
        const response = await instanceClient.post(`/don-hang`, data);
        message.success("Order successful");
        nav("/thankyou");
        return response.data;
      } catch (error) {
        message.error("Lỗi khi đặt hàng");
        throw new Error("Error fetching cart data");
      }
    },
  });

  const onsubmit = (formData: any) => {
    const combinedData = { ...formData, macode }; // Kết hợp dữ liệu với mã khuyến mãi
    setData(combinedData); // Cập nhật trạng thái dữ liệu giỏ hàng

    // Gọi hàm mutate với dữ liệu đã kết hợp
    mutate(combinedData);
  };

  const handleCode = (data: any) => {
    setmacode(data ? data : ""); // Cập nhật trạng thái mã khuyến mãi
  };
  const { data: checkout } = useQuery({
    queryKey: ["Checkout"],
    queryFn: async () => {
      try {
        const response = await instanceClient.get(`/gio-hang/chi-tiet`);
        return response.data;
      } catch (error) {
        throw new Error("Error fetching cart data");
      }
    },
  });
  const tong_tien = checkout?.chi_tiet_don_hang;
  const products = checkout?.chi_tiet_don_hang?.san_pham;

  const { register, handleSubmit } = useForm();
  return (
    <>
      <section className="container">
        <div className="lg:mx-12 mx-6 lg:my-[84px] my-[42px]">
          <h1 className="h1cart">Đặt hàng</h1>
          <form action="" onSubmit={handleSubmit(onsubmit)}>
            <div className="grid lg:grid-cols-12 lg:gap-20 px-0 justify-center">
              <div className="lg:col-span-6 xl:col-span-8 md:col-span-4 md:w-full w-[425px]">
                {/* <ShippingAddress /> */}
                <AddressForm
                  register={register}
                  products={products}
                  checkout={checkout}
                />
              </div>
              <Subtotal tong_tien={tong_tien} Macode={handleCode} />
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default ShippingAddressPage;
