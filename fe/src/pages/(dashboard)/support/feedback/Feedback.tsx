import { IEvaluate } from "@/common/types/evaluate";
import instance from "@/configs/admin";

import { SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Image,
  Input,
  InputRef,
  message,
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
import { useParams } from "react-router-dom";

type DataIndex = keyof IEvaluate;
const Feedback = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);
  // Query to fetch evaluations
  const { data, isLoading, isError } = useQuery({
    queryKey: ["phanhoilienhe"],
    queryFn: async () => {
      const response = await instance.get(`/lien-he`);
      return response.data;
    },
  });
  console.log(data)
  const toggleExpand = (id: number) => {
    setExpandedKeys((prevKeys) =>
      prevKeys.includes(id)
        ? prevKeys.filter((key) => key !== id)
        : [...prevKeys, id]
    );
  };
  
  // Mutation to send replies to API
  const mutation = useMutation({
    mutationFn: async ({
      id,
      noi_dung_phan_hoi,
    }: {
      id: number | string;
      noi_dung_phan_hoi: string;
    }) => {
      try {
        message.open({
          type: "success",
          content: "Phản hồi thành công!",
        })
        const response = await instance.put(`/lien-he/${id}`, {
          noi_dung_phan_hoi: noi_dung_phan_hoi,
        });
     console.log(response ,'ưefdas')
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries({ queryKey: ["phanhoilienhe"] });
    },
    onError: (error) => {
      console.error("Error:", error);
      message.error("Có lỗi xảy ra khi phản hồi"); 
    },
  });
  

  const hideEvaluate = useMutation({
    mutationFn: async (id: number) => {

      await instance.delete(`/lien-he/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["phanhoilienhe"] });
    },
    onError: (error) => {
      console.error("Error hiding review:", error);
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvaluate, setCurrentEvaluate] = useState<any | null>(null);
  const [phan_hoi, setphan_hoi] = useState<{ [key: number]: string }>({});

  const showModal = (record: IEvaluate) => {
    setCurrentEvaluate(record);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    if (currentEvaluate && phan_hoi[currentEvaluate.id as number]) {
      mutation.mutate({
        id: currentEvaluate.id,
        noi_dung_phan_hoi: phan_hoi[currentEvaluate.id as number],
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
    data?.danh_gias?.map((evaluate: IEvaluate) => ({
      key: evaluate.id,
      ...evaluate,
      user_id:
        evaluate?.user?.ten + " " + evaluate?.user?.ho || "Chưa có dữ liệu",
      san_pham_id: evaluate.san_pham?.ten_san_pham || "Chưa có dữ liệu",
      // anh_danh_gias: evaluate.anh_danh_gias? || "Chưa có dữ liệu",
    })) || [];

  const columns: TableColumnsType<IEvaluate> = [
    {
      title: "Nội dung",
      width: "30%",
      key: "mo_ta",
      sorter: (a: any, b: any) => a.mo_ta?.localeCompare(b.mo_ta) || 0,
      render: (record: IEvaluate) => {
        const content =
          record.mo_ta.length > 100
            ? `${record.mo_ta.substring(0, 100)}...`
            : record.mo_ta;

        return (
          <div style={{textAlign: "left", paddingBottom: "60px"  }}>
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
      ...getColumnSearchProps("san_pham_id"),
      sorter: (a: any, b: any) =>
        a.san_pham?.ten_san_pham?.localeCompare(b.san_pham?.ten_san_pham) || 0,
      render: (record: IEvaluate) => (
        <div style={{ textAlign: "left", paddingBottom: "60px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            {record.san_pham?.anh_san_pham ? (
              <img
                src={record.san_pham.anh_san_pham}
                alt={record.san_pham.ten_san_pham}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ) : (
              "Ảnh phản hồi ẩn"
            )}
            <span>{record.san_pham?.ten_san_pham || "Sản phẩm ẩn"}</span>
          </div>
        </div>
      ),
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
          >
            <Button className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300">
              Ẩn
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
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10, className: "my-5" }}
        loading={isLoading}
      />
      <Modal
        // title="Chi tiết đánh giá"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <h1 className="text-3xl font-bold">Chi tiết đánh giá</h1>
        {currentEvaluate && (
          <div className="flex flex-col gap-2">
            <div style={{ textAlign: "left" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                {currentEvaluate.san_pham?.anh_san_pham ? (
                  <img
                    src={currentEvaluate.san_pham.anh_san_pham}
                    alt={currentEvaluate.san_pham.ten_san_pham}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  "Ảnh phản hồi ẩn"
                )}
                <span>
                  {currentEvaluate.san_pham?.ten_san_pham || "Sản phẩm ẩn"}
                </span>
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

export default Feedback;