import { checkout_address } from "@/common/validations/checkout";
import { useLocalStorage } from "@/components/hook/useStoratge";
import instanceClient from "@/configs/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddressForm from "./_components/AddAdrres";
import Subtotal from "./_components/subtotail";
import VerificationModal from "./VerificationModal";

const ShippingAddressPage = () => {
  const [trangthai, settrangthai] = useState("Thanh toán khi nhận hàng");
  const [user] = useLocalStorage("user" as any, {});
  const khach = user.user;
  const [macode, setmacode] = useState(""); // Trạng thái cho mã khuyến mãi
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        const response = await instanceClient.post("/cap-nhat-thong-tin");
        return response.data;
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    },
  });
  const khachhang = data?.data?.user;
  // console.log(member);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(checkout_address),
    defaultValues: {
      ten_nguoi_dat_hang: khachhang
        ? khachhang?.ho + " " + khachhang?.ten
        : khach?.ho + " " + khach?.ten,
      so_dien_thoai_nguoi_dat_hang:
        khachhang?.so_dien_thoai ?? khach?.so_dien_thoai,
      dia_chi_nguoi_dat_hang: khachhang?.dia_chi ?? khach?.dia_chi,
      email_nguoi_dat_hang: khachhang?.email || khach?.email,
      phuong_thuc_thanh_toan: "Thanh toán khi nhận hàng",
    },
  });
  const nav = useNavigate();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showPinRegistrationModal, setShowPinRegistrationModal] =
    useState(false);

  const [pendingOrderData, setPendingOrderData] = useState<{
    data: { ma_don_hang: string };
  } | null>(null);
  const { data: walletStatus } = useQuery({
    queryKey: ["walletStatus"],
    queryFn: async () => {
      try {
        const response = await instanceClient.get("/vi-tai-khoan");
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 400) {
          return {
            status: false,
            status_code: 400,
          };
        }
        throw error;
      }
    },
    retry: false,
  });
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => {
      console.log(data);
      try {
        // Bước 1: Tạo đơn hàng
        if (trangthai === "Ví tiền") {
          if (!walletStatus?.status) {
            setShowPinRegistrationModal(true);
            return;
          }
          setPendingOrderData(data);
          setShowVerificationModal(true);
          return;
        }
        const order = await instanceClient.post(`don-hang`, data);
        // Bước 2: Thực hiện thanh toán qua MoMo
        if (trangthai !== "Thanh toán khi nhận hàng") {
          const momoPaymentData = {
            phuong_thuc_thanh_toan: trangthai,
            ma_don_hang: order.data.data.ma_don_hang,
            amount: order.data.data.tong_tien_don_hang,
          }; // console.log(momoPaymentData);
          const response = await instanceClient.post(
            "payment/momo",
            momoPaymentData
          );
          if (response.data && response.data.payUrl) {
            window.location.href = response.data.payUrl; // Chuyển hướng người dùng đến giao diện thanh toán của MoMo
            if (response.status === 200) {
              // message.success("Thanh toán MoMo thành công");
              toast.success("Chờ xử lý thanh toán");
            }
          }
        } else if (trangthai === "Thanh toán khi nhận hàng") {
          toast.success("Đặt hàng thành công");
          nav(`/thankyou?orderId=${order.data.data.ma_don_hang}&resultCode=0`); // Chuyển hướng người dùng đến trang cảm ơn
        } else {
          nav("/mypro/myorder/");
          message.error("Đặt hàng thất bại");
          throw new Error("Error during order creation or MoMo payment");
        }
        return order.data;
      } catch (error) {
        // console.log(error);
        nav("/mypro/myorder/");
        message.error("Đặt hàng thất bại");
        throw new Error("Error during order creation or MoMo payment");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      // message.success("Đặt hàng thành công");
    },
  });
  const handleClosePinModal = () => {
    setShowPinRegistrationModal(false);
  };

  const onsubmit = (formData: any) => {
    // console.log(formData);
    // Kết hợp dữ liệu với mã khuyến mãi
    // Kiểm tra nếu tất cả các trường (ngoại trừ macode) đều có giá trị
    const isDataComplete = Object.entries(formData).every(
      ([key, value]) =>
        key === "macode" || (value !== undefined && value !== null)
    );
    if (isDataComplete) {
      // Gọi hàm mutate với dữ liệu đã kết hợp

      mutate({
        ...formData,
        ma_giam_gia: macode,
        phuong_thuc_thanh_toan: trangthai,
      });
      reset(); // Reset form sau khi gửi dữ liệu
    } else {
      console.log("Dữ liệu chưa đầy đủ");
    }
  };

  const handleCode = (data: any) => {
    setmacode(data ? data : ""); // Cập nhật trạng thái mã khuyến mãi
  };

  const { data: checkout } = useQuery({
    queryKey: ["CART_DETAIL"],
    queryFn: async () => {
      try {
        const response = await instanceClient.get(`/gio-hang/chi-tiet`);
        return response.data;
      } catch (error) {
        // nav("/gio-hang");
        throw new Error("Error fetching cart data");
      }
    },
  });
  console.log(checkout);
  const navigate = useNavigate();
  const tong_tien = checkout?.chi_tiet_don_hang;
  const products = checkout?.chi_tiet_don_hang?.san_pham;
  if (products?.length === 0) {
    navigate("/gio-hang");
    toast.error("Sản phẩm của bạn đã hết hàng ");
    // return null;
  }
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
      nav(
        `/thankyou?orderId=${pendingOrderData?.data.ma_don_hang}&resultCode=1006`
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
                isPending={isPending}
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
      {showPinRegistrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Chưa đăng ký mã PIN</h2>
            <p className="text-gray-600 mb-6">
              Bạn cần đăng ký mã PIN để thực hiện thao tác này
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClosePinModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  nav("/mypro/wallet", {
                    state: { openSettings: true },
                  });
                  handleClosePinModal();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Đăng ký PIN
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShippingAddressPage;
