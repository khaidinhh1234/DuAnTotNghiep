
import React, { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table, Form, InputRef, Popconfirm, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import Highlighter from "react-highlight-words";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Link } from "react-router-dom";

interface SizeDataType {
  key: string;
  id: number;
  kich_thuoc: string;
}

type SizeDataIndex = keyof SizeDataType;

const SizeManagement: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["size"],
    queryFn: async () => {
      const res = await instance.get("/admin/bienthekichthuoc");
      return res.data;
    },
  });

  const sizes = data?.data.map((item: any, index: number) => ({
    ...item,
    key: item.id,
    index,
  }));

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const response = await instance.delete(`/admin/bienthekichthuoc/${id}`);
      if (response.data.status) {
        return id;
      } else {
        throw new Error(response.data.message || 'Failed to delete');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['size']);
      message.success("Xóa kích thước thành công");
    },
    onError: (error) => {
      console.error("Error deleting kích thước:", error);
      message.error("Xóa kích thước thất bại");
    },
  });

  const addSizeMutation = useMutation({
    mutationFn: async (newSize: { kich_thuoc: string }) => {
      // Check if the size already exists
      const existingSize = sizes.find(
        (size) => size.kich_thuoc.toLowerCase() === newSize.kich_thuoc.toLowerCase()
      );
      if (existingSize) {
        throw new Error('Kích thước đã tồn tại');
      }

      const response = await instance.post("/admin/bienthekichthuoc", newSize);
      if (response.data.status) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to add size');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['size']);
      message.success("Thêm kích thước thành công");
      form.resetFields();
    },
    onError: (error: Error) => {
      console.error("Error adding size:", error);
      message.error(error.message || "Thêm kích thước thất bại");
    },
  });

  const handleAddSize = (): void => {
    form.validateFields().then((values) => {
      addSizeMutation.mutate({ kich_thuoc: values.tensize });
    });
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
    onFilter: (value: string, record: SizeDataType) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
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

  const columns: ColumnsType<SizeDataType> = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => index + 1,
      width: "10%",
    },
    {
      title: "Tên Size",
      dataIndex: "kich_thuoc",
      key: "kich_thuoc",
      width: "50%",
      ...getColumnSearchProps("kich_thuoc"),
    },
    {
      title: "Quản trị",
      key: "action",
      render: (_, item) => (
        <Space>
          <Popconfirm
            title="Xóa kích thước"
            description="Bạn có chắc chắn muốn xóa không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => deleteMutation.mutate(item.id)}
          >
            {/* <Button className="bg-white text-red-500 border border-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 shadow-md transition-colors"> */}
            <Button type="primary"           className="px-3 py-2 bg-black text-white rounded-lg" >

              Xóa
            </Button>
          </Popconfirm>
          <Link to={`/admin/products/bienthesize/edit/${item.id}`}>
            {/* <Button className="bg-white text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50 hover:text-orange-600 shadow-md transition-colors"> */}
            <Button type="primary"           className="px-3 py-2 bg-black text-white rounded-lg" >

              Cập nhật
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  if (isError) return <div>Đã xảy ra lỗi</div>;
  if (isLoading) return <div>Đang tải dữ liệu...</div>;

  return (
    <>      <Form form={form} className="mt-4 flex space-x-2">
    <Form.Item
      className="flex-grow mb-0"
      name="tensize"
      rules={[
        { required: true, message: 'Vui lòng nhập tên kích thước' },
        { max: 50, message: 'Tên kích thước không được quá 50 ký tự' },
        {
          pattern: /^[^\s]+(\s+[^\s]+)*$/,
          message: "Vui lòng nhập họ không chứa ký tự trắng!",
        },
      ]}
    >
      <Input placeholder="Tên kích thước" />
    </Form.Item>
    <Button type="primary"           className="px-3 py-2 bg-black text-white rounded-lg" 
onClick={handleAddSize}>Thêm size</Button>
  </Form> <br />
      <Table columns={columns} dataSource={sizes} pagination={{ pageSize: 5 }} className="equal-width-table" />

    </>
  );
};

export default SizeManagement;
