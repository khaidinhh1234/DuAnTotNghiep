import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  InputRef,
  message,
  Table,
  TableColumnsType,
} from "antd";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Popconfirm, Space } from "antd";
import { NewCategories } from "@/common/types/newcategory";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { toast } from "react-toastify";

const NewCategory = () => {
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState<string>("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["danhmuctintuc"],
    queryFn: async () => {
      try {
        const response = await instance.get("/admin/danhmuctintuc");
        return response.data;
      } catch (error) {
        throw new Error("Error fetching new categories");
      }
    },
  });
  const dataSource =
    data?.data.map((newcategory: NewCategories) => ({
      key: newcategory.id,
      ...newcategory,
    })) || [];
  const { mutate } = useMutation({
    mutationFn: async (id: string | number) => {
      try {
        const res = await instance.delete(`/admin/danhmuctintuc/${id}`);
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
    }: FilterDropdownProps) => (
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
            <Button className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
              Xóa
            </Button>
          </Popconfirm>
          <Link to={`/admin/newcategory/edit/${newcategory.id}`}>
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
          <Link to="/admin/newcategory/add" className="mr-1">
            <Button className="ml-auto bg-black text-white rounded-lg py-1">
              <i className="fa-sharp fa-solid fa-plus text-2xl"></i>
              Thêm
            </Button>
          </Link>
          <Link to="/admin/newcategory/remote">
            <Button className="ml-auto bg-black text-white rounded-lg py-1">
              <DeleteOutlined className="mr-1" />
              Thùng rác
            </Button>
          </Link>
        </div>
      </div>
      <div className="max-w-5xl">
        <Table columns={columns} dataSource={dataSource} loading={isLoading} />
      </div>
    </main>
  );
};

export default NewCategory;
