import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InputRef, TableColumnsType } from "antd";
import { Button, Input, message, Popconfirm, Space, Spin, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";

import { ICategories } from "@/common/types/category";
import instance from "@/configs/admin";

type DataIndex = keyof ICategories;
const CategoriesAdmin: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [categoriesMap, setCategoriesMap] = useState<Map<string, string>>(
    new Map()
  );
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["danhmuc"],
    queryFn: async () => {
      try {
        const response = await instance.get("/danhmuc");
        const categories = response.data;
        const categoryMap = new Map<string, string>();
        categories.data.forEach((category: any) => {
          categoryMap.set(category.id, category.ten_danh_muc);
        });
        setCategoriesMap(categoryMap);
        return categories; // Đảm bảo rằng categories.data chứa createdAt
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Error fetching categories");
      }
    },
  });

  // const dataSource =
  //   data?.data.map((category: ICategories) => ({
  //     key: category.id,
  //     ...category,
  //   })) || [];
  let currentIndex = 1;

  const generateDataSource = (
    categories: ICategories[],
    parentKey = "",
    isParent = true
  ): ICategories[] => {
    return categories.map((category: ICategories) => {
      const key = `${parentKey}-${category.id}`;
      const children = category.children
        ? generateDataSource(category.children, key, false)
        : [];

      // Assign the current index for the category
      const index = isParent ? currentIndex++ : undefined;

      return {
        key: key,
        index: index, // Assign the sequential index
        ...category,
        children,
      };
    });
  };

  const dataSource = data?.data ? generateDataSource(data.data) : [];

  const { mutate } = useMutation({
    mutationFn: async (id: string | number) => {
      try {
        const response = await instance.delete(`/danhmuc/${id}`);
        if (response.data.status) {
          return id;
        } else {
          throw new Error(response.data.message || "Failed to delete");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["danhmuc"] });

      message.open({
        type: "success",
        content: "Xóa danh mục thành công",
      });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);

      message.open({
        type: "error",
        content: "Xóa danh mục thất bại",
      });
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
  const { mutate: mutateExoprt } = useMutation({
    mutationFn: async () => {
      const res = await instance.get("xuatfile", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "danhmuc.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    onError: (error) => {
      console.error("Error exporting excel:", error);
      message.error("Xuất file excel thất bại");
    },
  });
  const columns: TableColumnsType<ICategories> = [
    {
      // dataIndex: 'index',
      // key: 'index',
      // render: (index: number) => index || "", // Display index if it has a value
    },
    {
      title: "Tên danh mục",
      width: "20%",
      key: "ten_danh_muc",
      dataIndex: "ten_danh_muc",
      ...getColumnSearchProps("ten_danh_muc"),
      sorter: (a: any, b: any) => a.ten_danh_muc.localeCompare(b.ten_danh_muc),
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Ảnh danh mục",
      width: "15%",
      key: "anh_danh_muc",
      dataIndex: "anh_danh_muc",
      render: (anh_danh_muc: string) =>
        anh_danh_muc ? (
          <img
            src={anh_danh_muc}
            alt="Ảnh danh mục"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          <span>Ảnh không có</span>
        ),
    },
    {
      title: "Danh mục cha",
      width: "20%",
      key: "cha_id",
      dataIndex: "cha_id",
      ...getColumnSearchProps("cha_id"),
      onFilter: (value: any | React.Key, record: ICategories) =>
        categoriesMap
          .get(record.cha_id!)
          ?.toLowerCase()
          .includes((value as string).toLowerCase()) || false,

      sorter: (a: any, b: any) => a.cha_id.localeCompare(b.cha_id),
      render: (text: string) => categoriesMap.get(text) || "________",
    },
    {
      title: "Thời gian tạo",
      width: "15%",
      key: "created_at",
      dataIndex: "created_at",
      sorter: (a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
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
            <Button className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300">
              Xóa
            </Button>
          </Popconfirm>
          <Link to={`/admin/categories/edit/${category.id}`}>
            <Button className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold">
              Cập nhật
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

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
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const handleExpand = (expanded: boolean, record: any) => {
    setExpandedKeys(expanded ? [record.key] : []);
  };
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold px-px">Danh mục</span>
        </h1>
      </div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="font-semibold md:text-3xl">Danh sách danh mục</h1>
          {/* <div className="mt-4">
          </div> */}
          <div className="mt-4">
            <Space>
              <Input placeholder="Tìm kiếm" prefix={<SearchOutlined />} />
            </Space>
          </div>
        </div>

        <div>
          <div className="flex mb-2 justify-end">
            {" "}
            <Link to="/admin/categories/add" className="mr-1">
              <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
                <i className="fa-sharp fa-solid fa-plus text-2xl"></i>
                Thêm
              </Button>
            </Link>
            <Link to="/admin/categories/remote">
              <Button className="bg-gradient-to-r  from-red-500 to-orange-500 text-white rounded-lg py-1 hover:bg-red-600 shadow-md transition-colors flex items-center">
                <DeleteOutlined className="mr-1" />
                Thùng rác
              </Button>
            </Link>{" "}
          </div>
          <div className="flex  justify-end">
            <Button
              type="primary"
              className=" text-white font-bold py-2 px-4 rounded h-8"
              onClick={() => mutateExoprt()}
            >
              Xuất dữ liệu Excel
            </Button>
          </div>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource.filter((category: any) => !category.cha_id)}
        loading={isLoading}
      />
    </main>
  );
};

export default CategoriesAdmin;
