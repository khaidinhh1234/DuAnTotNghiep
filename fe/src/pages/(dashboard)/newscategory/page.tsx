import { NewCategories } from "@/common/types/newcategory";
import instance from "@/configs/admin";

import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Input,
  InputRef,
  message,
  Popconfirm,
  Space,
  Table,
  TableColumnsType,
} from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";

type DataIndex = keyof NewCategories;
const NewCategory = () => {
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState<string>("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["danhmuctintuc"],
    queryFn: async () => {
      try {
        const response = await instance.get("/danhmuctintuc");
        return response.data;
      } catch (error) {
        throw new Error("Error fetching new categories");
      }
    },
  });
  const dataSource =
    data?.data.map((newcategory: NewCategories, index: number) => ({
      key: newcategory.id,
      ...newcategory,
      index: index + 1,
    })) || [];
  const { mutate } = useMutation({
    mutationFn: async (id: string | number) => {
      try {
        const res = await instance.delete(`/danhmuctintuc/${id}`);
        message.open({
          type: "success",
          content: "Xóa danh mục thành công",
        });
        return res.data;
      } catch (error) {
        message.open({
          type: "error",
          content: "Xóa danh mục thất bại",
        });
        throw new Error("Error");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["danhmuctintuc"],
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

  // Define columns
  const columns: TableColumnsType<NewCategories> = [
    {
      title: "STT",
      width: "20%",
      key: "id",
      dataIndex: "key",
    },
    // {
    //   title: "STT",
    //   width: "10%",
    //   key: "id",
    //   dataIndex: "ten_danh_muc_tin_tucey",
    //     // ...getColumnSearchProps("ten_danh_muc_tin_tuc"),
    // },
    {
      title: "Tên danh mục tin tức",
      width: "25%",
      key: "ten_danh_muc_tin_tuc",
      dataIndex: "ten_danh_muc_tin_tuc",
      ...getColumnSearchProps("ten_danh_muc_tin_tuc"),
      sorter: (a: any, b: any) =>
        a.ten_danh_muc_tin_tuc.localeCompare(b.ten_danh_muc_tin_tuc),
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Thời gian tạo",
      width: "20%",
      key: "created_at",
      dataIndex: "created_at",
      render: (text) => (text ? new Date(text).toLocaleDateString() : ""),
    },
    {
      title: "Quản trị",
      key: "action",
      render: (_, newcategory) => (
        <Space>
          <Popconfirm
            title="Chuyển vào thùng rác"
            description="Bạn có chắc chắn muốn xóa không?"
            onConfirm={() => mutate(newcategory.id!)}
            okText="Có"
            cancelText="Không"
          >
            <Button className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300">
              Xóa
            </Button>
          </Popconfirm>
          <Link to={`/admin/newcategory/edit/${newcategory.id}`}>
            <Button className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold">
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
          Quản trị /{" "}
          <span className="font-semibold px-px">Danh mục tin tức</span>
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">
          Danh sách danh mục tin tức
        </h1>
        <div className="flex">
          <Link to="/admin/newcategory/add" className="mr-1">
            <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              <i className="fa-sharp fa-solid fa-plus text-2xl"></i>
              Thêm
            </Button>
          </Link>
          <Link to="/admin/newcategory/remote">
            <Button className="bg-gradient-to-r  from-red-500 to-orange-500 text-white rounded-lg py-1 hover:bg-red-600 shadow-md transition-colors flex items-center">
              <DeleteOutlined className="mr-1" />
              Thùng rác
            </Button>
          </Link>
        </div>
      </div>
      <div className="max-w-5xl">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={isLoading}
          pagination={{ pageSize: 10, className: "my-5" }}
        />
      </div>
    </main>
  );
};

export default NewCategory;
