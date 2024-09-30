import "@/global.css";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Input,
  Popconfirm,
  Space,
  Spin,
  Switch,
  Table,
  message,
} from "antd";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";

import instance from "@/configs/axios";
import type { InputRef, TableColumnsType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";

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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sanpham"],
    queryFn: async () => {
      const res = await instance.get("/admin/sanpham");
      return res.data;
    },
  });
  const { mutate } = useMutation({
    mutationFn: async ({ checked, data }: { checked: boolean; data: any }) => {
      try {
        // console.log(checked, data);
        const id = data.id;
        if (checked) {
          const res = await instance.post(`/admin/sanpham/kich-hoat/${id}`);
          message.success("kích hoạt thành công");

          return res.data;
        } else {
          const res = await instance.post(`/admin/sanpham/huy-kich-hoat/${id}`);
          message.success("Hủy kích hoạt thành công");
          return res.data;
        }
      } catch (error: any) {
        message.error("Cập nhật trạng thái thất bại");
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sanpham"] });
    },
  });

  // const handleStatusChange = (checked: boolean, product: any) => {
  //   const newStatus = checked ? 1 : 0;
  //   updateStatusMutation.mutate({ id: product.id, status: newStatus });
  // };

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const response = await instance.delete(`/admin/sanpham/${id}`);
      if (response.data.status) {
        return id;
      } else {
        throw new Error(response.data.message || "Failed to delete");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sanpham"] });
      message.open({
        type: "success",
        content: "Xóa sản phẩm thành công",
      });
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      message.open({
        type: "error",
        content: "Xóa sản phẩm thất bại",
      });
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
      key: "id",
      className: "pl-5",
      render: (item) => <p className="ml-2">{item.index + 1}</p>,
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
        // console.log(item.trang_thai),
        <Switch
          checked={item.trang_thai === 1 ? true : false}
          onChange={(checked) => mutate({ checked, data: item })}
          checkedChildren=""
          unCheckedChildren=""
          // loading={updateStatusMutation.isLoading}
          className={` custom-switch`}
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
            <Button className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300">
              Xóa
            </Button>
          </Popconfirm>
          <Link to={`/admin/products/edit/${item.id}`}>
            <Button className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold">
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
  if (isError)
    return (
      <div>
        <div className="flex items-center justify-center  mt-[250px]">
          <div className=" ">
            <Spin size="large" />
          </div>
        </div>
      </div>
    );
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold">Sản phẩm</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Danh sách sản phẩm</h1>
        <div className="flex gap-2">
          <Link to="/admin/products/add" className="mr-1">
            <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              <i className="fa-sharp fa-solid fa-plus text-2xl"></i>
              Thêm sản phẩm
            </Button>
          </Link>
          <Link to="/admin/products/remote">
            <Button className="bg-gradient-to-r  from-red-500 to-orange-500 text-white rounded-lg py-1 hover:bg-red-600 shadow-md transition-colors flex items-center">
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
        loading={isLoading}
      />
    </main>
  );
};

export default ProductsAdmin;
