import { useLocalStorage } from "@/components/hook/useStoratge";
import instanceClient from "@/configs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Popconfirm } from "antd";
import { FastForward, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Test2 = () => {
    const nav = useNavigate();
    const queryClient = useQueryClient();
    const [user] = useLocalStorage("user" as any, {});
    const access_token = user.access_token || localStorage.getItem("access_token");
    const [selectedProducts, setSelectedProducts] = useState<string[]>(() => {
        const savedSelectedProducts = localStorage.getItem("selectedProducts");
        return savedSelectedProducts ? JSON.parse(savedSelectedProducts) : [];
    });
    const [fadeEffect, setFadeEffect] = useState<{ [key: string]: boolean }>({});
    const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});

    const { data } = useQuery({
        queryKey: ["cart", access_token],
        queryFn: async () => {
            try {
                const response = await instanceClient.get(`/gio-hang`, {
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
    const { mutate: increaseQuantity } = useMutation({
        mutationFn: async ({ productId, currentQuantity }: { productId: string; currentQuantity: number }) => {
            setIsProcessing((prev) => ({ ...prev, [productId]: true })); // Khóa hành động
            await instanceClient.put(
                `/gio-hang/tang-so-luong/${productId}`,
                { so_luong: currentQuantity + 1 },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
        },
        onSuccess: (_, { productId }) => {
            setFadeEffect((prev) => ({ ...prev, [productId]: true }));
            setTimeout(() => {
                setFadeEffect((prev) => ({ ...prev, [productId]: false }));
                setIsProcessing((prev) => ({ ...prev, [productId]: false }));
            }, 500);

            queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
        },
        onError: (_, { productId }) => {
            setIsProcessing((prev) => ({ ...prev, [productId]: false }));
            toast.error("Có lỗi xảy ra khi tăng số lượng.");
        },
    });


    const { mutate: decreaseQuantity } = useMutation({
        mutationFn: async ({ productId, currentQuantity }: { productId: string; currentQuantity: number }) => {
            setIsProcessing((prev) => ({ ...prev, [productId]: true }));
            await instanceClient.put(
                `/gio-hang/giam-so-luong/${productId}`,
                { so_luong: currentQuantity - 1 },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
        },
        onSuccess: (_, { productId }) => {
            setFadeEffect((prev) => ({ ...prev, [productId]: true }));
            setTimeout(() => {
                setFadeEffect((prev) => ({ ...prev, [productId]: false }));
                setIsProcessing((prev) => ({ ...prev, [productId]: false }));
            }, 500);

            queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
        },
        onError: (_, { productId }) => {
            setIsProcessing((prev) => ({ ...prev, [productId]: false }));
            toast.error("Có lỗi xảy ra khi giảm số lượng.");
        },
    });

    const { mutate: Delete } = useMutation({
        mutationFn: async (productId: string) => {
            await instanceClient.delete(`/gio-hang/${productId}`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
            toast.success("Xóa sản phẩm thành công.");
        },
        onError: (error: any) => {
            toast.error(error.message || "Có lỗi xảy ra khi xóa sản phẩm.");
        },
    });
    // tiet kiem
    const totalSavings = useMemo(() => {
        return data?.san_pham_giam_gia
            .filter((product: any) => selectedProducts.includes(product.id))
            .reduce((sum: number, product: any) => sum + product.tiet_kiem, 0);
    }, [data, selectedProducts]);
    // tong sanpham
    const tongSoLuong = useMemo(() => {
        return (
            data?.san_pham_giam_gia
                .filter((product: any) => selectedProducts.includes(product.id))
                .reduce((sum: number, product: any) => sum + product.so_luong, 0) +
            data?.san_pham_nguyen_gia
                .filter((product: any) => selectedProducts.includes(product.id))
                .reduce((sum: number, product: any) => sum + product.so_luong, 0)
        );
    }, [data, selectedProducts]);

    // Tính tổng tiền
    const totalSelectedPrice = selectedProducts.reduce((total, productId) => {
        const productInDiscounts = data?.san_pham_giam_gia.find(
            (product: any) => product.id === productId
        );
        const productInRegular = data?.san_pham_nguyen_gia.find(
            (product: { id: number }) => product.id === Number(productId)
        );

        // Đặt mặc định là 1 nếu không tìm thấy số lượng
        const quantity = (productInDiscounts?.so_luong || productInRegular?.so_luong) || 1;

        if (productInDiscounts) {
            return total + productInDiscounts.gia_hien_tai * quantity;
        }

        if (productInRegular) {
            return total + productInRegular.gia_hien_tai * quantity;
        }

        return total; // Nếu không có sản phẩm nào, trả về tổng không thay đổi
    }, 0);
    // Tính tổng tiền cuối cùng (bao gồm phí giao hàng)
    const shippingFee = totalSelectedPrice > 498000 ? 0 : 20000;
    const finalTotal = totalSelectedPrice + shippingFee;
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const handleCheckout = () => {
        if (!data?.san_pham_giam_gia.length && !data?.san_pham_nguyen_gia.length) {
            toast.error(
                "Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán."
            );
            return;
        }
        // Kiểm tra xem có sản phẩm nào được chọn hay không
        if (!selectedProducts.length) {
            toast.error("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
            return;
        }
        nav("/shippingAddressPage");
    };
    const handleRemoveProduct = (productId: string) => {
        Delete(productId);
    };

    // Xử lý khi chọn tất cả
    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked) {
            const allProductIds = [
                ...data?.san_pham_giam_gia.map((product: any) => product.id),
                ...data?.san_pham_nguyen_gia.map((product: any) => product.id),
            ];
            setSelectedProducts(allProductIds);
            localStorage.setItem('selectedProducts', JSON.stringify(allProductIds));
            // Gọi SelectedProduct với tất cả ID
            SelectedProduct({ gioHangIds: allProductIds, isChecked: true });
        } else {
            const allProductIds = [
                ...data?.san_pham_giam_gia.map((product: any) => product.id),
                ...data?.san_pham_nguyen_gia.map((product: any) => product.id),
            ];
            setSelectedProducts([]); // Cập nhật trạng thái không chọn
            localStorage.setItem('selectedProducts', JSON.stringify([]));
            // Gọi SelectedProduct với tất cả ID và trạng thái không chọn
            SelectedProduct({ gioHangIds: allProductIds, isChecked: false });
        }
    };

    // chọn sản phẩm
    const { mutate: SelectedProduct } = useMutation({
        mutationFn: async ({
            gioHangIds,
            isChecked,
        }: {
            gioHangIds: string[];
            isChecked: boolean;
        }) => {
            await instanceClient.post(
                `/gio-hang/chon-san-pham`,
                { gio_hang_ids: gioHangIds, chon: isChecked ? 1 : 0 },
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Có lỗi xảy ra khi chọn sản phẩm.");
        },
    });

    const handleSelectProduct = (productId: string) => {
        const isChecked = selectedProducts.includes(productId);
        // Cập nhật trạng thái selectedProducts
        const updatedSelectedProducts = isChecked
            ? selectedProducts.filter((id) => id !== productId) // Bỏ chọn sản phẩm
            : [...selectedProducts, productId]; // Chọn sản phẩm
        setSelectedProducts(updatedSelectedProducts);
        console.log("check:", isChecked);
        // Gọi SelectedProduct với danh sách mới và trạng thái đã chọn ngược lại
        SelectedProduct({ gioHangIds: [productId], isChecked: !isChecked });
        localStorage.setItem(
            "selectedProducts",
            JSON.stringify(updatedSelectedProducts)
        );
    };
    useEffect(() => {
        // Retrieve saved selection from localStorage on component mount
        const savedSelectedProducts = localStorage.getItem("selectedProducts");
        if (savedSelectedProducts) {
            setSelectedProducts(JSON.parse(savedSelectedProducts));
        }
    }, []);

    // Tải sản phẩm từ localStorage khi component khởi tạo
    useEffect(() => {
        const storedProducts = localStorage.getItem("selectedProducts");
        if (storedProducts) {
            setSelectedProducts(JSON.parse(storedProducts));
        }
    }, []);

    // Lưu sản phẩm vào localStorage khi có sự thay đổi
    useEffect(() => {
        localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
    }, [selectedProducts]);
    // 
    useEffect(() => {
        if (data) {
            const preSelectedProducts = [
                ...(data.san_pham_giam_gia?.filter((p: any) => p.chon === 1) || []).map((p: any) => p.id),
                ...(data.san_pham_nguyen_gia?.filter((p: any) => p.chon === 1) || []).map((p: any) => p.id)
            ];

            if (preSelectedProducts.length > 0) {
                setSelectedProducts(prev => Array.from(new Set([...prev, ...preSelectedProducts])));
            }
        }
    }, [data]);

    return (
        <>
            {data?.san_pham_giam_gia?.length === 0 &&
                data?.san_pham_nguyen_gia?.length === 0 &&
                data?.san_pham_het_hang?.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-32 pb-20">
                    <img
                        src="https://m.yodycdn.com/web/prod/_next/static/media/cart-empty.250eba9c.svg"
                        alt="No products"
                        className="w-[600px] h-[200px] md:w-[500px] md:h-[400px] object-cover"
                    />
                    <Link
                        to="/shop"
                        // className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600 transition duration-200"
                        className="px-20 py-4 mt-4 btn-black rounded-lg mb-4 w-[320px] h-[56px] font-semibold transition duration-200"
                    >
                        Quay lại cửa hàng
                    </Link>
                </div>
            ) : (
                <section className="container">
                    <div className="lg:mx-12 mx-6 lg:my-[84px] my-[42px]">
                        <h1 className="h1cart">Giỏ hàng</h1>
                        <div className="grid lg:grid-cols-12 gap-4 px-0 justify-center">
                            <div className="lg:col-span-8 col-span-6 md:px-0 px-3">
                                <div className="bg-white shadow-md rounded-lg p-6 mb-8 w-[770px]">
                                    <p className="font-bold text-black">
                                        {totalSelectedPrice >= 500000 ? (
                                            <>Chúc mừng! Đơn hàng của bạn được <span className="text-black">Miễn phí vận chuyển</span></>
                                        ) : (
                                            <>Thêm {formatCurrency(500000 - totalSelectedPrice)} để được <span className="text-black">Miễn phí vận chuyển</span></>
                                        )}
                                    </p>

                                    <div className="relative bg-gray-100 rounded-full h-2 mt-3">
                                        <div
                                            className={`h-full ${totalSelectedPrice >= 500000 ? 'bg-green-500' : 'bg-yellow-400'}`}
                                            style={{
                                                width: `${Math.min((totalSelectedPrice / 500000) * 100, 100)}%`,
                                            }}
                                        >
                                            <div
                                                className="absolute top-0 flex items-center justify-center"
                                                style={{
                                                    left: `${Math.min((totalSelectedPrice / 500000) * 100, 100)}%`,
                                                    transform: 'translate(-40%, -40%)',
                                                    zIndex: 10,
                                                }}
                                            >
                                                <div
                                                    className={`w-8 h-8 rounded-full ${totalSelectedPrice >= 500000 ? 'bg-green-200' : 'bg-yellow-200'} flex items-center justify-center`}>
                                                    <Star className={`text-${totalSelectedPrice >= 500000 ? 'green' : 'yellow'}-500`} size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid lg:grid-cols-12 gap-6 justify-center">
                                    {/* Sản phẩm */}
                                    <div className="lg:col-span-8 col-span-12">
                                        {/* Danh mục sản phẩm giảm giá */}
                                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                                            <div className="flex items-center mb-4">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        [...(data?.san_pham_giam_gia ?? [])].every(product => product.chon === 1)
                                                    }
                                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                                    className="form-checkbox h-5 w-5 text-yellow-500"
                                                    title="Select all discounted products"
                                                />
                                                <h2 className="font-bold text-xl mb-0 ml-2">Đang được giảm giá</h2>
                                            </div>

                                            {data?.san_pham_giam_gia.map((product: any) => (
                                                <div
                                                    key={product.id}
                                                    className="flex justify-between items-center border-b py-4"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedProducts.includes(product.id)}
                                                            //   onChange={() => handleCheckboxChange(product.id)}
                                                            className="form-checkbox h-5 w-5 text-yellow-500"
                                                            title={`Select ${product.ten_san_pham}`}
                                                        />
                                                        <img
                                                            src={product.hinh_anh}
                                                            alt="Ảnh sản phẩm"
                                                            className="w-20 h-20 object-cover rounded-md"
                                                        />
                                                        <div>
                                                            <h3 className="font-semibold">{product.ten_san_pham}</h3>
                                                            <p className="text-sm text-gray-500">
                                                                {product.mau_sac}, {product.kich_thuoc}
                                                            </p>
                                                            <div className="flex items-center">
                                                                <p className="text-red-500 font-bold mr-2">
                                                                    {formatCurrency(product.gia_hien_tai)}
                                                                </p>
                                                                <p className="text-gray-400 line-through">
                                                                    {formatCurrency(product.gia_cu)}
                                                                </p>
                                                            </div>
                                                            <p className="text-xs text-red-500 font-semibold">
                                                                Đã tiết kiệm {formatCurrency(product.tiet_kiem)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => decreaseQuantity(product.id)}
                                                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                                                            disabled={product.so_luong <= 1}
                                                        >
                                                            <i className="fa-solid fa-minus"></i>
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={product.so_luong}
                                                            className="w-10 text-center border rounded-md"
                                                            readOnly
                                                        />
                                                        <button
                                                            onClick={() => increaseQuantity(product.id)}
                                                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                                                            disabled={product.so_luong >= product.so_luong_bien_the}
                                                        >
                                                            <i className="fa-solid fa-plus"></i>
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => Delete(product.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <i className="fa-regular fa-trash-can"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Danh mục sản phẩm nguyên giá */}
                                        <div className="bg-white p-6 rounded-lg shadow-md">
                                            <div className="flex items-center mb-4">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        [...(data?.san_pham_nguyen_gia?? [])].every(product => product.chon === 1)
                                                    }
                                                    // onChange={(e) => handleSelectAll(e.target.checked)}
                                                    className="form-checkbox h-5 w-5 text-blue-500"
                                                    title="Select all regular priced products"
                                                />
                                                <h2 className="font-bold text-xl mb-0 ml-2">Sản phẩm nguyên giá</h2>
                                            </div>

                                            {data?.san_pham_nguyen_gia.map((product: any) => (
                                                <div
                                                    key={product.id}
                                                    className="flex justify-between items-center border-b py-4"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedProducts.includes(product.id)}
                                                            //   onChange={() => handleCheckboxChange(product.id)}
                                                            className="form-checkbox h-5 w-5 text-blue-500"
                                                            title={`Select ${product.ten_san_pham}`}
                                                        />
                                                        <img
                                                            src={product.hinh_anh}
                                                            alt="Ảnh sản phẩm"
                                                            className="w-20 h-20 object-cover rounded-md"
                                                        />
                                                        <div>
                                                            <h3 className="font-semibold">{product.ten_san_pham}</h3>
                                                            <p className="text-sm text-gray-500">
                                                                {product.mau_sac}, {product.kich_thuoc}
                                                            </p>
                                                            <p className="text-gray-700 font-semibold">
                                                                {formatCurrency(product.gia_hien_tai)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => decreaseQuantity(product.id)}
                                                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                                                            disabled={product.so_luong <= 1}
                                                        >
                                                            <i className="fa-solid fa-minus"></i>
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={product.so_luong}
                                                            className="w-10 text-center border rounded-md"
                                                            readOnly
                                                        />
                                                        <button
                                                            onClick={() => increaseQuantity(product.id)}
                                                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                                                            disabled={product.so_luong >= product.so_luong_bien_the}
                                                        >
                                                            <i className="fa-solid fa-plus"></i>
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => Delete(product.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <i className="fa-regular fa-trash-can"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                                            <div className="flex items-center mb-4">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        [...(data?.san_pham_het_hang ?? [])].every(product => selectedProducts.includes(product.id))
                                                    }
                                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                                    className="form-checkbox h-5 w-5 text-yellow-500"
                                                    title="Select all discounted products"
                                                />
                                                <h2 className="font-bold text-xl mb-0 ml-2">Đang được giảm giá</h2>
                                            </div>

                                            {data?.san_pham_het_hang.map((product: any) => (
                                                <div
                                                    key={product.id}
                                                    className="flex justify-between items-center border-b py-4"
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedProducts.includes(product.id)}
                                                            //   onChange={() => handleCheckboxChange(product.id)}
                                                            className="form-checkbox h-5 w-5 text-yellow-500"
                                                            title={`Select ${product.ten_san_pham}`}
                                                        />
                                                        <img
                                                            src={product.hinh_anh}
                                                            alt="Ảnh sản phẩm"
                                                            className="w-20 h-20 object-cover rounded-md"
                                                        />
                                                        <div>
                                                            <h3 className="font-semibold">{product.ten_san_pham}</h3>
                                                            <p className="text-sm text-gray-500">
                                                                {product.mau_sac}, {product.kich_thuoc}
                                                            </p>
                                                            <div className="flex items-center">
                                                                <p className="text-red-500 font-bold mr-2">
                                                                    {formatCurrency(product.gia_hien_tai)}
                                                                </p>
                                                                <p className="text-gray-400 line-through">
                                                                    {formatCurrency(product.gia_cu)}
                                                                </p>
                                                            </div>
                                                            <p className="text-xs text-red-500 font-semibold">
                                                                Đã tiết kiệm {formatCurrency(product.tiet_kiem)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => decreaseQuantity(product.id)}
                                                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                                                            disabled={product.so_luong <= 1}
                                                        >
                                                            <i className="fa-solid fa-minus"></i>
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={product.so_luong}
                                                            className="w-10 text-center border rounded-md"
                                                            readOnly
                                                        />
                                                        <button
                                                            onClick={() => increaseQuantity(product.id)}
                                                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                                                            disabled={product.so_luong >= product.so_luong_bien_the}
                                                        >
                                                            <i className="fa-solid fa-plus"></i>
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => Delete(product.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <i className="fa-regular fa-trash-can"></i>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* CHI TIẾT */}
                            <div className="lg:col-span-4 col-span-6">
                                <div className="border px-4 py-1 lg:w-[359px] rounded-md">
                                    <h1 className="text-xl font-bold mt-4">Chi tiết đơn hàng</h1>
                                    {selectedProducts.length === 0 ? (
                                        <div className="text-center my-4">
                                            <img
                                                src="https://m.yodycdn.com/web/prod/_next/static/media/cart-empty.250eba9c.svg"
                                                alt="Empty cart"
                                                className="mx-auto my-4"
                                            />
                                            <p className="text-gray-500 mb-4">
                                                Vui lòng chọn các sản phẩm trong giỏ hàng trước khi thanh toán.
                                            </p>
                                            <Button
                                                disabled
                                                className="bg-gray-300 cursor-not-allowed rounded-lg mb-4 w-[320px] h-[56px] font-semibold"
                                            >
                                                Mua hàng
                                            </Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex justify-between font-bold border-b border-hrBlack">
                                                <h4>Tổng giá trị sản phẩm</h4>
                                                <span className="px-2">
                                                    {totalSelectedPrice.toLocaleString("vn-VN")} ₫
                                                </span>
                                            </div>
                                            <div className="py-4">
                                                <div className="flex justify-between font-medium">
                                                    <p>Tiết kiệm</p>
                                                    <span className="px-2 text-red-500">
                                                        {totalSavings ? totalSavings.toLocaleString("vn-VN") : "0"} ₫
                                                    </span>
                                                </div>

                                                <div className="flex justify-between font-medium mb-0">
                                                    <p>Phí giao hàng</p>
                                                    <span className="px-2">{formatCurrency(20000)}</span>
                                                </div>
                                                {totalSelectedPrice > 498000 && (
                                                    <div className="flex justify-between font-medium border-b border-hrBlack">
                                                        <p>Giảm giá vận chuyển</p>
                                                        <span className="px-2 text-red-500">
                                                            - {formatCurrency(20000)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex justify-between font-bold mb-8">
                                                <h4>Tổng cộng</h4>
                                                <span>{formatCurrency(finalTotal)}</span>
                                            </div>
                                            <div className="flex justify-center">
                                                <Link to="/shippingAddressPage">
                                                    <Button
                                                        onClick={handleCheckout}
                                                        className="btn-black rounded-lg mb-4 w-[320px] h-[56px] font-semibold"
                                                    >
                                                        Mua hàng ({tongSoLuong})
                                                    </Button>
                                                </Link>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    );
};

export default Test2;
