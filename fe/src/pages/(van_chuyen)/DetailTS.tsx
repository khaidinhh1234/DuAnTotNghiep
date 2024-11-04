import instance from "@/configs/admin"
import { uploadToCloudinary } from "@/configs/cloudinary"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Image, message, Modal } from "antd"
import { useEffect, useRef, useState } from "react"
import Webcam from "react-webcam"

const DetailTS = ({ record }: any) => {
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)
    const id = record?.id;
    const { data } = useQuery({
        queryKey: ["SHIPPER"],
        queryFn: async () => {
            const response = await instance.get(`/vanchuyen/${id}`);
            return response.data;
        },
    });

    const products = data?.data?.van_chuyen?.don_hang?.chi_tiets?.map(
        (item: any) => {
            return {
                ...item,
            };
        }
    );
    const thongtin = data?.data?.thong_tin;
    // console.log(thongtin)
    const shipper = data?.data?.van_chuyen?.shipper
    // console.log(shipper)
    const webcam = data?.data?.anh_xac_thuc 
    console.log(webcam)
    const handleCancel = () => {
        setOpen(false);
    };
    const { mutateAsync: mutate } = useMutation({
        mutationFn: async ({ id, action, imageUrl, failedAttempts, notes }: any) => {
            try {
                let response;
                const shipperXacNhan = failedAttempts >= 3 ? "2" : "1";
                if (action === "Xác nhận giao hàng") {
                    response = await instance.put(`/vanchuyen/xac-nhan-van-chuyen/${id}`, {
                        anh_xac_thuc: imageUrl,
                        shipper_xac_nhan: shipperXacNhan,
                        ghi_chu: notes,
                        id: [id],
                        failedAttempts,
                    });
                } else {
                    response = await instance.put("/vanchuyen/trang-thai-van-chuyen", {
                        trang_thai_van_chuyen: action,
                        id: [id],
                        // ghi_chu: notes,
                    });
                }
                // const error = response.data.message;
                return response.data;
                // if (error) {
                //     message.success(error);
                // } else {
                //     message.success("Cập nhật thành công");
                // }
            } catch (error) {
                message.error("Lỗi xảy ra");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vanchuyen"] });
        },
    });

    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isWebcamVisible, setIsWebcamVisible] = useState<boolean>(() => {
        return JSON.parse(localStorage.getItem("isWebcamVisible") || "false");
    });
    const [isImageSaved, setIsImageSaved] = useState(false);
    const [failedAttemptsNotes, setFailedAttemptsNotes] = useState<string[]>([]);
    // const [note, setNote] = useState(""); // Để lưu ghi chú
    const [notes, setNotes] = useState(() => {
        const savedNotes = localStorage.getItem('deliveryNotes');
        return savedNotes ? JSON.parse(savedNotes) : [];
    });
    const [currentNote, setCurrentNote] = useState(""); // Để lưu ghi chú hiện tại
    const [isFailureNoteVisible, setIsFailureNoteVisible] = useState(false);

    // const [noteCount, setNoteCount] = useState(0);
    const [isSuccessDeliveryOpen, setIsSuccessDeliveryOpen] = useState(false);
    const [isFailureDeliveryOpen, setIsFailureDeliveryOpen] = useState(false);
    const [isDeliveryButtonsVisible, setIsDeliveryButtonsVisible] = useState(true);
    // Thay đổi label của nút dựa trên số lần gửi ghi chú
    const [buttonLabel, setButtonLabel] = useState("Gửi ghi chú");
    const [noteSubmissionCount, setNoteSubmissionCount] = useState(0);
    
    const toggleSuccessDelivery = () => {
        setIsSuccessDeliveryOpen(!isSuccessDeliveryOpen);
        setIsDeliveryButtonsVisible(false); // Ẩn các nút sau khi nhấn
        setIsFailureDeliveryOpen(false);
    };

    const toggleFailureDelivery = () => {
        setIsFailureDeliveryOpen(!isFailureDeliveryOpen);
        // setIsDeliveryButtonsVisible(false);
        setIsSuccessDeliveryOpen(false);
    };
    const webcamRef = useRef<Webcam>(null);

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user",
    };

    useEffect(() => {
        localStorage.setItem("isWebcamVisible", JSON.stringify(isWebcamVisible));
    }, [isWebcamVisible]);

    useEffect(() => {
        if (record.trang_thai_van_chuyen === "Đang giao hàng" && !isImageSaved) {
            setIsWebcamVisible(true);
        } else {
            setIsWebcamVisible(false);
        }
    }, [record.trang_thai_van_chuyen, isImageSaved]);

    const capturePhoto = () => {
        if (record.trang_thai_van_chuyen !== "Đang giao hàng") {
            message.error("Chỉ có thể chụp ảnh khi đang ở trạng thái đang giao hàng");
            return;
        }

        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            setUrl(imageSrc);
        } else {
            message.error("Webcam không khả dụng");
        }
    };

    const removePhoto = () => {
        setUrl(null);
        message.success("Xóa ảnh thành công");
    };
    const handleSave = async () => {
        try {
            setLoading(true);
            if (!url) {
                message.error("Vui lòng chụp ảnh trước khi xác nhận");
                setLoading(false);
                return;
            }

            const fetchResponse = await fetch(url);
            const blob = await fetchResponse.blob();
            const file = new File([blob], "photo.jpg", { type: "image/jpeg" });

            const imageUrl = await uploadToCloudinary(file);
            if (!imageUrl) {
                message.error("Lỗi khi tải ảnh lên");
                setLoading(false);
                return;
            }

            await mutate({
                id: record.id,
                action: "Xác nhận giao hàng",
                imageUrl,
                failedAttempts: record.failedAttempts + 1,
                notes: failedAttemptsNotes,
            });

            setIsImageSaved(true);
            setUrl(null);
            setIsWebcamVisible(false);
        } catch (error) {
            message.error("Lỗi khi xác nhận giao hàng");
        } finally {
            setLoading(false);
        }
    };

    const handleSendNote = async () => {
        try {
            setLoading(true);
            if (!currentNote) {
                message.error("Vui lòng nhập ghi chú trước khi gửi");
                setLoading(false);
                return;
            }

            const newNote = currentNote.trim();
            const updatedNotes = [...notes, newNote];
            setNotes(updatedNotes);
            // localStorage.setItem('deliveryNotes', JSON.stringify(updatedNotes));
            setCurrentNote("");

            // Gửi ghi chú lên server
            const ghiChuCapNhat = updatedNotes.map((note, index) => ({
                [`lan${index + 1}`]: note
            }));
            const response = await instance.put(`/vanchuyen/xac-nhan-van-chuyen/${record.id}`, {
                ghi_chu: ghiChuCapNhat,
                shipper_xac_nhan: "2",
            });

            if (response.data.status) {
                message.success("Ghi chú đã được gửi thành công");
                setNoteSubmissionCount(noteSubmissionCount + 1); // Tăng số lần gửi ghi chú

                // Kiểm tra nếu đã gửi 2 lần
                if (noteSubmissionCount + 1 === 2) {
                    setButtonLabel("Xác nhận giao hàng thất bại");
                }
            } else {
                message.error(response.data.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            console.error("Lỗi khi gửi ghi chú:", error);
            message.error("Lỗi khi gửi ghi chú");
        } finally {
            setLoading(false);
        }
    };
    const formatDate = (dateString: any) => {
        if (!dateString) return '';
        const data = new Date(dateString)
        const day = data.getDate().toString().padStart(2, '0');
        const month = (data.getMonth() + 1).toString().padStart(2, '0');
        const year = data.getFullYear();

        const hours = data.getHours().toString().padStart(2, '0');
        const minutes = data.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    return (
        <div>
            {" "}
            <Button onClick={() => setOpen(true)}>Xem chi tiết </Button>
            <Modal
                centered
                open={open}
                width={1200}
                className=" "
                okText="Đồng ý"
                footer={null}
                onCancel={handleCancel}
            >
                <h1 className="text-3xl font-bold">Chi tiết vận chuyển </h1>
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-9">
                        {" "}
                        <div className="py-1 px-5 border bg-slate-100 rounded-md flex justify-between items-center">
                            <div className="">
                                <h4 className="text-lg font-bold">
                                    Đơn Hàng:
                                    <span className="text-blue-500">{record?.ma_don_hang}</span>
                                </h4>
                                <p className="text-base">
                                    Ngày tạo:{" "}
                                    <span className="font-medium">
                                        {formatDate(record?.created_at)}
                                    </span>
                                </p>{" "}
                            </div>{" "}
                            <div
                                className={`font-bold text-[15px] ${record.trang_thai_van_chuyen === "Chờ xử lý"
                                    ? "text-yellow-400" // Chờ xác nhận: màu vàng nhạt
                                    : record.trang_thai_van_chuyen === "Đang giao hàng"
                                        ? "text-purple-500" // Đang giao hàng: màu tím
                                        : record.trang_thai_van_chuyen ===
                                            "Đã giao hàng thành công"
                                            ? "text-green-500" // Đã giao hàng thành công: màu xanh lá
                                            : record.trang_thai_van_chuyen === "Giao hàng thất bại"
                                                ? "text-red-500" // Giao hàng thất bại: màu đ��
                                                : ``
                                    }`}
                            >
                                <div
                                    className={`${record.trang_thai_van_chuyen === "Chờ xử lý"
                                        ? "bg-blue-400" // Chờ xác nhận: màu vàng nhạt
                                        : record.trang_thai_van_chuyen === "Đang giao hàng"
                                            ? "bg-purple-500" // Đang giao hàng: màu tím
                                            : record.trang_thai_van_chuyen ===
                                                "Giao hàng thành công"
                                                ? "bg-green-500" // Đã giao hàng thành công: màu xanh lá
                                                : record.trang_thai_van_chuyen === "Giao hàng thất bại"
                                                    ? "bg-red-500" // Giao hàng thất bại: màu đ��
                                                    : "bg-red-500" // Các trạng thái khác: màu đỏ
                                        } text-white px-2 py-1 font-bold rounded-lg`}
                                >
                                    {record.trang_thai_van_chuyen === "Chờ xử lý"
                                        ? "Chờ xử lý" // Chờ xác nhận: màu vàng nhạt
                                        : record.trang_thai_van_chuyen === "Đang giao hàng"
                                            ? "Đang giao hàng" // Đang giao hàng: màu tím
                                            : record.trang_thai_van_chuyen === "Giao hàng thành công"
                                                ? "Giao hàng thành công"
                                                : record.trang_thai_van_chuyen === "Giao hàng thất bại"
                                                    ? "Giao hàng thất bại"
                                                    : ""
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-100 border px-5  my-5">
                            <h1 className="text-lg font-bold mt-5 ">Tất Cả Sản Phẩm</h1>{" "}
                            <hr />
                            <div className="my-5">
                                <table>
                                    <thead>
                                        <tr className="*:px-12 *:text-base">
                                            <th className=" w-[30%]"></th>
                                            <th className="w-[15%]">Số Lượng</th>
                                            <th className="w-[20%]">Giá</th>
                                            <th className="w-[35%]">Thành Tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products?.map((item: any, index: number) => (
                                            <tr key={index} className="my-5">
                                                <td>
                                                    <div className="flex gap-5 items-center  w-[50%] my-2">
                                                        <img
                                                            src={
                                                                item?.bien_the_san_pham?.san_pham
                                                                    ?.anh_san_pham || ""
                                                            }
                                                            alt={""}
                                                            className="w-20 h-20"
                                                        />
                                                        <div>
                                                            <h1 className=" font-bold truncate w-40">
                                                                {
                                                                    item?.bien_the_san_pham?.san_pham
                                                                        ?.ten_san_pham
                                                                }
                                                            </h1>
                                                            <div className="flex gap-2">
                                                                <p className="text-base">
                                                                    Màu :{" "}
                                                                    <span>
                                                                        {" "}
                                                                        {
                                                                            item?.chi_tiets?.bien_the_san_pham
                                                                                ?.mau_bien_the?.ten_mau_sac
                                                                        }
                                                                    </span>
                                                                </p>
                                                                <p className="text-base">
                                                                    Size :{" "}
                                                                    <span>
                                                                        {" "}
                                                                        {
                                                                            item?.bien_the_san_pham
                                                                                ?.kich_thuoc_bien_the?.kich_thuoc
                                                                        }
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center w-30 font-semibold  w-[20%]">
                                                    {" "}
                                                    {item?.so_luong}
                                                </td>
                                                <td className="text-center w-[20%] font-semibold  ">
                                                    {(item?.gia).toLocaleString()} VNĐ
                                                </td>
                                                <td className="text-center w-[35%] font-semibold">
                                                    {(item?.thanh_tien).toLocaleString()} VNĐ
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="grid grid-cols-2 gap-5 my-5">
                                    <div>
                                        <div className="flex justify-between">
                                            <p>Lấy hàng</p> <span> Hà Nội</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <p>Mã Vận chuyển</p> <span> 100023874</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <p>Nhà vận chuyển</p> <span> Hà Nội</span>
                                        </div>
                                    </div>{" "}
                                    <div>
                                        <div className="flex justify-between">
                                            <p>Trạng thái vận chuyển</p>{" "}
                                            <span
                                                className={`   ${record.trang_thai_van_chuyen == "Chờ xử lý"
                                                    ? "bg-blue-500"
                                                    : record.trang_thai_van_chuyen == "Đang giao hàng"
                                                        ? "bg-purple-500"
                                                        : record.trang_thai_van_chuyen ==
                                                            "Giao hàng thành công"
                                                            ? "bg-green-500"
                                                            : record.trang_thai_van_chuyen == "Giao hàng thất bại"
                                                                ? "bg-red-500"
                                                                : record
                                                    }
                        } text-white px-2 font-bold rounded-lg h-6`}
                                            >
                                                {" "}
                                                {record.trang_thai_van_chuyen == "Chờ xử lý"
                                                    ? "Chờ xử lý"
                                                    : record.trang_thai_van_chuyen == "Giao hang"
                                                        ? "Đang giao hàng"
                                                        : record.trang_thai_van_chuyen == "Đang giao hàng"
                                                            ? "Đang giao hàng"
                                                            : record.trang_thai_van_chuyen ==
                                                                "Giao hàng thành công"
                                                                ? "Giao hàng thành công"
                                                                : record.trang_thai_van_chuyen == "Giao hàng thất bại"
                                                                    ? "Giao hàng thất bại"
                                                                    : record
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <p>Tổng khối lượng</p> <span> 0.00kg</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-5">
                            <h1 className="text-xl font-bold mt-5">Đã nhận hàng</h1>
                            <div className="grid grid-cols-1 gap-5 w-full">
                                <div className="flex justify-between">
                                    <h1 className="text-lg font-semibold">
                                        Số lượng sản phẩm :{" "}
                                    </h1>
                                    <p className="text-base font-semibold">
                                        <span>{data?.data?.tong_so_luong}</span> sản phẩm
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <h1 className="text-lg font-semibold">Tổng tiền hàng</h1>
                                    <p className="text-base font-semibold">
                                        <span>
                                            {data?.data?.tong_thanh_tien_san_pham.toLocaleString(
                                                "vi-VN"
                                            )}
                                        </span>{" "}
                                        VNĐ
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <h1 className="text-lg font-semibold">Giảm giá</h1>
                                    <p className="text-base font-semibold">
                                        -{" "}
                                        <span>
                                            {data?.data?.van_chuyen?.don_hang?.so_tien_giam_gia
                                                ? data?.data?.van_chuyen?.don_hang?.so_tien_giam_gia.toLocaleString(
                                                    "vi-VN"
                                                )
                                                : 0}{" "}
                                            VNĐ
                                        </span>
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <h1 className="text-lg font-semibold">Vận chuyển</h1>
                                    <p className="text-base font-semibold">
                                        <span>20.000</span> VNĐ
                                    </p>
                                </div>
                                <div className="flex justify-between">
                                    <h1 className="text-lg font-semibold">
                                        Tổng giá trị đơn hàng <br />
                                    </h1>
                                    <p className="text-lg font-bold">
                                        {" "}
                                        {(record?.tien_cod + 20000).toLocaleString("vi-VN")} VNĐ
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-3  ">
                        <div className=" bg-slate-100 p-5 border rounded-lg">
                            <h5 className="text-blue-800 text-lg">Xác nhận đơn hàng </h5>
                            <hr />
                            <p> Vui lòng xác nhận đơn hàng đã nhận hàng</p>
                            <div className="flex flex-col gap-2">
                                {record.trang_thai_van_chuyen === "Chờ xử lý" || record.trang_thai_van_chuyen === "Chờ lấy hàng" ? (
                                    <button
                                        className="w-full py-2 border bg-blue-600 rounded-lg text-white hover:bg-blue-700"
                                        onClick={() => {
                                            setIsWebcamVisible(true);
                                            mutate({ id: record.id, action: "Đang giao hàng" });
                                        }}
                                    >
                                        Giao hàng
                                    </button>
                                ) : record.trang_thai_van_chuyen === "Đang giao hàng" && isDeliveryButtonsVisible ? (
                                    <div className="flex flex-col gap-2">
                                        <button
                                            className="w-full py-2 border bg-green-500 rounded-lg text-white hover:bg-green-600"
                                            onClick={() => {
                                                toggleSuccessDelivery();
                                                setIsFailureNoteVisible(false);
                                            }}
                                        >
                                            Giao hàng thành công
                                        </button>

                                        <button
                                            className="w-full py-2 border bg-red-500 rounded-lg text-white hover:bg-red-600"
                                            onClick={() => {
                                                setIsFailureNoteVisible(true);
                                                toggleFailureDelivery();
                                            }}
                                        >
                                            Giao hàng thất bại
                                        </button>
                                    </div>
                                ) : null}

                                {/* Phần hiển thị khi chọn Giao hàng thành công */}
                                {isSuccessDeliveryOpen && (
                                    <div className="flex flex-col gap-2">
                                        {isWebcamVisible && !isImageSaved && (
                                            <div className="relative mx-auto mt-6">
                                                {url ? (
                                                    <div className="relative">
                                                        <img src={url} alt="Ảnh chụp" className="w-60 rounded-lg" />
                                                        <div className="absolute bottom-[-30px] inset-x-0 flex justify-center items-center">
                                                            <button
                                                                onClick={removePhoto}
                                                                className="px-4 opacity-70 py-3 rounded-full text-3xl bg-white/80 backdrop-blur-sm"
                                                                title="Xóa ảnh"
                                                            >
                                                                <i className="fa-regular fa-trash-can"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <Webcam
                                                            ref={webcamRef}
                                                            screenshotFormat="image/jpeg"
                                                            videoConstraints={videoConstraints}
                                                            className="w-60 rounded-lg"
                                                            audio={false}
                                                        />
                                                        <div className="absolute bottom-[-30px] inset-x-0 flex justify-center items-center">
                                                            <button
                                                                onClick={capturePhoto}
                                                                className="px-4 opacity-70 py-3 rounded-full text-3xl bg-white/80 backdrop-blur-sm"
                                                                title="Chụp ảnh"
                                                            >
                                                                <i className="fa-regular fa-camera"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <button
                                            className="w-full py-2 border bg-purple-500 rounded-lg text-white hover:bg-purple-400 mt-7"
                                            onClick={handleSave}
                                            disabled={loading || isImageSaved}
                                        >
                                            {loading ? "Đang xử lý..." : "Xác nhận giao hàng thành công"}
                                        </button>

                                        {/* Hiển thị ảnh xác thực chỉ khi giao hàng thành công */}
                                        {isImageSaved && (
                                            <Image
                                                src={webcam}
                                                alt="Ảnh xác thực"
                                                className="w-60 rounded-lg"
                                                preview={true}
                                            />
                                        )}
                                    </div>
                                )}

                                {/* Phần hiển thị khi chọn Giao hàng thất bại */}
                                {isFailureNoteVisible && (
                                    <div className="flex flex-col mt-4">
                                        <textarea
                                            value={currentNote}
                                            onChange={(e) => setCurrentNote(e.target.value)}
                                            placeholder="Nhập ghi chú tại đây"
                                            className="w-full border rounded-lg p-2"
                                        />
                                        <button
                                            className="w-full py-2 border bg-blue-500 rounded-lg text-white hover:bg-blue-700 font-semibold mt-2"
                                            onClick={handleSendNote}
                                            disabled={loading}
                                        >
                                            {buttonLabel}
                                        </button>
                                        {notes.length > 0 && (
                                            <div className="mt-4">
                                                <h3 className="font-semibold">Danh sách ghi chú:</h3>
                                                <ul className="list-disc pl-5">
                                                    {notes.map((note, index) => (
                                                        <li key={index} className="mt-1">{note}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                        </div>{" "}
                        <div className=" bg-slate-100 p-5 border rounded-lg my-2">
                            <h5 className="text-blue-800 text-lg">Thông tin khách hàng</h5>
                            <hr />
                            <h5 className="text-blue-600 my-2">
                                {record.van_chuyen?.don_hang.ten_nguoi_dat_hang
                                    ? record.van_chuyen?.don_hang.ten_nguoi_dat_hang
                                    : thongtin?.ho + " " + thongtin?.ten}
                            </h5>
                            <hr />
                            <h5 className="text-blue-800 text-lg my-2">Người liên hệ</h5>
                            <h5 className="text-black my-2">
                                {" "}
                                {record.van_chuyen?.don_hang.ten_nguoi_dat_hang
                                    ? record.van_chuyen?.don_hang.ten_nguoi_dat_hang
                                    : thongtin?.ho + " " + thongtin?.ten}
                            </h5>
                            <p className="text-blue-800 font-semibold">
                                Số điện thoại :
                                <span className="text-black font-medium">
                                    {record.van_chuyen?.don_hang.so_dien_thoai_nguoi_dat_hang
                                        ? record.van_chuyen?.don_hang.so_dien_thoai_nguoi_dat_hang
                                        : thongtin?.so_dien_thoai}
                                </span>
                            </p>
                            <h5 className="text-blue-800">
                                Địa chỉ Giao hàng: <br />
                                <span className="text-black">
                                    {record?.van_chuyen?.don_hang.dia_chi_nguoi_dat_hang
                                        ? record?.van_chuyen?.don_hang.dia_chi_nguoi_dat_hang
                                        : thongtin?.dia_chi}
                                </span>
                            </h5>
                            <p className="text-blue-800 font-semibold">
                                Ghi chú của khách hàng : <br />
                                <span className="text-black">
                                    {record?.van_chuyen?.don_hang.ghi_chu
                                        ? record?.van_chuyen?.don_hang.ghi_chu
                                        : "Không có ghi chú"}
                                </span>
                            </p>
                        </div>{" "}
                        {/* shipper */}
                        <div className="col-span-3">
                            <div className="bg-slate-100 p-5 border rounded-lg my-2">
                                <h5 className="text-blue-800 text-lg">
                                    Thông tin nhân viên giao hàng
                                </h5>
                                <hr />
                                <p className="text-blue-800 text-lg my-2">
                                    Nhân viên giao hàng: {record?.van_chuyen?.shipper?.ho
                                        ? record?.van_chuyen?.shipper?.ho + " " + record?.van_chuyen?.shipper?.ten
                                        : shipper?.ho + " " + shipper?.ten
                                    }{" "}
                                </p>
                                {/* <span className="text-black my-2">{shipperName}</span> */}
                                <p className="text-blue-800 font-semibold">
                                    Số điện thoại: {record?.van_chuyen?.shipper?.so_dien_thoai
                                        ? record?.van_chuyen?.shipper?.so_dien_thoai
                                        : shipper?.so_dien_thoai
                                    }{" "}
                                    {/* <span className="text-black font-medium">{shipperPhone}</span> */}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default DetailTS
