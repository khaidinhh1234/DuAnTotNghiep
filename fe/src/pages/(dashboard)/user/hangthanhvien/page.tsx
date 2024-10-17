import React, { useRef, useState } from "react";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Space, Table, message } from "antd";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import "@/global.css";


import type { InputRef, TableColumnsType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import instance from "@/configs/admin";

interface DataType {
  id: any;
  stt: number;
  key: React.Key;
  anh_san_pham: string;
  ten_san_pham: string;
  ten_danh_muc: string;
  id_danh_muc: string;
  luot_xem: number;
  mo_ta_ngan: string;
  noi_dung: string;
  trang_thai: number;
  tongSoLuong: number;
  chi_tieu_toi_thieu: number;
  chi_tieu_toi_da: number;
  ten_hang_thanh_vien: string;
}

export interface Category {
  _id?: string;
  ten_danh_muc?: string;
  slug?: string;
}

type DataIndex = keyof DataType;

const Rank: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["rank"],
    queryFn: async () => {
      const res = await instance.get("/hangthanhvien");
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const response = await instance.delete(`/hangthanhvien/${id}`);
      if (response.data.status) {
        return id;
      } else {
        throw new Error(response.data.message || "Failed to delete");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rank"] });
      message.success("Xóa hạng của thành viên thành công");
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      message.error("Xóa hạng của thành viên thất bại");
    },
  });

  const rank = data?.data.map((item: any, index: number) => ({
    ...item,
    key: index,
  }));

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

  const columns: TableColumnsType<DataType> = [
    {
      title: "STT",
      key: "stt",

      render: (item) => item.key + 1,
      width: "5%",
    },
    {
      title: "Hạng thành viên",

      ...getColumnSearchProps("ten_hang_thanh_vien"),
      sorter: (a, b) =>
        a.ten_hang_thanh_vien.localeCompare(b.ten_hang_thanh_vien),

      render: (record: any) => (
        <div className="flex items-center">
          <img
            src={record.anh_hang_thanh_vien || "https://via.placeholder.com/24"}
            alt="member rank"
            className="w-12 h-12 object-cover rounded-none mr-2"
          />
          <span className="text-sm font-medium capitalize">
            {record.ten_hang_thanh_vien || "Chưa có hạng"}
          </span>
        </div>
      ),
      className: "pl-4",
      width: "20%",
      key: "hang_thanh_vien",
    },
    {
      title: "Chi tiêu",
      dataIndex: "",
      key: "chi_tieu",
      width: "30%",
      // ...getColumnSearchProps("chi_tieu"),
      sorter: (a, b) =>
        a.chi_tieu_toi_thieu - b.chi_tieu_toi_thieu ||
        a.chi_tieu_toi_da - b.chi_tieu_toi_da,
      render: (record) => {
        const formatCurrency = (value: number): string =>
          new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(value);

        return `${formatCurrency(record.chi_tieu_toi_thieu)} - ${formatCurrency(record.chi_tieu_toi_da)}`;
      },
    },

    {
      title: "Quản trị",
      key: "action",
      render: (_, item) => (
        <Space>
          <Popconfirm
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => deleteMutation.mutate(item.id)}
          >
            <Button className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300">
              Xóa
            </Button>
          </Popconfirm>
          <Link to={`/admin/users/rank/edit/${item.id}`}>
            <Button className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold">
              Cập nhật
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     console.log(searchText);
  //   }
  // };
  isError && <div>Đã xảy ra lỗi</div>;
  isLoading && <div>Đang tải dữ liệu...</div>;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị /{" "}
          <span className="font-semibold px-px">hạng thành viên</span>
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Hạng thành viên</h1>
        <div className="flex">
          <Link to="/admin/users/rankadd" className="mr-1">
            <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              <i className="fa-sharp fa-solid fa-plus text-2xl"></i>
              Thêm
            </Button>
          </Link>
          <Link to="/admin/users/remoterank">
            <Button className="bg-gradient-to-r  from-red-500 to-orange-500 text-white rounded-lg py-1 hover:bg-red-600 shadow-md transition-colors flex items-center">
              <DeleteOutlined className="mr-1" />
              Thùng rác
            </Button>
          </Link>
        </div>
      </div>
      <div className="max-w-4xl">
        <Table
          columns={columns}
          dataSource={rank}
          pagination={{ pageSize: 10, className: "my-5" }}
          rowKey="id"
        />
      </div>
    </main>
  );
};

export default Rank;
