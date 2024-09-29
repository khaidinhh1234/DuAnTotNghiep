import React, { useRef, useState } from "react";
import {
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Input, Popconfirm, Space, Table, Switch, message } from "antd";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import "@/global.css";

import instance from "@/configs/axios";
import type { InputRef, TableColumnsType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import { toast } from "react-toastify";

interface DataType {
  id: any;
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
}

export interface Category {
  _id?: string;
  ten_danh_muc?: string;
  slug?: string;
}

type DataIndex = keyof DataType;

const ProductsAdmin: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["sanpham"],
    queryFn: async () => {
      const res = await instance.get("/admin/sanpham");
      return res.data;
    },
  });
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: number }) => {
      if (status === 1) {
        // Change this line to use the correct endpoint for activating products
        const res = await instance.post(`/admin/sanpham/kich-hoat/${id}`);
        return res.data;
      } else {
        const res = await instance.post(`/admin/sanpham/huy-kich-hoat/${id}`);
        return res.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sanpham"] });
      message.success("Cập nhật trạng thái thành công");
    },
    onError: () => {
      message.error("Cập nhật trạng thái thất bại");
    },
  });

  const handleStatusChange = (checked: boolean, product: any) => {
    const newStatus = checked ? 1 : 0;
    updateStatusMutation.mutate({ id: product.id, status: newStatus });
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const response = await instance.delete(`/admin/sanpham/${id}`);
      if (response.data.status) {
        return id;
      } else {
        throw new Error(response.data.message || "Failed to delete");
      }
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["sanpham"] });
      toast.success("Xóa sản phẩm thành công");
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      toast.error("Xóa sản phẩm thất bại");
    },
  });

  const sanpham = data?.data.map((item: any, index: number) => ({
    ...item,
    key: item.id,
    index,
    ten_danh_muc: item.danh_muc
      ? item.danh_muc.ten_danh_muc
      : "Không có danh mục",
    trang_thai: item.trang_thai || 0,
    tongSoLuong:
      item.bien_the_san_pham?.reduce((total: number, variant: any) => {
        return total + (variant.so_luong_bien_the || 0);
      }, 0) || 0,
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
      render: (text, item, index) => index + 1,
      width: "5%",
    },
    {
      title: "Ảnh sản phẩm",
      render: (item) => (
        <img
          src={item.anh_san_pham || "https://via.placeholder.com/150"}
          alt="product"
          className="w-24 h-24 object-cover rounded-lg p-2 border"
        />
      ),
      className: "pl-12",
      width: "15%",
      key: "anh_san_pham",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "ten_san_pham",
      key: "ten_san_pham",
      width: "15%",
      ...getColumnSearchProps("ten_san_pham"),
      sorter: (a, b) => a.ten_san_pham.localeCompare(b.ten_san_pham),
    },
    {
      title: "Danh mục",
      dataIndex: "ten_danh_muc",
      key: "ten_danh_muc",
      width: "15%",
      ...getColumnSearchProps("ten_danh_muc"),
      sorter: (a, b) => a.ten_danh_muc.localeCompare(b.ten_danh_muc),
    },
    {
      title: "Kho",
      dataIndex: "tongSoLuong",
      key: "tongSoLuong",
      width: "15%",
      render: (text) => {
        return text ? (
          `${text.toLocaleString()} `
        ) : (
          <span style={{ color: "#ff5555" }}>Hết hàng</span>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      width: "15%",
      render: (_, item) => (
        <Switch
          checked={item.trang_thai === 1}
          onChange={(checked) => handleStatusChange(checked, item)}
          checkedChildren=""
          unCheckedChildren=""
          // loading={updateStatusMutation.isLoading}
          className="custom-switch"
        />
      ),
    },
    {
      title: "Quản trị",
      key: "action",
      render: (_, item) => (
        <Space>
          <Popconfirm
            title="Chuyển vào thùng rác"
            description="Bạn có chắc chắn muốn xóa không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => deleteMutation.mutate(item.id)}
          >
            <Button className="bg-white text-red-500 border border-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 shadow-md transition-colors">
              Xóa
            </Button>
          </Popconfirm>
          <Link to={`/admin/products/edit/${item.id}`}>
            <Button className="bg-white text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50 hover:text-orange-600 shadow-md transition-colors">
              Cập nhật
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(searchText);
    }
  };
  isError && <div>Đã xảy ra lỗi</div>;
  isLoading && <div>Đang tải dữ liệu...</div>;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold">Sản phẩm</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Sản phẩm</h1>
        <div className="flex gap-2">
          <Link to="/admin/products/add" className="mr-1">
            <Button className="bg-blue-500 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              <i className="fa-sharp fa-solid fa-plus text-2xl"></i>
              Thêm sản phẩm
            </Button>
          </Link>
          <Link to="/admin/products/remote">
            <Button className="bg-red-500 text-white rounded-lg py-1 hover:bg-red-600 shadow-md transition-colors flex items-center">
              <DeleteOutlined className="mr-1" />
              Thùng rác
            </Button>
          </Link>
        </div>
      </div>
      <div className="max-w-xs my-2">
        <Input
          placeholder="Tìm kiếm..."
          size="large"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <Table
        columns={columns}
        dataSource={sanpham}
        pagination={{ pageSize: 5 }}
      />
    </main>
  );
};

export default ProductsAdmin;
