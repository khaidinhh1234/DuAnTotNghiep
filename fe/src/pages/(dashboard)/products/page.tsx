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
  Dropdown,
  Menu,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";

import type { InputRef, TableColumnsType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import instance from "@/configs/admin";
import Detail from "./detail/page";

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
  ma_san_pham: string;
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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sanpham"],
    queryFn: async () => {
      const res = await instance.get("/sanpham");
      return res.data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: async ({ checked, data }: { checked: boolean; data: any }) => {
      try {
        const id = data.id;
        if (checked) {
          const res = await instance.post(`/sanpham/kich-hoat/${id}`);
          message.success("Kích hoạt thành công");
          return res.data;
        } else {
          const res = await instance.post(`/sanpham/huy-kich-hoat/${id}`);
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

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const response = await instance.delete(`/sanpham/${id}`);
      if (response.data.status) {
        return id;
      } else {
        throw new Error(response.data.message || "Failed to delete");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sanpham"] });
      message.success("Xóa sản phẩm thành công");
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      message.error("Xóa sản phẩm thất bại");
    },
  });

  const { mutate: mutateExcel } = useMutation({
    mutationFn: async () => {
      const res = await instance.get("sanpham/exports", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sanpham.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onError: (error) => {
      console.error("Error exporting excel:", error);
      message.error("Xuất file excel thất bại");
    },
  });
  const bulkActionMutation = useMutation({
    mutationFn: async ({
      action,
      ids,
    }: {
      action: string;
      ids: React.Key[];
    }) => {
      let endpoint = "";
      let method = "patch";
      let payload: any = {};

      switch (action) {
        case "activate":
          endpoint = "sanphams/trang-thai-nhieu-san-pham";
          payload = { san_phams: ids, trang_thai: true };
          break;
        case "deactivate":
          endpoint = "sanphams/trang-thai-nhieu-san-pham";
          payload = { san_phams: ids, trang_thai: false };
          break;

        case "delete":
          endpoint = "sanpham";
          method = "delete";

          payload = { san_phams: ids };
          break;
        default:
          throw new Error("Invalid action");
      }

      if (method === "patch") {
        const response = await instance.patch(endpoint, payload);
        return response.data;
      } else {
        const response = await instance.delete(endpoint, { data: payload });
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sanpham"] });
      message.success("Cập nhật trạng thái thành công");
      setSelectedRowKeys([]);
    },
    onError: (error) => {
      console.error("Error performing bulk action:", error);
      message.error("Cập nhật trạng thái thất bại");
    },
  });

  const sanpham = data?.data.map((item: any, index: number) => ({
    ...item,
    key: item.key || item.id,
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

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const handleBulkAction = (action: string) => {
    bulkActionMutation.mutate({ action, ids: selectedRowKeys });
  };

  const bulkActionMenu = (
    <Menu>
      {/* <Menu.Item key="activate" onClick={() => handleBulkAction("activate")}>
        Kích hoạt
      </Menu.Item> */}
      <Menu.Item
        key="deactivate"
        onClick={() => handleBulkAction("deactivate")}
      >
        Hủy kích hoạt
      </Menu.Item>
      {/* <Menu.Item key="delete" onClick={() => handleBulkAction("delete")}>
        Xóa
      </Menu.Item> */}
    </Menu>
  );

  const columns: TableColumnsType<DataType> = [
    {
      title: "Sản phẩm",
      key: "ten_san_pham",
      render: (item: any) => <Detail item={item} />,
      width: "25%",
      sorter: (a, b) => a.ten_san_pham.localeCompare(b.ten_san_pham),
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "ma_san_pham",
      key: "ma_san_pham",
      width: "15%",
      ...getColumnSearchProps("ma_san_pham"),
      sorter: (a, b) => a.ma_san_pham.localeCompare(b.ma_san_pham),
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
      sorter: (a, b) => a.tongSoLuong - b.tongSoLuong,
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
          checked={item.trang_thai === 1 ? true : false}
          onChange={(checked) => mutate({ checked, data: item })}
          checkedChildren=""
          unCheckedChildren=""
          className={`custom-switch`}
        />
      ),
    },
    {
      title: "Quản trị",
      key: "action",
      className: "text-center",
      render: (_, item) => (
        <Space>
          {/* <Popconfirm
            title="Chuyển vào thùng rác"
            description="Bạn có chắc chắn muốn xóa không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => deleteMutation.mutate(item.id)}
          >
            <Button className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300 ">
              Xóa
            </Button>
          </Popconfirm> */}
          <Link to={`/admin/products/edit/${item.id}`}>
            <Button className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold">
              Cập nhật
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  const [filteredData, setFilteredData] = useState<DataType[]>([]);

  useEffect(() => {
    if (sanpham) {
      setFilteredData(sanpham);
    }
  }, [data?.data]);

  const handleKeyDown = (_e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = searchText;
    setSearchText(value);
    if (value) {
      const filtered = sanpham?.filter(
        (item: any) =>
          item?.ten_san_pham?.toLowerCase().includes(value.toLowerCase()) ||
          item?.danh_muc?.ten_danh_muc
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item?.mo_ta_ngan?.toLowerCase().includes(value.toLowerCase()) ||
          item?.ma_san_pham?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered || []);
    } else {
      if (sanpham) {
        setFilteredData(sanpham);
      }
    }
  };

  if (isError)
    return (
      <div>
        <div className="flex items-center justify-center mt-[250px]">
          <div className=" ">
            <Spin size="large" />
          </div>
        </div>
      </div>
    );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 ">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold">Sản phẩm</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Danh sách sản phẩm</h1>
        <div className="flex gap-2">
          <Link to="/admin/products/addd" className="mr-1">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              <i className="fa-sharp fa-solid fa-plus text-2xl"></i>
              Thêm sản phẩm
            </Button>
          </Link>
          <Link to="/admin/products/remote">
            <Button className="bg-gradient-to-r font-medium from-orange-500 to-orange-500 text-white rounded-lg py-1 hover:bg-red-600 shadow-md transition-colors flex items-center">
              {/* <DeleteOutlined className="mr-1" /> */}
              Dừng phân phối
            </Button>
          </Link>
        </div>
      </div>
      <div className="max-w-full my-2">
        <div className="flex  justify-between">
          <div className="flex">
            {/* <Dropdown disabled={selectedRowKeys.length === 0}> */}
            <Button
              type="primary"
              onClick={() =>
                bulkActionMutation.mutate({
                  action: "deactivate",
                  ids: selectedRowKeys,
                })
              }
              className={`
                  ${
                    selectedRowKeys.length > 0
                      ? "bg-gradient-to-l to-cyan-500 text-white  "
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                  transition-all duration-300 ease-in-out
                  font-bold py-2 px-4 rounded h-8 mr-2
                `}
            >
              Ngừng kinh doanh ({selectedRowKeys.length})
            </Button>
            {/* </Dropdown> */}
            <Input
              placeholder="Tìm kiếm..."
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow max-w-[300px]" // Điều chỉnh max-width tùy theo ý muốn
            />
          </div>
          <div>
            <Button
              type="primary"
              className=" text-white font-bold py-2 px-5 rounded h-8"
              onClick={() => mutateExcel()}
            >
              {isLoading ? "Đang tải..." : "Xuất Excel"}
            </Button>
          </div>
        </div>
      </div>

      <div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 5, className: "my-5" }}
          loading={isLoading}
        />
      </div>
    </main>
  );
};

export default ProductsAdmin;
