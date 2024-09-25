import React, { useRef, useState } from "react";
import {  SearchOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Space, Table, Form, InputRef, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import Highlighter from "react-highlight-words";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Link } from "react-router-dom";

interface DataType {
    id: string,
  key: string;
  ten_mau_sac: string;
  ma_mau_sac: string;
}

type DataIndex = keyof DataType;

const ColorManagement: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const [form] = Form.useForm();

  const [tenMau, setTenMau] = useState<string>("");
  const [maMau, setMaMau] = useState<string>("");

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["mausac"],
    queryFn: async () => {
      const res = await instance.get("/admin/bienthemausac");
      return res.data;
    },
  });

  const mausac = data?.data.map((item: any, index: number) => ({
    ...item,
    key: item.id,
    index,
  }));

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const response = await instance.delete(`/admin/bienthemausac/${id}`);
      if (response.data.status) {
        return id;
      } else {
        throw new Error(response.data.message || 'Failed to delete');
      }
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries(['mausac']);
      message.success("Xóa sản phẩm thành công");
    },
    onError: (error) => {
      console.error("Error deleting màu sắc:", error);
      message.error("Xóa sản phẩm thất bại");
    },
  });
  const addColorMutation = useMutation({
    mutationFn: async (newColor: { ten_mau_sac: string; ma_mau_sac: string }) => {
      const response = await instance.post("/admin/bienthemausac", newColor);
      if (response.data.status) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to add color');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mausac']);
      message.success("Thêm màu sắc thành công");
      setTenMau("");
      setMaMau("");
    },
    onError: (error) => {
      console.error("Error adding color:", error);
      message.error("Thêm màu sắc thất bại");
    },
  });

  const handleAddColor = (): void => {
    if (!tenMau || !maMau) {
      message.error("Vui lòng nhập đầy đủ thông tin màu sắc");
      return;
    }

    addColorMutation.mutate({ ten_mau_sac: tenMau, ma_mau_sac: maMau });
  };
  const handleSearch = (
    selectedKeys: string[],
    confirm: any,
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

  const columns: ColumnsType<DataType> = [
    {
      title: "STT",
      key: "stt",
      render: (text, item, index) => index + 1,
      width: "10%",
    },
    {
      title: "Tên màu",
      dataIndex: "ten_mau_sac",
      key: "ten_mau_sac",
      width: "30%",
      ...getColumnSearchProps("ten_mau_sac"),
      sorter: (a: DataType, b: DataType) => a.ten_mau_sac.localeCompare(b.ten_mau_sac),
    },
    {
        title: "Mã màu",
        dataIndex: "ma_mau_sac",
        key: "ma_mau_sac",
        width: "30%",
        ...getColumnSearchProps("ma_mau_sac"),
        sorter: (a: DataType, b: DataType) => a.ma_mau_sac.localeCompare(b.ma_mau_sac),
        render: (text: string) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: text,
                marginRight: '8px',
                border: '1px solid #d9d9d9',
                borderRadius: '2px'
              }}
            />
            {text}
          </div>
        ),
      },
    {
        title: "Quản trị",
        key: "action",
        render: (_, item) => (
          <Space>
            <Popconfirm
              title="Xóa sản phẩm"
              description="Bạn có chắc chắn muốn xóa không?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => deleteMutation.mutate(item.id)}
            >
              <Button className="bg-white text-red-500 border border-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 shadow-md transition-colors">
                Xóa
              </Button>
            </Popconfirm>
            <Link to={`/admin/products/bienthecolor/edit/${item.id}`}>
              <Button className="bg-white text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50 hover:text-orange-600 shadow-md transition-colors">
                Cập nhật
              </Button>
            </Link>
          </Space>
        ),
      },
  ];


  isError && <div>Đã xảy ra lỗi</div>;
  isLoading && <div>Đang tải dữ liệu...</div>;
    function onFinish(values: any): void {
        throw new Error("Function not implemented.");
    }

return (
  <>
    <Table 
      columns={columns} 
      dataSource={mausac} 
      pagination={{ pageSize: 5 }} 
      className="equal-width-table" 
      
    />
    <Form 
      form={form} 
      onFinish={onFinish} 
      className="mt-4"
      layout="inline"
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Form.Item
        name="tenMau"
        style={{ flex: 1, marginRight: '8px' }}
        rules={[
          { required: true, message: 'Vui lòng nhập tên màu' },
          { max: 50, message: 'Tên màu không được quá 50 ký tự' },
        ]}
      >
        <Input placeholder="Tên màu" />
      </Form.Item>

      <Form.Item
        name="maMau"
        style={{ flex: 1, marginRight: '8px' }}
        rules={[
          { required: true, message: 'Vui lòng nhập mã màu' },
          { 
            pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
            message: 'Mã màu không hợp lệ. (ví dụ: #FF0000)'
          },
        ]}
      >
        <Input placeholder="Mã màu" />
      </Form.Item>

      <Form.Item>
        <Button 
          type="primary" 
          htmlType="submit"
          className="px-3 py-2 bg-black text-white rounded-lg" 
          loading={addColorMutation.isLoading}
        >
          Thêm màu
        </Button>
      </Form.Item>
    </Form>
  </>
);

};

export default ColorManagement;
