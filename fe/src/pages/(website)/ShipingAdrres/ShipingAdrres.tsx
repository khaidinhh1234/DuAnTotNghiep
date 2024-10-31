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
import { toast } from "react-toastify";

const ShippingAddressPage = () => {
  const [macode, setmacode] = useState(""); // Trạng thái cho mã khuyến mãi

  const nav = useNavigate();
  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      console.log(data);
      try {
        // Bước 1: Tạo đơn hàng
        const order = await instanceClient.post(`don-hang`, data);
        console.log(order);

        const orderID = await instanceClient.post(
          `don-hang/${order.data.don_hang.ma_don_hang}`
        );
        console.log(orderID.data);
        message.success("Đặt hàng thành công");
        // Bước 2: Thực hiện thanh toán qua MoMo
        const momoPaymentData = {
          phuong_thuc_thanh_toan: "Momo_ATM",
          // order.data.phuong_thuc_thanh_toan,
          ma_don_hang: order.data.don_hang.ma_don_hang,
          // orderID.data.don_hang.ma_don_hang, // sử dụng orderId từ phản hồi đơn hàng nếu có
          amount: 120303124,
          // orderID.data.don_hang.tong_tien_don_hang, // tổng tiền từ dữ liệu đầu vào
          // các trường khác nếu cần cho API thanh toán MoMo
        };

        const response = await instanceClient.post(
          "payment/momo",
          momoPaymentData
        );
        {
          response.data.payUrl
            ? (window.location.href = response.data.payUrl)
            : toast.error("Thanh toán thất bại");
        }

        // if (momoResponse.data && momoResponse.data.payUrl) {
        //   window.location.href = momoResponse.data.payUrl; // Chuyển hướng người dùng đến giao diện thanh toán của MoMo
        // }
        // if (momoResponse.status === 200) {
        //   message.success("Thanh toán MoMo thành công");
        //   nav("/thankyou");
        // } else {
        //   message.error("Thanh toán MoMo thất bại");
        // }
        // console.log(order);
        return order.data;
      } catch (error) {
        console.log(error);
        message.error("Lỗi khi đặt hàng hoặc thanh toán MoMo");
        throw new Error("Error during order creation or MoMo payment");
      }
    },
  });

  const onsubmit = (formData: any) => {
    // Kết hợp dữ liệu với mã khuyến mãi

    // Kiểm tra nếu tất cả các trường (ngoại trừ macode) đều có giá trị
    const isDataComplete = Object.entries(formData).every(
      ([key, value]) =>
        key === "macode" ||
        (value !== undefined && value !== null && value !== "")
    );

    if (isDataComplete) {
      // Gọi hàm mutate với dữ liệu đã kết hợp
      mutate({ ...formData, macode });
    } else {
      console.log("Dữ liệu chưa đầy đủ");
    }
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
