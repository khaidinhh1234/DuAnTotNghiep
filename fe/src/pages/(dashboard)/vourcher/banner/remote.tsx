import React from "react";
// import { SearchOutlined } from "@ant-design/icons";
import { Button, message, Space, Table } from "antd";
// import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "@/global.css";

import type { TableColumnsType } from "antd";
// import type { FilterDropdownProps } from "antd/es/table/interface";
import instance from "@/configs/admin";

interface DataType {
  id: number;
  ten_uu_dai: string;
  mo_ta: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  gia_tri_uu_dai: number;
  loai: string;
  duong_dan_anh: string;
  ngay_hien_thi: string;
}

const ChuongTrinhUuDaiRemote: React.FC = () => {
  // const [searchedColumn, setSearchedColumn] = useState<string>("");
  // const [searchText, setSearchText] = useState<string>("");
  // const searchInput = useRef<InputRef>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["chuongtrinhuudai"],
    queryFn: async () => {
      const res = await instance.get("/chuongtrinhuudai/thung-rac");
      return res.data;
    },
  });

  const chuongTrinhUuDai = React.useMemo(() => {
    if (!data || !data.data) {
      console.error("Data is not in the expected format:", data);
      return [];
    }
    const dataArray = Array.isArray(data.data) ? data.data : [data.data];
    return dataArray.map((item: DataType, index: number) => ({
      ...item,
      key: index,
    }));
  }, [data]);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (id: string | number) => {
      try {
        const response = await instance.post(
          `/chuongtrinhuudai/thung-rac/${id}`
        );
        if (response.data.status) {
          message.open({
            type: "success",
            content: "Khôi phục thành công",
          });
          return id;
        } else {
          throw new Error(response.data.message || "Failed to delete");
        }
      } catch (error) {
        message.error("Khôi phục thất bại");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chuongtrinhuudai"] });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      message.open({
        type: "error",
        content: "Xóa danh mục thất bại",
      });
    },
  });
  // const handleSearch = (
  //   selectedKeys: string[],
  //   confirm: FilterDropdownProps["confirm"],
  //   dataIndex: DataIndex
  // ) => {
  //   confirm();
  //   setSearchText(selectedKeys[0]);
  //   setSearchedColumn(dataIndex);
  // };

  // const handleReset = (clearFilters: () => void) => {
  //   clearFilters();
  //   setSearchText("");
  // };

  // const getColumnSearchProps = (dataIndex: DataIndex) => ({
  //   filterDropdown: ({
  //     setSelectedKeys,
  //     selectedKeys,
  //     confirm,
  //     clearFilters,
  //   }: FilterDropdownProps) => (
  //     <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
  //       <Input
  //         ref={searchInput}
  //         placeholder={`Tìm ${dataIndex}`}
  //         value={selectedKeys[0]}
  //         onChange={(e) =>
  //           setSelectedKeys(e.target.value ? [e.target.value] : [])
  //         }
  //         onPressEnter={() =>
  //           handleSearch(selectedKeys as string[], confirm, dataIndex)
  //         }
  //         style={{ marginBottom: 8, display: "block" }}
  //       />
  //       <Space>
  //         <Button
  //           type="primary"
  //           onClick={() =>
  //             handleSearch(selectedKeys as string[], confirm, dataIndex)
  //           }
  //           icon={<SearchOutlined />}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           Tìm kiếm
  //         </Button>
  //         <Button
  //           onClick={() => clearFilters && handleReset(clearFilters)}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           Reset
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: (filtered: boolean) => (
  //     <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
  //   ),
  //   onFilter: (value: string, record: DataType) =>
  //     record[dataIndex]
  //       .toString()
  //       .toLowerCase()
  //       .includes(value.toLowerCase()),
  //   onFilterDropdownOpenChange: (visible: boolean) => {
  //     if (visible) {
  //       setTimeout(() => searchInput.current?.select(), 100);
  //     }
  //   },
  //   render: (text: string) =>
  //     searchedColumn === dataIndex ? (
  //       <Highlighter
  //         highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
  //         searchWords={[searchText]}
  //         autoEscape
  //         textToHighlight={text ? text.toString() : ""}
  //       />
  //     ) : (
  //       text
  //     ),
  // });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // This will return the date in YYYY-MM-DD format
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => index + 1,
      width: "5%",
    },
    {
      title: "Ảnh",
      width: "15%",
      key: "duong_dan_anh",
      dataIndex: "duong_dan_anh",
      render: (duong_dan_anh: string) =>
        duong_dan_anh ? (
          <img
            src={duong_dan_anh}
            alt="Ảnh danh mục"
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />
        ) : (
          <span>Ảnh không có</span>
        ),
    },
    {
      title: "Tên ưu đãi",
      dataIndex: "ten_uu_dai",
      key: "ten_uu_dai",
      // ...getColumnSearchProps("ten_uu_dai"),
      sorter: (a, b) => a.ten_uu_dai.localeCompare(b.ten_uu_dai),
      width: "20%",
    },
    {
      title: "Mô tả",
      dataIndex: "mo_ta",
      key: "mo_ta",
      // ...getColumnSearchProps("mo_ta"),
      width: "25%",
    },
    {
      title: "Ngày Hiển thị",
      dataIndex: "ngay_hien_thi",
      key: "ngay_hien_thi",
      render: (text) => formatDate(text),
      sorter: (a, b) =>
        new Date(a.ngay_hien_thi).getTime() -
        new Date(b.ngay_hien_thi).getTime(),
      width: "15%",
    },
    {
      title: "Thời gian",
      key: "thoi_gian",
      render: (record) =>
        `${formatDate(record.ngay_bat_dau)} - ${formatDate(record.ngay_ket_thuc)}`,
      sorter: (a, b) =>
        new Date(a.ngay_bat_dau).getTime() - new Date(b.ngay_bat_dau).getTime(),
      width: "20%",
    },

    {
      title: "Giá trị ưu đãi",
      dataIndex: "gia_tri_uu_dai",
      key: "gia_tri_uu_dai",
      render: (value, record) =>
        `${value}${record.loai === "phan_tram" ? "%" : ""}`,
      width: "10%",
    },
    // {
    //   title: "Loại",
    //   dataIndex: "loai",
    //   key: "loai",
    //   render: (value) => value === 'phan_tram' ? 'Phần trăm' : 'Giá trị cố định',
    //   width: "10%",
    // },
    {
      title: "Quản trị",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold"
            onClick={() => mutate(record.id)}
          >
            Khôi phục
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Chương trình ưu đãi /{" "}
          <span className="font-semibold px-px">Thùng rác</span>
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Thùng rác</h1>
        <div className="flex">
          <Link to="/admin/chuongtrinhuudai" className="mr-1">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              Quay lại{" "}
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-full">
        <Table
          columns={columns}
          dataSource={chuongTrinhUuDai}
          pagination={{ pageSize: 10, className: "my-5" }}
          rowKey="id"
          loading={isLoading}
        />
      </div>
    </main>
  );
};

export default ChuongTrinhUuDaiRemote;
