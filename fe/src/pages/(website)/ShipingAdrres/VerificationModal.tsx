import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import instanceClient from "@/configs/client";
import { toast } from "react-toastify";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (code: string) => void;
}

const VerificationModal = ({
  isOpen,
  onClose,
  onVerify,
}: VerificationModalProps) => {
  const [pins, setPins] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      onVerify(code);
      setPins(["", "", "", "", "", ""]);
    }
  };

  const forgotPinMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await instanceClient.get("/quen-ma-xac-minh");
        return response.data;
      } catch (error: any) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess: () => {
      toast.success("Yêu cầu lấy lại mã PIN đã được gửi đến email của bạn");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!";
      toast.error(errorMessage);
    },
  });

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${!isOpen && "hidden"}`}
    >
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Xác nhận mật khẩu ví</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Vui lòng nhập mật khẩu ví gồm 6 chữ số
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
            onClick={() => forgotPinMutation.mutate()}
            className="text-blue-600 hover:text-blue-800 text-sm mt-4 block"
          >
            Quên mật khẩu?
          </button>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Thoát
          </button>
          <button
            onClick={handleVerification}
            disabled={pins.some((pin) => !pin)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
