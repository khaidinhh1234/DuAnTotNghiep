import React, { useRef, useState } from "react";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Space, Table, Tabs } from "antd";
import type { InputRef, TableColumnsType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { ICategories } from "@/common/types/category";
import { toast } from "react-toastify";
import { INew } from "@/common/types/new";
const { TabPane } = Tabs;


const PageNew: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState<string>("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tintuc'],
    queryFn: async () => {
      try {
        const response = await instance.get('/admin/tintuc');
        const categories = response.data;
        return categories; // Đảm bảo rằng categories.data chứa createdAt
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Error fetching categories");
      }
    },
  });


  const dataSource = data?.data.map((category: ICategories) => ({
    key: category.id,
    ...category,
  })) || [];

  const { mutate } = useMutation({
    mutationFn: async (id: string | number) => {
      try {
        const response = await instance.delete(`/admin/danhmuc/${id}`);
        if (response.data.status) {
          return id;
        } else {
          throw new Error(response.data.message || 'Failed to delete');
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
      }
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries(['danhmuc']);
      toast.success("Xóa danh mục thành công");
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast.error("Xóa danh mục thất bại");
    },
  });

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0] as string}
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
    onFilter: (value: string | number | boolean, record: any) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: string) =>
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
      dataIndex: "key",
    },
    {
        title: "Tác giả",
        width: "10%",
        key: "user_id",
        dataIndex: "user_id",
        render: (text) => (text? text : "Chưa có dữ liệu")
    },
    {
        title: "Danh mục tin tức",
        width: "10%",
        key: "danh_muc_tin_tuc_id",
        dataIndex: "danh_muc_tin_tuc_id",
        render: (text) => (text? text : "Chưa có dữ liệu")
    },
    {
      title: "Tiêu đề",
      width: "15%",
      key: "tieu_de",
      dataIndex: "tieu_de",
    //   ...getColumnSearchProps("ten_danh_muc"),
      sorter: (a: any, b: any) => a.tieu_de.localeCompare(b.tieu_de),
      render: (text) => (text ? text : "Chưa có dữ liệu")
    },
    {
        title: "Nội dung",
        width: "30%",
        key: "noi_dung",
        dataIndex: "noi_dung",
        render: (text) => (text? text : "Chưa có dữ liệu")
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
      key: "action",
      render: (_, category) => (
        <Space>
          <Popconfirm
            title="Chuyển vào thùng rác"
            description="Bạn có chắc chắn muốn xóa không?"
            onConfirm={() => mutate(category.id!)}
            okText="Có"
            cancelText="Không"
          >
            <Button className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
              Xóa
            </Button>
          </Popconfirm>
          <Link to={`/admin/categories/edit/${category.id}`}>
            <Button className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
              Cập nhật
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold px-px">Danh mục</span>
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Danh mục</h1>
        <div>
          <Link to="/admin/categories/add" className="mr-1">
            <Button className="ml-auto bg-black text-white rounded-lg py-1">
              <i className="fa-sharp fa-solid fa-plus text-2xl"></i>
              Thêm
            </Button>
          </Link>
          <Link to="/admin/categories/remote">
            <Button className="ml-auto bg-black text-white rounded-lg py-1">
              <DeleteOutlined className="mr-1" />
              Thùng rác
            </Button>
          </Link>
        </div>
      </div>
          <Table columns={columns} dataSource={dataSource} />
    </main>
  );
};

export default PageNew;
