import { ICategories } from "@/common/types/category";
import instance from "@/configs/axios";
import { SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InputRef, TableColumnsType } from "antd";
import { Button, Input, message, Space, Spin, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";

const TagsRemoteAdmin: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState<string>("");

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tag"],
    queryFn: async () => {
      try {
        const response = await instance.get("/admin/the");
        const tag = response.data;

        return tag; // Đảm bảo rằng categories.data chứa createdAt
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Error fetching categories");
      }
    },
  });

  const dataSource =
    data?.data.map((tag: ICategories, index: number) => ({
      key: tag.id,
      ...tag,
      index: index + 1,
    })) || [];

  const { mutate } = useMutation({
    mutationFn: async (id: string | number) => {
      try {
        const response = await instance.post(`/admin/the/thung-rac/${id}`);
        if (response.data.status) {
          message.open({
            type: "success",
            content: "Khôi phục thành công",
          });
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
      queryClient.invalidateQueries({ queryKey: ["tag"] });
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
      key: "index",
      dataIndex: "index",
    },
    {
      title: "Tên Nhãn Dán",
      width: "40%",
      key: "ten_the",
      dataIndex: "ten_the",
      //   ...getColumnSearchProps("ten_danh_muc"),
      sorter: (a: any, b: any) => a.ten_the.localeCompare(b.ten_the),
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },

    {
      title: "Quản trị",
      key: "action",
      render: (_, tag) => (
        <Space>
          <Button
            className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold"
            onClick={() => mutate(tag.id!)}
          >
            Khôi phục
          </Button>
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
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold px-px">Thùng rác</span>
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Thùng rác</h1>
        <div>
          <Link to="/admin/products/tags">
            <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      <div className="max-w-4xl">
        <Table columns={columns} dataSource={dataSource} loading={isLoading} />
      </div>
    </main>
  );
};

export default TagsRemoteAdmin;
