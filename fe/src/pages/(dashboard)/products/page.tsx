
import React, { useRef, useState } from "react";
import { DeleteOutlined, SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Space, Table, Switch, message } from "antd";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import instance from "@/configs/axios";
import type { InputRef, TableColumnsType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";

interface DataType {
  id: any;
  key: React.Key;
  anh_san_pham: string;
  ten_san_pham: string;
  id_danh_muc: string;
  luot_xem: number;
  mo_ta_ngan: string;
  noi_dung: string;
  trang_thai: boolean;
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
      const res = await instance.patch(`/admin/sanpham/${id}`, { dang_hoat_dong: status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["sanpham"]);
      message.success("Cập nhật trạng thái thành công");
    },
    onError: () => {
      message.error("Cập nhật trạng thái thất bại");
    },
  });

  const handleStatusChange = (checked: boolean, id: string) => {
    const newStatus = checked ? 1 : 0;
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const sanpham = data?.data.map((item: any, index: number) => ({
    ...item,
    key: item.id,
    index,
    ten_danh_muc: item.danh_muc ? item.danh_muc.ten_danh_muc : "Không có danh mục",
    dang_hoat_dong: item.dang_hoat_dong || 0,
    tongSoLuong: item.bien_the_san_pham?.reduce((total: number, variant: any) => {
      return total + (variant.so_luong_bien_the || 0);
    }, 0) || 0,
  }));
  
  console.log("data", data);
  console.log("sanpham", sanpham);

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
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
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
      record[dataIndex]?.toString().toLowerCase().includes((value as string).toLowerCase()),
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
      width: "10%",
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
    // {
    //   title: "Mô tả ngắn",
    //   dataIndex: "mo_ta_ngan",
    //   key: "mo_ta_ngan",
    //   width: "15%",
      
    // },
    {
      title: "Trạng thái",
      dataIndex: "dang_hoat_dong",
      key: "dang_hoat_dong",
      width: "15%",
      render: (text, item) => (
        <Switch
          checked={item.trang_thai === 1}
          onChange={(checked) => handleStatusChange(checked, item.id)}
          checkedChildren="Hoạt động"
          unCheckedChildren="Không hoạt động"
          loading={updateStatusMutation.isLoading}
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
            onConfirm={() => console.log("Xóa sản phẩm:", item.key)}
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
      <div>
        <div className="max-w-xs my-2">
          <Input
            placeholder="Tìm kiếm..."
            size="large"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        {isLoading ? (
          <div>Đang tải dữ liệu...</div>
        ) : isError ? (
          <div>
            Đã xảy ra lỗi!{" "}
            <Button
              onClick={() => refetch()}
              icon={<ReloadOutlined />}
              className="ml-2"
            >
              Thử lại
            </Button>
          </div>
        ) : sanpham && sanpham.length > 0 ? (
          <Table columns={columns} dataSource={sanpham} pagination={{ pageSize: 5 }} />
        ) : (
          <div>Không có sản phẩm nào</div>
        )}
      </div>
    </main>
  );
};

export default ProductsAdmin;
