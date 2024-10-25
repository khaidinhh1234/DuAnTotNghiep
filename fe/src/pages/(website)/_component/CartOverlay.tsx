import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalStorage } from "@/components/hook/useStoratge";
import instance from '@/configs/client';
import { Link } from 'react-router-dom';

interface CartItem {
  id: number;
  ten_san_pham: string;
  gia_hien_tai: number;
  so_luong: number;
  kich_thuoc: string;
  hinh_anh: string;
  mau_sac: string;
}

interface CartData {
  san_pham_giam_gia: CartItem[];
  san_pham_nguyen_gia: CartItem[];
  tong_so_luong: number;
}

interface CartOverlayProps {
  isVisible: boolean;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const CartOverlay: React.FC<CartOverlayProps> = ({ isVisible  }) => {
  const queryClient = useQueryClient();
  const [user] = useLocalStorage("user" as any, {});
  const access_token = user.access_token || localStorage.getItem("access_token");

  const { data: cartData, isLoading,  } = useQuery({
    queryKey: ["cart", access_token],
    queryFn: async () => {
      try {
        const response = await instance.get(`/gio-hang`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error("Error fetching cart data");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await instance.delete(`/gio-hang/${id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
    },
  });

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  if (!isVisible || isLoading) return null;

  // if (isError) {
  //   return (
  //     <div className="absolute top-full right-64 w-3/12 bg-white shadow-lg p-8 rounded-lg z-50 flex flex-col items-center">
  //       <div className="p-6">
  //         <img src="/public/data.png" alt="No Product" className="w-32 h-32" />
  //       </div>
  //       <p className=" text-xl text-gray-700 font-medium">Chưa có dữ liệu</p>
  //     </div>
      
        
  //         );
  // }
  
  
  const allItems = [...(cartData?.san_pham_giam_gia || []), ...(cartData?.san_pham_nguyen_gia || [])];
  const displayItems = allItems.slice(0, 3);
  const totalUniqueProducts = allItems.length;

  const subtotal = displayItems.reduce((sum, item) => sum + item.gia_hien_tai * item.so_luong, 0);
  if (totalUniqueProducts=== 0) {
    return (
<div className="absolute top-full right-64 w-96 bg-white shadow-lg p-8 rounded-lg z-50 flex flex-col items-center">
<h1 className="text-2xl font-bold mb-4">Giỏ hàng</h1>
<p className="text-gray-500 mb-6">Không có sản phẩm trong giỏ hàng.</p>
  <div className="p-6">
    <img src="/public/Shop.png" alt="No Product" className="w-52 h-44" />
  </div>
      
  <button className="w-full bg-black text-white border border-black py-2 px-4 rounded mt-2 hover:bg-white hover:text-black hover:border-gray-300 text-sm">
  Mua sắm ngay
    </button>
</div>

  
    );
  }
  return (
    <div className="absolute top-full right-60 w-85 bg-white shadow-lg p-4 rounded-lg z-50">
    <h2 className="text-lg font-semibold mb-3">Bạn có {totalUniqueProducts} sản phẩm</h2>
    <div className="space-y-5">
      {displayItems.map((item) => (
        <div key={item.id} className="flex items-center py-2 border-b last:border-b-0">
          <img src={item.hinh_anh} alt={item.ten_san_pham} className="w-16 h-16 object-cover mr-3 rounded-[6px]" />
          <div className="flex-grow">
            <Link to={`/product-detail/${item.duong_dan}`}>
              <h3 className="text-sm font-medium hover:text-[#FF7262] truncate">
                {item.ten_san_pham}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 mt-[-10px]">
              {item.so_luong} x {formatCurrency(item.gia_hien_tai)}
            </p>
            <p className="text-xs text-gray-500 mt-[-10px]">Loại: {item.kich_thuoc}, {item.mau_sac}</p>
          </div>
          <button
            className="text-red-500 hover:text-red-700 ml-2"
            onClick={() => handleDelete(item.id)}
            disabled={deleteMutation.isLoading}
          >
            <i className="fa-regular fa-trash-can pr-2"></i>
          </button>
        </div>
      ))}
    </div>
    <div className="text-center mt-1">
      <Link to={`/gio-hang`} className="text-sm font-semibold hover:text-[#FF7262] inline-flex items-center">
        <i className="fa-solid fa-share pr-2"></i> Xem thêm ...
      </Link> 
    </div>
  
    <div className="flex justify-between items-center mt-3 pt-3 border-t">
      <span className="font-semibold">Tổng cộng</span>
      <span className="font-semibold">{formatCurrency(subtotal)}</span>
    </div>
  
    <button className="w-full bg-white text-black border border-gray-300 py-2 px-4 rounded mt-3 hover:bg-black hover:text-white text-sm">
      <a href="/gio-hang">Xem giỏ hàng</a>
    </button>
    <button className="w-full bg-black text-white border border-black py-2 px-4 rounded mt-2 hover:bg-white hover:text-black hover:border-gray-300 text-sm">
      Thanh toán
    </button>
  </div>
  
  );
};

export default CartOverlay;
