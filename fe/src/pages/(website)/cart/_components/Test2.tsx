
import { useLocalStorage } from "@/components/hook/useStoratge";
import instanceClient from "@/configs/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Popconfirm } from "antd";
import { Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
        }
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
        onSuccess: (_, { productId, currentQuantity }) => {
            setInputValues((prev) => ({
                ...prev,
                [productId]: (currentQuantity + 1).toString(), // Cập nhật số lượng mới
            }));
            setFadeEffect((prev) => ({ ...prev, [productId]: true }));
            setTimeout(() => {
                setFadeEffect((prev) => ({ ...prev, [productId]: false }));
                setIsProcessing((prev) => ({ ...prev, [productId]: false }));
            }, 500);

            queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
        },
        onError: (_, { productId }) => {
            setIsProcessing((prev) => ({ ...prev, [productId]: false }));
            toast.error("Sản phẩm trong kho không đủ số lượng bạn yêu cầu. Vui lòng điều chỉnh.");
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
        onSuccess: (_, { productId, currentQuantity }) => {
            setInputValues((prev) => ({
                ...prev,
                [productId]: (currentQuantity - 1).toString(),
            }));
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
        if (!data?.san_pham_giam_gia.length && !data?.san_pham_nguyen_gia.length && !data?.san_pham_het_hang.length) {
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

    const { mutate: SelectedProduct } = useMutation({
        mutationFn: async ({
            gioHangIds,
            isChecked,
        }: {
            gioHangIds: string[];
            isChecked: boolean;
        }) => {
            try {
                await instanceClient.post(
                    `/gio-hang/chon-san-pham`,
                    { gio_hang_ids: gioHangIds, chon: isChecked ? 1 : 0 },
                    {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                    }
                );
            } catch (error) {

            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart", access_token] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Có lỗi xảy ra khi chọn sản phẩm.");
        },
    });
    // Xử lý khi chọn tất cả sản phẩm giảm giá
    const handleSelectAllDiscounted = (isChecked: boolean) => {
        const discountedProductIds = data?.san_pham_giam_gia.map((product: any) => product.id) || [];

        const updatedSelectedProducts = isChecked
            ? [...new Set([...selectedProducts, ...discountedProductIds])] // Thêm tất cả sản phẩm giảm giá
            : selectedProducts.filter((id) => !discountedProductIds.includes(id)); // Loại bỏ tất cả sản phẩm giảm giá

        setSelectedProducts(updatedSelectedProducts);
        SelectedProduct({
            gioHangIds: discountedProductIds,
            isChecked,
        });
    };
    // Xử lý khi chọn tất cả sản phẩm nguyên giá
    const handleSelectAllRegular = (isChecked: boolean) => {
        const regularProductIds = data?.san_pham_nguyen_gia.map((product: any) => product.id) || [];

        const updatedSelectedProducts = isChecked
            ? [...new Set([...selectedProducts, ...regularProductIds])] // Thêm tất cả sản phẩm nguyên giá
            : selectedProducts.filter((id) => !regularProductIds.includes(id)); // Loại bỏ tất cả sản phẩm nguyên giá

        setSelectedProducts(updatedSelectedProducts);
        SelectedProduct({
            gioHangIds: regularProductIds,
            isChecked,
        });
    };
    // Xử lý khi chọn một sản phẩm
    const handleSelectProduct = (productId: string) => {
        const isChecked = selectedProducts.includes(productId);

        const updatedSelectedProducts = isChecked
            ? selectedProducts.filter((id) => id !== productId) // Bỏ chọn sản phẩm
            : [...selectedProducts, productId]; // Chọn sản phẩm

        setSelectedProducts(updatedSelectedProducts);
        SelectedProduct({
            gioHangIds: [productId],
            isChecked: !isChecked,
        });
    };

    // Tải sản phẩm từ localStorage khi component khởi tạo
    useEffect(() => {
        const savedSelectedProducts = localStorage.getItem("selectedProducts");
        if (savedSelectedProducts) {
            setSelectedProducts(JSON.parse(savedSelectedProducts));
        }
    }, []);

    // Lưu sản phẩm vào localStorage khi có sự thay đổi
    useEffect(() => {
        // Lưu vào localStorage mỗi khi selectedProducts thay đổi
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
    // nhập ôố lượng
    const { mutate: updateQuantity } = useMutation({
        mutationFn: async ({ productId, newQuantity }: { productId: string; newQuantity: number }) => {
            try {
                const response = await instanceClient.put(`/gio-hang/update/${productId}`, {
                    so_luong: newQuantity,
                });
                return response.data;
            } catch (error) {
                if (error instanceof Error && (error as any).response && (error as any).response.data && (error as any).response.data.message) {
                    throw new Error(((error as any).response.data as { message: string }).message);
                }
                throw error;
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['cart', access_token] });
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });


    const [inputValues, setInputValues] = useState<Record<string, string>>({});
const timeoutRef = useRef<NodeJS.Timeout | null>(null);

const handleChangeQuantity = (
    event: React.ChangeEvent<HTMLInputElement>,
    product: any
) => {
    const value = event.target.value;
    const newQuantity = Number(value);

    // Cập nhật giá trị input ngay lập tức
    setInputValues((prev) => ({ ...prev, [product.id]: value }));

    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }

    // Bắt đầu hiệu ứng fade
    setFadeEffect((prev) => ({ ...prev, [product.id]: true }));

    timeoutRef.current = setTimeout(() => {
        // Nếu giá trị nhập vào không hợp lệ (không phải số, hoặc bé hơn 1)
        if (!value || isNaN(newQuantity) || newQuantity < 1) {
            // Reset giá trị input về 1 nếu không hợp lệ
            setInputValues((prev) => ({ ...prev, [product.id]: '1' }));
            
            setIsProcessing((prev) => ({ ...prev, [product.id]: true }));

            updateQuantity(
                { productId: product.id, newQuantity: 1 },
                {
                    onSettled: () => {
                        setIsProcessing((prev) => ({ ...prev, [product.id]: false }));
                    },
                }
            );
            setTimeout(() => {
                setFadeEffect((prev) => ({ ...prev, [product.id]: false }));
            }, 500);
            return;
        }

        // Kiểm tra nếu số lượng nhập vào vượt quá số lượng trong kho
        if (newQuantity > product.so_luong_bien_the) {
            // Cập nhật giá trị nhập vào với số lượng tối đa trong kho ngay lập tức
            setInputValues((prev) => ({ ...prev, [product.id]: String(product.so_luong_bien_the) }));

            // Hiển thị thông báo số lượng vượt quá
            toast.error(`Rất tiếc, bạn chỉ có thể mua tối đa ${product.so_luong_bien_the} sản phẩm.`, {
                autoClose: 3000,
            });

            // Không gửi backend khi số lượng vượt quá
            setTimeout(() => {
                setFadeEffect((prev) => ({ ...prev, [product.id]: false }));
            }, 500);
            return;
        }

        // Nếu không có vấn đề gì, gửi dữ liệu
        setIsProcessing((prev) => ({ ...prev, [product.id]: true }));
        updateQuantity(
            { productId: product.id, newQuantity },
            {
                onSettled: () => {
                    setIsProcessing((prev) => ({ ...prev, [product.id]: false }));
                },
            }
        );

        setTimeout(() => {
            setFadeEffect((prev) => ({ ...prev, [product.id]: false }));
        }, 500);
    }, 500);
};

    return (
        <>
            {data?.san_pham_giam_gia?.length === 0 &&
                data?.san_pham_nguyen_gia?.length === 0 &&
                data?.san_pham_het_hang?.length === 0 &&
                data?.san_pham_khong_hoat_dong.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-32 pb-20">
                    <img
                        src="https://m.yodycdn.com/web/prod/_next/static/media/cart-empty.250eba9c.svg"
                        alt="No products"
                        className="w-[600px] h-[200px] md:w-[500px] md:h-[400px] object-cover"
                    />
                    <Link
                        to="/shop/nam"
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
                                <div className="grid lg:grid-cols-12 gap-6 relative ">
                                    {/* Sản phẩm */}
                                    <div className="lg:col-span-8 col-span-12">
                                        {/* Danh mục sản phẩm giảm giá */}
                                        {data?.san_pham_giam_gia?.length > 0 && (
                                            <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-[765px]">
                                                <div className="flex items-center mb-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            [...(data?.san_pham_giam_gia ?? [])].every(product => product.chon === 1)
                                                        }
                                                        onChange={(e) => handleSelectAllDiscounted(e.target.checked)}
                                                        className="form-checkbox h-5 w-5 text-yellow-500 "
                                                        title="Select all discounted products"
                                                    />
                                                    <h2 className="font-bold text-xl mb-0 ml-2">Sản phẩm giảm giá</h2>
                                                </div>
                                                {data?.san_pham_giam_gia.map((product: any) => (
                                                    <div
                                                        key={product.id}
                                                        className={`flex justify-between items-center border-b py-4  rounded-md ${fadeEffect[product.id] ? "opacity-50 transition-opacity duration-300" : ""}`}
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            <input
                                                                type="checkbox"
                                                                className="w-5 h-5 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                                                                checked={product.chon === 1 || selectedProducts.includes(product.id)}
                                                                onChange={() => handleSelectProduct(product.id)}
                                                                title="Select discount product"
                                                            />
                                                            <div className="flex items-start space-x-4 mr-10">
                                                                <img
                                                                    src={product.hinh_anh}
                                                                    alt="Ảnh sản phẩm"
                                                                    className="w-32 h-40 object-cover rounded-md"
                                                                />
                                                                <div className="flex flex-col justify-between">
                                                                    <Link to={`/product-detail/${product?.duong_dan}`}>
                                                                        <h3 className="font-semibold w-[300px] hover:text-red-500">{product.ten_san_pham}</h3>
                                                                    </Link>
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

                                                        </div>
                                                        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                                            {product.so_luong === 1 ? (
                                                                <Popconfirm
                                                                    title="Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?"
                                                                    onConfirm={() => handleRemoveProduct(product.id)}
                                                                    okText="Có"
                                                                    cancelText="Không"
                                                                >
                                                                    <button className="py-1 px-3 rounded-l-lg" title="Decrease quantity">
                                                                        −
                                                                    </button>
                                                                </Popconfirm>
                                                            ) : (
                                                                <button
                                                                    onClick={() => {
                                                                        if (!isProcessing[product.id]) {
                                                                            decreaseQuantity({ productId: product.id, currentQuantity: product.so_luong });
                                                                        }
                                                                    }}
                                                                    className="px-4 py-2 text-gray-500 hover:text-black transition-colors"
                                                                    title="Decrease quantity"
                                                                    disabled={isProcessing[product.id] || product.so_luong <= 1 || fadeEffect[product.id]}
                                                                >
                                                                    −
                                                                </button>
                                                            )}
                                                           <input
    type="number"
    value={inputValues[product.id] ?? product.so_luong}  // Đảm bảo giá trị được lấy từ state
    onChange={(event) => handleChangeQuantity(event, product)}
    onBlur={() => {
        if (!inputValues[product.id]) {
            setInputValues((prev) => ({ ...prev, [product.id]: product.so_luong }));
        }
    }}
    placeholder=""
    min="1"
    max={product.so_luong_bien_the}
    title="Product Quantity"
    disabled={isProcessing[product.id]}
    className="xl:w-10 xl:h-10 lg:w-5 lg:h-5 md:w-10 md:h-10 w-5 h-5 border-0 focus:ring-0 focus:outline-none text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
/>


                                                            <button
                                                                onClick={() => {
                                                                    if (product.so_luong >= product.so_luong_bien_the) {
                                                                        toast.error("Sản phẩm đã đạt đến số lượng tồn kho tối đa.");
                                                                        return;
                                                                    }

                                                                    if (!isProcessing[product.id]) {
                                                                        increaseQuantity({
                                                                            productId: product.id,
                                                                            currentQuantity: product.so_luong,
                                                                        });
                                                                    }
                                                                }}
                                                                className="px-4 py-2 text-gray-500 hover:text-black transition-colors"
                                                                title="Increase quantity"
                                                                disabled={product.so_luong >= product.so_luong_bien_the || fadeEffect[product.id] || isProcessing[product.id]}
                                                            >
                                                                +
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
                                        )}
                                        {/* Danh mục sản phẩm nguyên giá */}
                                        {data?.san_pham_nguyen_gia?.length > 0 && (
                                            <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-[765px]">
                                                <div className="flex items-center mb-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            [...(data?.san_pham_nguyen_gia ?? [])].every(product => product.chon === 1)
                                                        }
                                                        onChange={(e) => handleSelectAllRegular(e.target.checked)}
                                                        className="form-checkbox h-5 w-5 text-blue-500"
                                                        title="Select all regular priced products"
                                                    />
                                                    <h2 className="font-bold text-xl mb-0 ml-2">Sản phẩm nguyên giá</h2>
                                                </div>

                                                {data?.san_pham_nguyen_gia.map((product: any) => (
                                                    <div
                                                        key={product.id}
                                                        className={`flex justify-between items-center border-b py-4  rounded-md ${fadeEffect[product.id] ? "opacity-50 transition-opacity duration-300" : ""}`}
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            <input
                                                                type="checkbox"
                                                                className="w-5 h-5 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                                                                checked={product.chon === 1 || selectedProducts.includes(product.id)}
                                                                onChange={() => handleSelectProduct(product.id)}
                                                                title="Select discount product"
                                                            />
                                                            <div className="flex items-start space-x-4">
                                                                <img
                                                                    src={product.hinh_anh}
                                                                    alt="Ảnh sản phẩm"
                                                                    className="w-32 h-40 object-cover rounded-md"
                                                                />
                                                                <div className="flex flex-col justify-between">
                                                                    <h3 className="font-semibold w-[300px]">{product.ten_san_pham}</h3>
                                                                    <p className="text-sm text-gray-500">
                                                                        {product.mau_sac}, {product.kich_thuoc}
                                                                    </p>
                                                                    <p className="text-gray-700 font-semibold">
                                                                        {formatCurrency(product.gia_hien_tai)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                                            {product.so_luong === 1 ? (
                                                                <Popconfirm
                                                                    title="Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?"
                                                                    onConfirm={() => handleRemoveProduct(product.id)}
                                                                    okText="Có"
                                                                    cancelText="Không"
                                                                >
                                                                    <button className="py-1 px-3 rounded-l-lg" title="Decrease quantity">
                                                                        −
                                                                    </button>
                                                                </Popconfirm>
                                                            ) : (
                                                                <button
                                                                    onClick={() => {
                                                                        if (!isProcessing[product.id]) {
                                                                            decreaseQuantity({ productId: product.id, currentQuantity: product.so_luong });
                                                                        }
                                                                    }}
                                                                    className="px-4 py-2 text-gray-500 hover:text-black transition-colors"
                                                                    title="Decrease quantity"
                                                                    disabled={isProcessing[product.id] || product.so_luong <= 1 || fadeEffect[product.id]}
                                                                >
                                                                    −
                                                                </button>
                                                            )}
                                                            <input
                                                                type="number"
                                                                value={inputValues[product.id] ?? product.so_luong}  // Sử dụng inputValues nếu có, hoặc product.so_luong
                                                                onChange={(event) => handleChangeQuantity(event, product)}
                                                                onBlur={() => {
                                                                    if (!inputValues[product.id]) {
                                                                        setInputValues((prev) => ({ ...prev, [product.id]: product.so_luong }));
                                                                    }
                                                                }}
                                                                placeholder=""
                                                                min="1"
                                                                max={product.so_luong_bien_the}
                                                                title="Product Quantity"
                                                                disabled={isProcessing[product.id]}
                                                                className="xl:w-10 xl:h-10 lg:w-5 lg:h-5 md:w-10 md:h-10 w-5 h-5 border-0 focus:ring-0 focus:outline-none text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    if (product.so_luong >= product.so_luong_bien_the) {
                                                                        toast.error("Sản phẩm đã đạt đến số lượng tồn kho tối đa.");
                                                                        return;
                                                                    }

                                                                    if (!isProcessing[product.id]) {
                                                                        increaseQuantity({
                                                                            productId: product.id,
                                                                            currentQuantity: product.so_luong,
                                                                        });
                                                                    }
                                                                }}
                                                                className="px-4 py-2 text-gray-500 hover:text-black transition-colors"
                                                                title="Increase quantity"
                                                                disabled={product.so_luong >= product.so_luong_bien_the || fadeEffect[product.id] || isProcessing[product.id]}
                                                            >
                                                                +
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
                                        )}
                                        {/* san phẩm hết hàng */}
                                        {data?.san_pham_het_hang?.length > 0 && (
                                            <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-[765px]">
                                                <div className="flex items-center mb-4">
                                                    <input
                                                        type="checkbox"

                                                        className="form-checkbox h-5 w-5 text-yellow-500"
                                                        title="Select all discounted products"
                                                        disabled={true}
                                                    />

                                                    <h2 className="font-bold text-xl mb-0 ml-2">Sản phẩm hết hàng</h2>
                                                </div>

                                                {data?.san_pham_het_hang.map((product: any) => (
                                                    <div
                                                        key={product.id}
                                                        // className="flex justify-between items-center border-b py-4"
                                                        className={`flex justify-between items-center border-b py-4 border-gray-200  ${product.het_hang ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            <input
                                                                type="checkbox"
                                                                className="w-5 h-5 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                                                                disabled={product.het_hang}
                                                                onChange={() => handleSelectProduct(product.id)}
                                                                title={product.het_hang ? 'Sản phẩm đã hết hàng' : 'Select product'}
                                                            />
                                                            <div className="flex items-start space-x-4">
                                                                <div className="relative w-32 h-40">
                                                                    <img
                                                                        src={product.hinh_anh}
                                                                        alt="Ảnh sản phẩm"
                                                                        className="w-full h-full object-cover rounded-md"
                                                                    />
                                                                    {product.het_hang === 1 && (
                                                                        <p className="absolute bottom-0 left-0 w-full text-center text-red-600 font-semibold bg-white bg-opacity-75 py-1 rounded-b-md">
                                                                            Hết hàng
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold w-[300px]">{product.ten_san_pham}</h3>
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
                                                                    {/* <p className="text-xs text-red-500 font-semibold">
                                                                    Đã tiết kiệm {formatCurrency(product.tiet_kiem)}
                                                                </p> */}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                                            <button
                                                                onClick={() => decreaseQuantity({ productId: product.id, currentQuantity: product.so_luong })}
                                                                className="px-4 py-2 text-gray-500 hover:text-black transition-colors" disabled={product.het_hang === 1}>
                                                                −
                                                            </button>
                                                            <input
                                                                type="text"
                                                                value={product.so_luong}
                                                                className="w-12 text-center border-none outline-none"
                                                                readOnly
                                                                title={`Quantity of ${product.ten_san_pham}`}
                                                            />
                                                            <button
                                                                onClick={() => increaseQuantity({ productId: product.id, currentQuantity: product.so_luong })}
                                                                className="px-4 py-2 text-gray-500 hover:text-black transition-colors" disabled={product.het_hang === 1}>
                                                                +
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
                                        )}
                                        {/* san phan khong ban */}
                                        {data?.san_pham_khong_hoat_dong?.length > 0 && (
                                            <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-[765px]">
                                                <div className="flex items-center mb-4">
                                                    <input
                                                        type="checkbox"

                                                        className="form-checkbox h-5 w-5 text-yellow-500"
                                                        title="Select all discounted products"
                                                        disabled={true}
                                                    />

                                                    <h2 className="font-bold text-xl mb-0 ml-2">Sản phẩm ngừng bán</h2>
                                                </div>
                                                {data?.san_pham_khong_hoat_dong.map((product: any) => (
                                                    <div
                                                        key={product.id}
                                                        // className="flex justify-between items-center border-b py-4"
                                                        className={`flex justify-between items-center border-b py-4 border-gray-200  ${product.het_hang === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-6">
                                                            <input
                                                                type="checkbox"
                                                                className="w-5 h-5 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                                                                disabled={product.het_hang === 0}
                                                                onChange={() => handleSelectProduct(product.id)}
                                                                title={product.het_hang === 0 ? 'Sản phẩm đã hết hàng' : 'Select product'}
                                                            />
                                                            <div className="flex items-start space-x-4">
                                                                <div className="relative w-32 h-40">
                                                                    <img
                                                                        src={product.hinh_anh}
                                                                        alt="Ảnh sản phẩm"
                                                                        className="w-full h-full object-cover rounded-md"
                                                                    />
                                                                    {product.het_hang === 0 && (
                                                                        <p className="absolute bottom-0 left-0 w-full text-center text-red-600 font-semibold bg-white bg-opacity-75 py-1 rounded-b-md">
                                                                            Ngừng bán
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-semibold w-[300px]">{product.ten_san_pham}</h3>
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
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                                            <button
                                                                onClick={() => decreaseQuantity({ productId: product.id, currentQuantity: product.so_luong })}
                                                                className="px-4 py-2 text-gray-500 hover:text-black transition-colors"
                                                                disabled={product.het_hang === 0}
                                                            >
                                                                −
                                                            </button>
                                                            <input
                                                                type="text"
                                                                value={product.so_luong}
                                                                className="w-12 text-center border-none outline-none"
                                                                readOnly
                                                                title={`Quantity of ${product.ten_san_pham}`}
                                                            />
                                                            <button
                                                                onClick={() => increaseQuantity({ productId: product.id, currentQuantity: product.so_luong })}
                                                                className="px-4 py-2 text-gray-500 hover:text-black transition-colors" disabled={product.het_hang === 0}>
                                                                +
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
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* CHI TIẾT */}
                            <div className="lg:col-span-4 col-span-6">
                                <div className="border px-4 py-2 md:py-3 lg:w-[359px] w-full rounded-md">
                                    <h1 className="text-lg md:text-xl font-bold mt-4 text-center md:text-left">Chi tiết đơn hàng</h1>
                                    {(() => {
                                        // Lấy danh sách sản phẩm giảm giá và nguyên giá từ data
                                        const discountedProductIds = data?.san_pham_giam_gia.map((product: any) => product.id) || [];
                                        const regularProductIds = data?.san_pham_nguyen_gia.map((product: any) => product.id) || [];

                                        // Kiểm tra xem có sản phẩm nào được chọn không
                                        const hasSelectedDiscountedProducts = selectedProducts.some((id) =>
                                            discountedProductIds.includes(id)
                                        );
                                        const hasSelectedRegularProducts = selectedProducts.some((id) =>
                                            regularProductIds.includes(id)
                                        );

                                        // Nếu không có sản phẩm nào được chọn
                                        if (!hasSelectedDiscountedProducts && !hasSelectedRegularProducts) {
                                            return (
                                                <div className="text-center my-4">
                                                    <img
                                                        src="https://m.yodycdn.com/web/prod/_next/static/media/cart-empty.250eba9c.svg"
                                                        alt="Empty cart"
                                                        className="mx-auto my-4 w-40 md:w-52"
                                                    />
                                                    <p className="text-gray-500 mb-4 text-sm md:text-base">
                                                        Vui lòng chọn các sản phẩm trong giỏ hàng trước khi thanh toán.
                                                    </p>
                                                    <Button
                                                        disabled
                                                        className="bg-gray-300 cursor-not-allowed rounded-lg mb-4 w-full md:w-[320px] h-[48px] md:h-[56px] font-semibold text-sm"
                                                    >
                                                        Mua hàng
                                                    </Button>
                                                </div>
                                            );
                                        }

                                        // Nếu có sản phẩm được chọn, hiển thị chi tiết đơn hàng
                                        return (
                                            <div>
                                                <div className="flex justify-between font-bold border-b border-hrBlack">
                                                    <h4 className="text-sm md:text-base">Tổng giá trị sản phẩm</h4>
                                                    <span className="px-2 text-sm md:text-base">
                                                        {totalSelectedPrice.toLocaleString("vn-VN")} ₫
                                                    </span>
                                                </div>
                                                <div className="py-4">
                                                    <div className="flex justify-between font-medium">
                                                        <p className="text-sm md:text-base">Tiết kiệm</p>
                                                        <span className="px-2 text-red-500 text-sm md:text-base">
                                                            {totalSavings ? totalSavings.toLocaleString("vn-VN") : "0"} ₫
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-between font-medium mb-0">
                                                        <p className="text-sm md:text-base">Phí giao hàng</p>
                                                        <span className="px-2 text-sm md:text-base">{formatCurrency(20000)}</span>
                                                    </div>
                                                    {totalSelectedPrice > 498000 && (
                                                        <div className="flex justify-between font-medium border-b border-hrBlack">
                                                            <p className="text-sm md:text-base">Giảm giá vận chuyển</p>
                                                            <span className="px-2 text-red-500 text-sm md:text-base">
                                                                - {formatCurrency(20000)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex justify-between font-bold mb-8">
                                                    <h4 className="text-sm md:text-base">Tổng cộng</h4>
                                                    <span className="text-sm md:text-base">{formatCurrency(finalTotal)}</span>
                                                </div>
                                                <div className="flex justify-center">
                                                    <Link to="/shippingAddressPage">
                                                        <Button
                                                            onClick={handleCheckout}
                                                            className="btn-black rounded-lg mb-4 w-full md:w-[320px] h-[48px] md:h-[56px] font-semibold text-sm md:text-base"
                                                        >
                                                            Mua hàng ({tongSoLuong})
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })()}
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
