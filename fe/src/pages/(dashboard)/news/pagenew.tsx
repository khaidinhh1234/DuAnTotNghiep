import { INew } from "@/common/types/new";
import instance from "@/configs/admin";

import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InputRef, TableColumnsType } from "antd";
import { Button, Input, message, Popconfirm, Space, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link, useNavigate } from "react-router-dom";
type DataIndex = keyof INew;
const PageNew: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState<string>("");
  const queryClient = useQueryClient();
  const navigate = useNavigate(); // Hook để chuyển hướng đến trang chi tiết

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tintuc"],
    queryFn: async () => {
      try {
        const response = await instance.get("/tintuc");
        const news = response.data;
        return news;
      } catch (error) {
        console.error("Error fetching news:", error);
        throw new Error("Error fetching categories");
      }
    },
  });

  const dataSource =
    data?.data.map((newsItem: any, index: number) => ({
      key: newsItem.id,
      ...newsItem,
      index: index + 1,
      user_id: newsItem.user?.ten || "Chưa có dữ liệu",
      danh_muc_tin_tuc_id:
        newsItem?.danh_muc_tin_tuc?.ten_danh_muc_tin_tuc || "Chưa có dữ liệu",
    })) || [];
  // console.log(dataSource);

  const { mutate } = useMutation({
    mutationFn: async (id: string | number) => {
      try {
        const response = await instance.delete(`/tintuc/${id}`);
        if (response.data.status) {
          return id;
        } else {
          throw new Error(response.data.message || "Failed to delete");
        }
      } catch (error: any) {
        message.error(error.response.data.message);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tintuc"] });
      message.success("Xóa tin tức thành công");
    },
  });

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

  const columns: TableColumnsType<INew> = [
    {
      title: "STT",
      width: "10%",
      key: "id",
      dataIndex: "index",
    },
    {
      title: "Tác giả",
      width: "10%",
      key: "user_id",
      dataIndex: "user_id",
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Danh mục tin tức",
      width: "10%",
      key: "danh_muc_tin_tuc_id",
      dataIndex: "danh_muc_tin_tuc_id",
      ...getColumnSearchProps("danh_muc_tin_tuc_id"),
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Tiêu đề",
      width: "15%",
      key: "tieu_de",
      dataIndex: "tieu_de",
      ...getColumnSearchProps("tieu_de"),
      sorter: (a: any, b: any) => a.tieu_de.localeCompare(b.tieu_de),
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Thời gian tạo",
      width: "10%",
      key: "created_at",
      dataIndex: "created_at",
      render: (text) => (text ? new Date(text).toLocaleDateString() : ""),
    },
    {
      title: "Quản trị",
      width: "40%",
      key: "action",
      render: (_, news) => (
        <Space>
          {/* Nút "Xem chi tiết" */}
          <Button
            className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
            onClick={() => navigate(`/admin/news/details/${news.id}`)}
          >
            Xem chi tiết
          </Button>

          <Popconfirm
            title="Chuyển vào thùng rác"
            description="Bạn có chắc chắn muốn xóa không?"
            onConfirm={() => mutate(news.id!)}
            okText="Có"
            cancelText="Không"
          >
            <Button className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300">
              Xóa
            </Button>
          </Popconfirm>

          <Link to={`/admin/news/edit/${news.id}`}>
            <Button className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold">
              Cập nhật
            </Button>
          </Link>
        </Space>
      ),
    },
  ];
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold px-px">Tin tức</span>
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Danh sách tin tức</h1>
        <div className="flex">
          <Link to="/admin/news/add" className="mr-1">
            <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              <i className="fa-sharp fa-solid fa-plus text-2xl"></i>
              Thêm
            </Button>
          </Link>
          <Link to="/admin/news/remote">
            <Button className="bg-gradient-to-r  from-red-500 to-orange-500 text-white rounded-lg py-1 hover:bg-red-600 shadow-md transition-colors flex items-center">
              <DeleteOutlined className="mr-1" />
              Thùng rác
            </Button>
          </Link>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={isLoading}
        pagination={{ pageSize: 10, className: "my-5" }}
      />
    </main>
  );
};

export default PageNew;
