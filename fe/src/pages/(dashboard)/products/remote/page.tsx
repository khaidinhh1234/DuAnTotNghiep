
import React, { useRef, useState } from "react";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Popconfirm, Space, Table, message } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import instance from "@/configs/axios";

interface DataType {
  key: React.Key;
  id: string;
  anh_san_pham: string;
  ten_san_pham: string;
  id_danh_muc: string;
  luot_xem: number;
  mo_ta_ngan: string;
  noi_dung: string;
}

type DataIndex = keyof DataType;


const ProductsRemote: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const searchInput = useRef<InputRef>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sanpham-remote"],
    queryFn: async () => {
      try {
        const response = await instance.get("/admin/sanpham/thung-rac");
        console.log("Fetched data:", response.data); // In ra dữ liệu sau khi lấy được

        return response.data;
      } catch (error) {
        console.error("Error fetching remote products:", error);
        throw new Error("Error fetching remote products");
      }
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

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      await instance.post(`/admin/sanpham/thung-rac/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["sanpham-remote"]);
      message.success("Khôi phục sản phẩm thành công");
      navigate("/admin/products");

    },
    onError: () => {
      message.error("Khôi phục sản phẩm thất bại");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await instance.delete(`/admin/sanpham/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["sanpham-remote"]);
      message.success("Xóa sản phẩm vĩnh viễn thành công");
    },
    onError: () => {
      message.error("Xóa sản phẩm vĩnh viễn thất bại");
    },
  });

  const handleRestore = (id: string) => {
    restoreMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
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

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
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
            Search
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
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
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
      title: "Ảnh sản phẩm",
      render: (record) => (
        <img
          src={record.anh_san_pham}
          alt=""
          className="w-20 h-20 object-cover rounded-lg p-2 border "
        />
      ),
      className: "pl-10",
      width: "15%",
      key: "anh_san_pham",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "ten_san_pham",
      key: "ten_san_pham",
      width: "15%",
      ...getColumnSearchProps("ten_san_pham"),
      sorter: (a, b) => a.ten_san_pham.length - b.ten_san_pham.length,
    },
    {
      title: "Danh mục",
      dataIndex: "ten_danh_muc",
      key: "ten_danh_muc",
      width: "15%",
      ...getColumnSearchProps("ten_danh_muc"),
      sorter: (a, b) => a.ten_danh_muc.length - b.ten_danh_muc.length,
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
      title: "Quản trị",
      key: "action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Xóa vĩnh viễn sản phẩm"
            description="Bạn có chắc chắn muốn xóa vĩnh viễn không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button className="bg-white text-red-500 border border-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 shadow-md transition-colors">
              Xóa vĩnh viễn
            </Button>
          </Popconfirm>
          <Button
            onClick={() => handleRestore(record.id)}
            className="bg-white text-green-500 border border-green-500 rounded-lg hover:bg-green-50 hover:text-green-600 shadow-md transition-colors"
          >
            Khôi phục
          </Button>
        </Space>
      ),
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(searchText);
      // Perform search action here
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className=" md:text-base">
          Quản trị / Sản phẩm /{" "}
          <span className="font-semibold px-px=">Thùng rác </span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className=" font-semibold md:text-3xl"> Thùng rác</h1>
        <div>
          {" "}
          <Link to="/admin/products">
            <Button className="ml-auto bg-black text-white rounded-lg  py-1">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      <div className=" ">
        <div className="max-w-xs my-2">
          <Input
            placeholder="Tìm kiếm..."
            size="large"
            value={searchText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Table
          columns={columns}
          dataSource={sanpham}
          loading={isLoading}
          rowKey="id"
        />
      </div>
    </main>
  );
};

export default ProductsRemote;
