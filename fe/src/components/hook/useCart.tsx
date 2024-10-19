import instanceClient from "@/configs/client"; // Giả định đây là axios instance của bạn với cấu hình sẵn
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useLocalStorage } from "./useStoratge";

const useCart = () => {
    const queryClient = useQueryClient();
    const [{ user }] = useLocalStorage("user" as any, {});
    const token = user?.token || localStorage.getItem('token'); // Ưu tiên lấy từ user nếu có, nếu không lấy từ localStorage


    // Fetch giỏ hàng của user
    const { data, ...restQuery } = useQuery({
        queryKey: ["cart", token],
        queryFn: async () => {
            if (!token || !token) {
                toast.error('Người dùng chưa đăng nhập hoặc token không hợp lệ.');
                return { products: [] };
            }


            try {
                const response = await instanceClient.get(`/gio-hang`, {
                    // headers: {
                    //     Authorization: `Bearer ${token}` // Đính kèm token trong header
                    // }

                });
                return response.data.products ? response.data : { products: [] };
            } catch (error) {
                console.error('Error fetching cart data:', error);
                return { products: [] };
            }
        },
        enabled: !!token,
    });

    // Hàm update số lượng (tăng/giảm) hoặc xóa sản phẩm
    const { mutate: updateCart } = useMutation({
        mutationFn: async ({ action, productId, quantity }: { action: string; productId: string; quantity?: number }) => {
            // Tăng hoặc giảm số lượng sản phẩm
            switch (action) {
                case "INCREASE":
                    await instanceClient.put(`/gio-hang/${productId}`, { quantity: quantity ? quantity + 1 : 1 }, {
                        // headers: {
                        //     Authorization: `Bearer ${token}`, // Gửi token trong header
                        // },
                    });
                    break;
                case "DECREASE":
                    if (quantity && quantity > 1) {
                        await instanceClient.put(`/gio-hang/${productId}`, { quantity: quantity - 1 }, {
                            // headers: {
                            //     Authorization: `Bearer ${token}`, // Gửi token trong header
                            // },
                        });
                    } else {
                        toast.error('Số lượng không thể nhỏ hơn 1.');
                    }
                    break;
                case "REMOVE":
                    await instanceClient.delete(`/gio-hang/${productId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`, // Gửi token trong header
                        },
                    });
                    break;
            }
        },
        onSuccess: () => {
            // Khi update thành công, invalidate query để refresh dữ liệu giỏ hàng
            queryClient.invalidateQueries({
                queryKey: ["cart", token],
            });
        },
        onError: (error: any) => {
            console.error('Error updating cart:', error);
            toast.error('Có lỗi xảy ra khi cập nhật giỏ hàng.');
        },
    });

    // Tính tổng giá trị đơn hàng
    const calculateTotal = () => {
        if (!data || !data.products)
            return 0;
        return data?.products?.reduce((total: number, product: { price: number; quantity: number }) => total + product.price * product.quantity, 0);
    };

    return {
        data,
        updateCart,
        calculateTotal,
        ...restQuery,
    };
};

export default useCart;
