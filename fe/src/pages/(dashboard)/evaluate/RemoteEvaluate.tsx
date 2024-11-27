import { IEvaluate } from "@/common/types/evaluate";
import instance from "@/configs/admin";

import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    Button,
    Image,
    Input,
    InputRef,
    Modal,
    Popconfirm,
    Rate,
    Space,
    Table,
    TableColumnsType,
} from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
// import { useParams } from "react-router-dom";

type DataIndex = keyof IEvaluate;
const RemoteEvaluate = () => {
    const queryClient = useQueryClient();
    // const { id } = useParams();
    const [searchedColumn, setSearchedColumn] = useState<string>("");
    const searchInput = useRef<InputRef>(null);
    const [searchText, setSearchText] = useState<string>("");
    // const [expandedKeys, setExpandedKeys] = useState<number[]>([]);
    const customIcons = ["😞", "😐", "😊", "😃", "😍"];
    const desc = ["Tệ", "Không tốt", "Bình thường", "Tốt", "Tuyệt vời"];

    const { data, isLoading, isError } = useQuery({
        queryKey: ["danhgiabixoa"],
        queryFn: async () => {
            try {
                const response = await instance.get(`/danh-gia-bi-xoa`);
                return response.data;
            } catch (error) {
                throw new Error("Error: " + error);
            }
        },
    });
    const mutation = useMutation({
        mutationFn: async ({
            id,
            phan_hoi,
        }: {
            id: number | string;
            phan_hoi: string;
        }) => {
            const response = await instance.post(`/danhsachdanhgia/${id}`, {
                phan_hoi,
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["danhgiasanpham"] });
        },
        onError: (error) => {
            console.error("Error:", error);
        },
    });

    const hideEvaluate = useMutation({
        mutationFn: async (id: number) => {
           try {
            await instance.post(`/danh-gia-khoi-phuc/${id}`);
           } catch (error) {
                throw new Error("Error: " + error);
           }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["danhgiabixoa"] });
        },
        onError: (error) => {
            console.error("Error hiding review:", error);
        },
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvaluate, setCurrentEvaluate] = useState<any | null>(null);
    const [phan_hoi, setphan_hoi] = useState<{ [key: number]: string }>({});

    const handleOk = () => {
        if (currentEvaluate && phan_hoi[currentEvaluate.id as number]) {
            mutation.mutate({
                id: currentEvaluate.id,
                phan_hoi: phan_hoi[currentEvaluate.id as number],
            });
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handlephan_hoiChange = (id: number, value: string) => {
        setphan_hoi((prev) => ({
            ...prev,
            [id]: value,
        }));
    };
    const handleSearch = (
        selectedKeys: string[],
        confirm: FilterDropdownProps["confirm"],
        dataIndex: DataIndex
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex: DataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }: any) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Tìm ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys as string[], confirm, dataIndex)
                    }
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys as string[], confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm kiếm
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        ),
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                ?.toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible: any) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text: any) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });
    // if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Đã xảy ra lỗi khi tải dữ liệu.</p>;
    const showDetail = (record: IEvaluate) => {
        setCurrentEvaluate(record);
        setIsModalOpen(true); // Sử dụng modal để hiển thị chi tiết
    };
    const dataSource =
        data?.data?.map((evaluate: IEvaluate) => ({
            key: evaluate.id,
            ...evaluate,
            user_id:
                evaluate?.user?.ten + " " + evaluate?.user?.ho || "Chưa có dữ liệu",
            san_pham_id: evaluate.san_pham?.ten_san_pham || "Chưa có dữ liệu",
            anh_danh_gias: evaluate.anh_danh_gias || "Chưa có dữ liệu",
        })) || [];

    const columns: TableColumnsType<IEvaluate> = [
        {
            title: "Nội dung",
            width: "30%",
            key: "mo_ta",
            sorter: (a: any, b: any) => a.mo_ta?.localeCompare(b.mo_ta) || 0,
            render: (record: IEvaluate) => {
                const content =
                    record?.mo_ta?.length > 100
                        ? `${record.mo_ta.substring(0, 100)}...`
                        : record.mo_ta;

                return (
                    <div style={{ textAlign: "left", paddingBottom: "60px" }}>
                        <p>
                            <strong>
                                {record.user?.ho + " " + record.user?.ten || "Người dùng ẩn"}
                            </strong>
                            : {content}
                        </p>
                        {record.phan_hoi && (
                            <p className="bg-gray-100 p-2 rounded">
                                <strong>Trả lời:</strong> {record.phan_hoi}
                            </p>
                        )}
                    </div>
                );
            },
            align: "left",
        },
        {
            title: "Chất lượng sản phẩm",
            width: "20%",
            key: "chat_luong_san_pham",
            ...getColumnSearchProps("chat_luong_san_pham"),
            sorter: (a: any, b: any) =>
                a.san_pham?.[0]?.ten_san_pham?.localeCompare(
                    b.san_pham?.[0]?.ten_san_pham
                ) || 0,
            render: (record: IEvaluate) => {
                // Map `chat_luong_san_pham` to custom rating
                const ratingIndex = desc.indexOf(record.chat_luong_san_pham);
                const icon = customIcons[ratingIndex] || "❓";
                const label = desc[ratingIndex] || "Không xác định";

                return (
                    <div style={{ textAlign: "left", paddingBottom: "60px" }}>
                        {record.san_pham?.map((sanPham: any, index: number) => (
                            <div
                                key={index}
                                style={{ display: "flex", gap: "10px", marginBottom: "8px" }}
                            >
                                {sanPham.anh_san_pham ? (
                                    <img
                                        src={sanPham.anh_san_pham}
                                        alt={sanPham.ten_san_pham}
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                ) : (
                                    "Ảnh ẩn"
                                )}
                                <div>
                                    <div>{sanPham.ten_san_pham}</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                        <span>{icon}</span>
                                        <small>{label}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            },
            align: "left",
        },
        {
            title: "Chất lượng",
            width: "20%",
            key: "chat_luong",
            render: (record: IEvaluate) => (
                <div style={{ textAlign: "left" }}>
                    <div className="flex justify-between">
                        <span>Đánh giá tổng quan: </span>
                        <Rate disabled value={record.tong_so_sao_trung_binh} />
                    </div>
                    <div className="flex justify-between">
                        <span>Sản phẩm: </span>
                        <Rate disabled value={record.so_sao_san_pham} />
                    </div>
                    <div className="flex justify-between">
                        <span>Vận chuyển: </span>
                        <Rate disabled value={record.so_sao_dich_vu_van_chuyen} />
                    </div>
                </div>
            ),
            align: "left",
        },
        {
            title: "Hành động",
            width: "20%",
            key: "hanh_dong",
            render: (_, record: IEvaluate) => (
                <Space style={{ paddingBottom: "80px" }}>
                    <Button
                        className="bg-gradient-to-r from-blue-500 to-blue-400 text-white hover:bg-blue-600 shadow-md"
                        onClick={() => showDetail(record)}
                        type="link"
                    >
                        Xem chi tiết
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc muốn ẩn đánh giá này không?"
                        onConfirm={() => hideEvaluate.mutate(record.id as number)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button
                            // onClick={() => hideEvaluate.mutate(record.id as number)}
                            className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300">
                            Gỡ ẩn
                        </Button>
                    </Popconfirm>
                </Space>
            ),
            align: "left",
        },
    ];

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="md:text-base">
                    Quản trị / <span className="font-semibold px-px">Đánh giá</span>
                </h1>
            </div>
            <div className="flex items-center justify-between">
                <h1 className="font-semibold md:text-3xl">Đánh giá sản phẩm</h1>
                <div className="flex">

                    <Link to="/admin/evaluates">
                        <Button className="bg-gradient-to-r  from-red-500 to-orange-500 text-white rounded-lg py-1 hover:bg-red-600 shadow-md transition-colors flex items-center">
                            {/* <DeleteOutlined className="mr-1" /> */}
                            Quay lại
                        </Button>
                    </Link>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={{ pageSize: 10, className: "my-5" }}
                loading={isLoading}
            />
            <Modal
                open={isModalOpen}
                onCancel={handleCancel}
                width={800}
                footer={[
                    <button
                        key="cancel"
                        onClick={handleCancel}
                        className="bg-gray-300 text-black px-4 py-2 mr-2 rounded hover:bg-gray-400"
                    >
                        Hủy
                    </button>,
                    <button
                        key="ok"
                        onClick={handleOk}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={!phan_hoi[currentEvaluate?.id as number]}
                    >
                        Gửi
                    </button>,
                ]}
            >
                <h1 className="text-3xl font-bold">Chi tiết đánh giá</h1>
                {currentEvaluate && (
                    <div className="flex flex-col gap-2">
                        <div style={{ textAlign: "left" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {currentEvaluate.san_pham?.length > 0 ? (
                                    currentEvaluate.san_pham.map((product: any) => (
                                        <div
                                            key={product.id}
                                            style={{ display: "flex", alignItems: "center", gap: "10px" }}
                                        >
                                            {product.anh_san_pham ? (
                                                <img
                                                    src={product.anh_san_pham}
                                                    alt={product.ten_san_pham}
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                        objectFit: "cover",
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                            ) : (
                                                <span>Ảnh sản phẩm ẩn</span>
                                            )}
                                            <span>{product.ten_san_pham || "Sản phẩm ẩn"}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span>Không có sản phẩm</span>
                                )}
                            </div>
                        </div>
                        <p>
                            <strong>
                                {" "}
                                {currentEvaluate.user?.ho + " " + currentEvaluate.user?.ten}:
                            </strong>{" "}
                            {currentEvaluate.mo_ta}
                        </p>
                        <div>
                            <div className="flex justify-between">
                                <strong>Đánh giá tổng quan: </strong>
                                <Rate disabled value={currentEvaluate.tong_so_sao_trung_binh} />
                            </div>
                            <div className="flex justify-between">
                                <strong>Sản phẩm: </strong>
                                <Rate disabled value={currentEvaluate.so_sao_san_pham} />
                            </div>
                            <div className="flex justify-between">
                                <strong>Vận chuyển: </strong>
                                <Rate
                                    disabled
                                    value={currentEvaluate.so_sao_dich_vu_van_chuyen}
                                />
                            </div>
                        </div>
                        <strong>Ảnh đánh giá:</strong>
                        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                            {currentEvaluate.anh_danh_gias?.length > 0 ? (
                                currentEvaluate?.anh_danh_gias?.map((img: any) => (
                                    <Image
                                        key={img.id}
                                        src={img.anh_danh_gia}
                                        alt="Ảnh đánh giá"
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            objectFit: "cover",
                                            borderRadius: "5px",
                                        }}
                                    />
                                ))
                            ) : (
                                <span>Không có ảnh đánh giá</span>
                            )}
                        </div>
                        <Input.TextArea
                            rows={4}
                            value={phan_hoi[currentEvaluate.id as number] || ""}
                            onChange={(e) =>
                                handlephan_hoiChange(
                                    currentEvaluate.id as number,
                                    e.target.value
                                )
                            }
                            placeholder="Nhập phản hồi"
                            disabled={!!currentEvaluate.phan_hoi}
                        />
                    </div>
                )}
            </Modal>
        </main>
    );
};

export default RemoteEvaluate;