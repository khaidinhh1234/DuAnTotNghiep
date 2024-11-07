import { useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import instanceClient from "@/configs/client";

interface PaymentStatusProps {
  onPaymentSuccess: () => void;
  onPaymentFailure: () => void;
}

function PaymentStatus({ onPaymentSuccess, onPaymentFailure }: PaymentStatusProps) {
  const queryParams = new URLSearchParams(window.location.search);
  const resultCode = parseInt(queryParams.get("resultCode") ?? "0", 10);
  const orderId = queryParams.get("orderId");
  const amount = parseInt(queryParams.get("amount") ?? "0", 10);

  const { data } = useQuery({
    queryKey: ["checkbill"],
    queryFn: async () => {
      if (resultCode === 0) {
        const response = await instanceClient.post(`/xac-nhan-nap-tien`, {
          orderId,
          resultCode,
          amount,
        });
        onPaymentSuccess();
        return response.data;
      }
      if (resultCode !== 0) {
        onPaymentFailure();
      }
    },
  });

  return null;
}


export default PaymentStatus;
