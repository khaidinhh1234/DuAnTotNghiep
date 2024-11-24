import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Input, InputRef, message, Space, Spin, Table } from "antd";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import instance from "@/configs/admin";

interface SizeDataType {
  key: string;
  id: number;
  kich_thuoc: string;
  loai_kich_thuoc: string;
}

interface FilterDropdownProps {
  setSelectedKeys: (keys: string[]) => void;
  selectedKeys: string[];
  confirm: () => void;
  clearFilters: () => void;
}

type SizeDataIndex = keyof SizeDataType;

const Remotesize: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["size"],
    queryFn: async () => {
      const response = await instance.get("/bienthekichthuoc/thung-rac");
      return response.data;
    },
  });

  const handleRestore = async (id: number) => {
    try {
      await instance.post(`/bienthekichthuoc/thung-rac/${id}`);
      message.success("Khôi kích thước sản phẩm mục thành công");
      queryClient.invalidateQueries({ queryKey: ["size"] });
    } catch (error) {
      console.error("Error restoring category:", error);
      message.error("Khôi phục kích thước sản phẩm thất bại");
    }
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: SizeDataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: SizeDataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
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
    onFilter: (value: string, record: SizeDataType) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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

  const columns = [
    {
      title: "STT",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Tên Size",
      dataIndex: "kich_thuoc",
      key: "kich_thuoc",
      width: "50%",
      sorter: (a: SizeDataType, b: SizeDataType) => a.kich_thuoc.localeCompare(b.kich_thuoc),
      ...getColumnSearchProps("kich_thuoc"),
    },
    {
      title: "Loại kích thước",
      dataIndex: "loai_kich_thuoc",
      key: "loai_kich_thuoc",
      width: "50%",
      sorter: (a: SizeDataType, b: SizeDataType) => a.loai_kich_thuoc.localeCompare(b.loai_kich_thuoc),
      ...getColumnSearchProps("loai_kich_thuoc"),
      render: (text: string) => {
        switch (text) {
          case "nam":
            return "Nam";
          case "nu":
            return "Nữ";
          case "tre_em":
            return "Trẻ em";
          default:
            return text;
        }
      },
    },
    {
      title: "Quản trị",
      key: "action",
      render: (_: unknown, record: SizeDataType) => (
        <Space>
          <Button
            className="bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold"
            onClick={() => handleRestore(record.id)}
          >
            Khôi phục
          </Button>
        </Space>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="flex items-center justify-center mt-[250px]">
        <div>
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Sản phẩm / Biến thể /
          <span className="font-semibold px-px">Thùng rác</span>
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Biến thể kích thước</h1>
        <Link to="/admin/products/bienthe">
          <Button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
            Quay lại
          </Button>
        </Link>
      </div>
      <div className="max-w-5xl">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          pagination={{ pageSize: 10, className: "my-5" }}
          loading={isLoading}
        />
      </div>
    </main>
  );
};

export default Remotesize;
