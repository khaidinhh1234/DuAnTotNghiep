import React, { useRef, useState } from "react";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import type { InputRef, TableColumnsType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { ICategories } from "@/common/types/category";
import { toast } from "react-toastify";

const CategoriesAdmin: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [categoriesMap, setCategoriesMap] = useState<Map<string, string>>(
    new Map()
  );
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['danhmuc'],
    queryFn: async () => {
      try {
        const response = await instance.get('/danhmuc');
        const categories = response.data;

        // Create a map of category ID to category name for easy lookup
        const categoryMap = new Map<string, string>();
        categories.data.forEach((category: ICategories) => {
          categoryMap.set(category.id, category.ten_danh_muc);
        });
        setCategoriesMap(categoryMap);

        return categories;
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
      console.log(`Attempting to delete category with id: ${id}`);
      try {
        await instance.delete(`/danhmuc/${id}`);
      } catch (error) {
        console.error("Error deleting category:", error);
        throw new Error("Error deleting category");
      }
    },
    onSuccess: () => {
      console.log("Successfully deleted category");
      queryClient.invalidateQueries({
        queryKey: ['danhmuc'],
      });
      toast.success("Xóa danh mục thành công");
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast.error("Xóa danh mục thất bại");
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {isError.message}</p>;

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

  const columns: TableColumnsType<ICategories> = [
    {
      title: "STT",
      width: "10%",
      key: "id",
      dataIndex: "key",
    },
    {
      title: "Tên danh mục",
      width: "25%",
      key: "ten_danh_muc",
      dataIndex: "ten_danh_muc",
      ...getColumnSearchProps("ten_danh_muc"),
      sorter: (a, b) => a.ten_danh_muc.localeCompare(b.ten_danh_muc),
    },
    {
      title: "Đường dẫn",
      width: "25%",
      key: "duong_dan",
      dataIndex: "duong_dan",
    },
    {
      title: "Danh mục cha",
      width: "25%",
      key: "cha_id",
      dataIndex: "cha_id",
      render: (text: string) => categoriesMap.get(text) || "không có",
    },
    {
      title: "Thời gian tạo",
      width: "15%",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (text) => (text ? new Date(text).toLocaleDateString() : "N/A"),
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
      <div className="flex">
        <div className="w-1/2 pr-2">
          <h2 className="text-xl font-semibold mb-4">Danh mục cha</h2>
          <Table columns={columns} dataSource={dataSource.filter(category => !category.cha_id)} />
        </div>
        <div className="w-1/2 pl-2">
          <h2 className="text-xl font-semibold mb-4">Danh mục con</h2>
          <Table columns={columns} dataSource={dataSource.filter(category => category.cha_id)} />
        </div>
      </div>
    </main>
  );
};

export default CategoriesAdmin;
