import instanceClient from "@/configs/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SettingsModal from "./RegisterWalletPassword";

function TaiChinh() {
  const queryParams = new URLSearchParams(window.location.search);
  const resultCode = parseInt(queryParams.get("resultCode") ?? "0", 10);
  const orderId = queryParams.get("orderId");
  const partnerCode = queryParams.get("partnerCode");
  const amount = parseInt(queryParams.get("amount") ?? "0", 10);
  const requestId = queryParams.get("requestId");
  const orderInfo = queryParams.get("orderInfo");
  const orderType = queryParams.get("orderType");
  const transId = queryParams.get("transId");
  const payType = queryParams.get("payType");
  const signature = queryParams.get("signature");
  const datas = {
    resultCode: resultCode,
    partnerCode: partnerCode,
    orderId: orderId,
    amount: amount,
    requestId: requestId,
    orderInfo: orderInfo,
    orderType: orderType,
    transId: transId,
    payType: payType,
    signature: signature,
  };
  console.log(datas);

  const confirmPayment = useMutation({
    mutationKey: ["payment-confirmation", orderId],
    mutationFn: async () => {
      const response = await instanceClient.post(`/xac-nhan-nap-tien`, {
        orderId: orderId,
        resultCode: resultCode,
        amount: amount,
      });
      return response.data;
    },
    onSuccess: () => {
      if (resultCode === 0) {
        toast.success("Nạp tiền thành công");
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Nạp tiền thất bại");
    },
  });

  useEffect(() => {
    const shouldConfirm =
      orderId && !sessionStorage.getItem(`payment-${orderId}`);

    if (shouldConfirm) {
      sessionStorage.setItem(`payment-${orderId}`, "confirmed");
      confirmPayment.mutate();
    }
  }, [orderId]);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pins, setPins] = useState(["", "", "", "", "", ""]);
  const [showForgotPinModal, setShowForgotPinModal] = useState(false);
  const [storedVerificationCode, setStoredVerificationCode] = useState(() =>
    localStorage.getItem("walletVerificationCode")
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: walletStatus,
    isSuccess,
    refetch: refetchWalletStatus,
  } = useQuery({
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

  useEffect(() => {
    if (isSuccess && walletStatus?.status === false) {
      setIsSettingsOpen(true);
    }
  }, [walletStatus, isSuccess]);

  const { data: walletData } = useQuery({
    queryKey: ["walletData", storedVerificationCode],
    queryFn: async () => {
      if (!storedVerificationCode) return null;
      const response = await instanceClient.post("/vi-tai-khoan", {
        ma_xac_minh: storedVerificationCode,
      });
      return response.data;
    },
    enabled: !!storedVerificationCode,
    staleTime: 5 * 60 * 1000,
  });

  const forgotPinMutation = useMutation({
    mutationFn: async () => {
      const response = await instanceClient.get("/quen-ma-xac-minh");
      return response.data;
    },
    onSuccess: () => {
      toast.success("Yêu cầu lấy lại mã PIN đã được gửi đến email của bạn");
      setShowForgotPinModal(false);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
      toast.error(errorMessage);
    },
  });

  const verifyWalletMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await instanceClient.post("/vi-tai-khoan", {
        ma_xac_minh: code,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const verificationCode = pins.join("");
      localStorage.setItem("walletVerificationCode", verificationCode);
      setStoredVerificationCode(verificationCode);
      queryClient.setQueryData(["walletData", verificationCode], data);
      setPins(["", "", "", "", "", ""]);
    },
    onError: (error: any) => {
      localStorage.removeItem("walletVerificationCode");
      setStoredVerificationCode(null);
      toast.error(error.response?.data?.message || "Mã xác minh không đúng");
      setPins(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
  });

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPins = [...pins];
    newPins[index] = value;
    setPins(newPins);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pins[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerification = () => {
    const code = pins.join("");
    if (code.length === 6) {
      verifyWalletMutation.mutate(code);
    }
  };
  const handleRegisterSuccess = async (code: string) => {
    setStoredVerificationCode(code);
    await refetchWalletStatus();
    queryClient.invalidateQueries({ queryKey: ["walletData", code] });
  };
  return (
    <div className="p-4 min-h-screen">
      <div className="flex items-center align-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Tài chính</h1>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="hover:text-gray-700"
        >
          <i className="fa-regular fa-gear"></i>
        </button>
      </div>

      {walletStatus?.status && !storedVerificationCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Xác nhận mã pin ví</h2>
              <button
                onClick={() => navigate("/mypro/myprofile")}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Vui lòng nhập mã pin ví gồm 6 chữ số
            </p>

            <div className="mb-6">
              <div className="flex justify-between space-x-2">
                {pins.map((pin, index) => (
                  <input
                    key={index}
                    type="password"
                    maxLength={1}
                    value={pin}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-10 text-center text-2xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ))}
              </div>

              <button
                onClick={() => setShowForgotPinModal(true)}
                className="text-blue-600 hover:text-blue-800 text-sm mt-4 block"
              >
                Quên mã pin?
              </button>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => navigate("/mypro/myprofile")}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Thoát
              </button>
              <button
                onClick={handleVerification}
                disabled={
                  pins.some((pin) => !pin) || verifyWalletMutation.isPending
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {verifyWalletMutation.isPending ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showForgotPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Xác nhận quên mã pin</h2>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn lấy lại mã pin? Chúng tôi sẽ gửi đến email
              của bạn.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowForgotPinModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={() => forgotPinMutation.mutate()}
                disabled={forgotPinMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {forgotPinMutation.isPending ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        status={walletStatus?.status}
        onRegisterSuccess={handleRegisterSuccess}
      />
      {walletData?.data && (
        <>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-120">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Tổng số dư</span>
              <div className="flex space-x-2">
                <Link to="/mypro/naptien">
                  <button className="bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-orange-600 active:bg-orange-700">
                    Nạp tiền
                  </button>
                </Link>
                <Link to="/mypro/bank">
                  <button className="bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-orange-600 active:bg-orange-700">
                    Rút tiền
                  </button>
                </Link>
              </div>
            </div>

            <div className="text-red-500 text-4xl font-semibold my-4">
              {walletData.data?.viUser?.so_du?.toLocaleString() ?? 0}₫
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm mt-6 border border-gray-120">
            <h2 className="text-lg font-semibold mb-4">Lịch sử Giao Dịch</h2>
            {walletData.data?.viUser?.lich_su_giao_dichs?.length > 0 ? (
              <ul className="max-h-[400px] overflow-y-auto">
                {walletData.data?.viUser?.lich_su_giao_dichs
                  ?.sort(
                    (a: any, b: any) =>
                      new Date(b.ngay_thay_doi).getTime() -
                      new Date(a.ngay_thay_doi).getTime()
                  )
                  .map((transaction: any, index: number) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b py-2"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {transaction?.mo_ta}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction?.ngay_thay_doi).toLocaleString(
                            "vi-VN",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        {transaction?.so_du_sau - transaction?.so_du_truoc > 0
                          ? "+"
                          : ""}
                        {(
                          transaction?.so_du_sau - transaction?.so_du_truoc
                        ).toLocaleString()}
                        đ
                      </p>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">
                Không có giao dịch nào
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TaiChinh;
