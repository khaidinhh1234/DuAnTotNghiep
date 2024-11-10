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
import { zodResolver } from "@hookform/resolvers/zod";
import { checkout_address } from "@/common/validations/checkout";
import VerificationModal from "./VerificationModal";

const ShippingAddressPage = () => {
  const [trangthai, settrangthai] = useState("Thanh toán khi nhận hàng");

  const [macode, setmacode] = useState(""); // Trạng thái cho mã khuyến mãi

  const [user] = useLocalStorage("user" as any, {});
  const member = user?.user;
  // console.log(member);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(checkout_address),
    defaultValues: {
      ten_nguoi_dat_hang: member?.ho + " " + member?.ten || "",
      so_dien_thoai_nguoi_dat_hang: member?.so_dien_thoai || "",
      dia_chi_nguoi_dat_hang: member?.dia_chi || "",
      email_nguoi_dat_hang: member?.email || "",
      phuong_thuc_thanh_toan: "Thanh toán khi nhận hàng",
    },
  });
  const nav = useNavigate();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<{
    data: { ma_don_hang: string };
  } | null>(null);
  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      console.log(data);
      try {
        // Bước 1: Tạo đơn hàng
        if (trangthai === "Ví tiền") {
          setPendingOrderData(data);
          setShowVerificationModal(true);
          return;
        }

        const order = await instanceClient.post(`don-hang`, data);
        // console.log(order);
        // Bước 2: Thực hiện thanh toán qua MoMo

        if (trangthai !== "Thanh toán khi nhận hàng") {
          const momoPaymentData = {
            phuong_thuc_thanh_toan: trangthai,
            ma_don_hang: order.data.data.ma_don_hang,
            amount: order.data.data.tong_tien_don_hang,
          };
          // console.log(momoPaymentData);
          const response = await instanceClient.post(
            "payment/momo",
            momoPaymentData
          );

          if (response.data && response.data.payUrl) {
            window.location.href = response.data.payUrl; // Chuyển hướng người dùng đến giao diện thanh toán của MoMo
          }
          if (response.status === 200) {
            // message.success("Thanh toán MoMo thành công");
            toast.success("Đặt hàng thành công");
          }
        } else if (trangthai === "Thanh toán khi nhận hàng") {
          toast.success("Đặt hàng thành công");
          nav(`/thankyou?orderId=${order.data.data.ma_don_hang}&resultCode=0`); // Chuyển hướng người dùng đến trang cảm ơn
        } else {
          message.error("Đặt hàng thất bại");
          throw new Error("Error during order creation or MoMo payment");
        }

        return order.data;
      } catch (error) {
        // console.log(error);
        message.error("Đặt hàng thất bại");
        throw new Error("Error during order creation or MoMo payment");
      }
    },
  });

  const onsubmit = (formData: any) => {
    console.log(trangthai);
    // console.log(formData);
    // Kết hợp dữ liệu với mã khuyến mãi
    // Kiểm tra nếu tất cả các trường (ngoại trừ macode) đều có giá trị
    const isDataComplete = Object.entries(formData).every(
      ([key, value]) =>
        key === "macode" || (value !== undefined && value !== null)
    );
    if (isDataComplete) {
      // Gọi hàm mutate với dữ liệu đã kết hợp
      console.log(formData);

      mutate({ ...formData, macode, phuong_thuc_thanh_toan: trangthai });
      reset(); // Reset form sau khi gửi dữ liệu
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
  const handleVerification = async (code: string) => {
    try {
      const orderData = {
        ...pendingOrderData,
        ma_xac_minh: code,
      };

      const order = await instanceClient.post(`don-hang`, orderData);
      toast.success("Đặt hàng thành công");
      nav(`/thankyou?orderId=${order.data.data.ma_don_hang}&resultCode=0`);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!"
      );
    } finally {
      setShowVerificationModal(false);
      setPendingOrderData(null);
    }
  };

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
                  errors={errors}
                  products={products}
                  checkout={checkout}
                  settrangthai={settrangthai}
                />
              </div>
              <Subtotal
                tong_tien={tong_tien}
                Macode={handleCode}
                trangthai={trangthai}
              />
            </div>
          </form>
        </div>
      </section>
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerify={handleVerification}
      />
    </>
  );
};

export default ShippingAddressPage;
