import React, { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Space, Spin, Table } from "antd";
import type { InputRef, TableColumnsType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";

interface IMemberRank {
  id: string | number;
  ten_hang_thanh_vien: string;
  anh_hang_thanh_vien: string;
  chi_tieu_toi_thieu: number;
  chi_tieu_toi_da: number;
}

const Remoterank: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState<string>("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["rank"],
    queryFn: async () => {
      try {
        const response = await instance.get("/admin/hangthanhvien/thung-rac");
        return response.data;
      } catch (error) {
        console.error("Error fetching :", error);
        throw new Error("Error fetching ");
      }
    },
  });

  const dataSource =
    data?.data.map((record: IMemberRank, index: number) => ({
      key: record.id,
      ...record,
      index: index + 1,
    })) || [];

  // const { mutate } = useMutation({
  //   mutationFn: async (id: string | number) => {
  //     const response = await instance.post(`/admin/hangthanhvien/thung-rac/${id}`);
  //     return response.data;
  //   },
  //   onSuccess: (data) => {
  //     if (data.status) {
  //       message.success("Khôi phục thành công");
  //       queryClient.invalidateQueries({ queryKey: ["rank"] });
  //     } else {
  //       message.error(data.message || "Failed to restore rank");
  //     }
  //   },
  //   onError: (error) => {
  //     console.error("Error restoring category:", error);
  //     message.error("Xóa danh mục thất bại");
  //   },
  // });
  const handleRestore = async (id: string | number) => {
    try {
      await instance.post(`/admin/hangthanhvien/thung-rac/${id}`);
      message.success("Khôi phục danh mục thành công", 3);
      queryClient.invalidateQueries({ queryKey: ["rank"] });
    } catch (error) {
      console.error("Error restoring category:", error);
      message.error("Khôi phục danh mục thất bại", 3);
    }
  };

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
    onFilter: (value: string | number | boolean, record: IMemberRank) =>
      record[dataIndex as keyof IMemberRank]
        ?.toString()
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

  const columns: TableColumnsType<IMemberRank> = [
    {
      title: "STT",
      width: "10%",
      key: "index",
      dataIndex: "index",
    },
    {
      title: "Hạng thành viên",
      key: "hang_thanh_vien",
      width: "20%",
      sorter: (a: IMemberRank, b: IMemberRank) =>
        (a.ten_hang_thanh_vien || "").localeCompare(
          b.ten_hang_thanh_vien || ""
        ),
      render: (record: IMemberRank) => (
        <div className="flex items-center">
          <img
            src={record.anh_hang_thanh_vien || "https://via.placeholder.com/24"}
            alt="member rank"
            className="w-6 h-6 object-cover rounded-full mr-2"
          />
          <span className="text-sm font-medium capitalize">
            {record.ten_hang_thanh_vien || "Chưa có hạng"}
          </span>
        </div>
      ),
      className: "pl-4",
    },

    {
      title: "Chi tiêu",
      dataIndex: "",
      key: "chi_tieu",
      width: "30%",

      sorter: (a: IMemberRank, b: IMemberRank) =>
        a.chi_tieu_toi_thieu - b.chi_tieu_toi_thieu ||
        a.chi_tieu_toi_da - b.chi_tieu_toi_da,
      render: (_text: string, record: IMemberRank) => {
        const formatCurrency = (value: number) =>
          new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(value);

        return `${formatCurrency(record.chi_tieu_toi_thieu)} - ${formatCurrency(record.chi_tieu_toi_da)}`;
      },
    },
    {
      title: "Quản trị",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold"
            onClick={() => handleRestore(record.id)}
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
          <Link to="/admin/users/rank">
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

export default Remoterank;
