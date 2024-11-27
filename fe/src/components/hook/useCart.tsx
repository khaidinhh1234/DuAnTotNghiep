import instanceClient from "@/configs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useLocalStorage } from "./useStoratge";

const useCart = () => {
  const queryClient = useQueryClient();
  const [{ user }] = useLocalStorage("user" as any, {});
  const token = user?.token || localStorage.getItem("token");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["cart", token],
    queryFn: async () => {
      // ...
      try {
        const response = await instanceClient.get(`/gio-hang`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data; // Trả về response.data thay vì response.data.products
      } catch (error) {
        toast.error("Không thể lấy dữ liệu giỏ hàng.");
        return { data: [] }; // Trả về dữ liệu mặc định là mảng rỗng
      }
    },
    enabled: !!token,
  });

  // Update cart (increase, decrease, remove)
  const { mutate: updateCart } = useMutation({
    mutationFn: async ({
      action,
      productId,
      quantity,
    }: {
      action: string;
      productId: string;
      quantity?: number;
    }) => {
      try {
        switch (action) {
          case "INCREASE":
            await instanceClient.put(`/gio-hang/${productId}`, {
              so_luong: quantity ? quantity + 1 : 1,
            });
            break;
          case "DECREASE":
            if (quantity && quantity > 1) {
              await instanceClient.put(`/gio-hang/${productId}`, {
                so_luong: quantity - 1,
              });
            } else {
              toast.error("Số lượng không thể nhỏ hơn 1.");
            }
            break;
          case "REMOVE":
            await instanceClient.delete(`/gio-hang/${productId}`);
            break;
          default:
            throw new Error("Hành động không hợp lệ");
        }
      } catch (error) {
        console.error("Error updating cart:", error);
        throw new Error("Có lỗi xảy ra khi cập nhật giỏ hàng."); // Rethrow error for onError handling
      }
    },
    onSuccess: () => {
      // Invalidate query to refresh cart data
      queryClient.invalidateQueries({ queryKey: ["cart", token] });
    },
    onError: (error: any) => {
      console.error("Error updating cart:", error);
      toast.error(error.message || "Có lỗi xảy ra khi cập nhật giỏ hàng.");
    },
  });

  // Calculate the total price of the cart
  const calculateTotal = () => {
    if (!data || !data.products) return 0;
    return data.products.reduce(
      (total: number, product: { gia: number; so_luong: number }) =>
        total + product.gia * product.so_luong,
      0
    );
  };

  return {
    data,
    isLoading,
    isError,
    error,
    updateCart,
    calculateTotal,
    refetch, // Optional: expose refetch method to refresh data manually
  };
};

export default useCart;
