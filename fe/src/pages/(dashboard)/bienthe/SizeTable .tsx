
import instance from "@/configs/admin";
import { SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  InputRef,
  message,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";

interface SizeDataType {
  key: string;
  id: number;
  kich_thuoc: string;
  loai_kich_thuoc: string;
  chieu_cao_toi_thieu: number;
  chieu_cao_toi_da: number;
  can_nang_toi_thieu: number;
  can_nang_toi_da: number;
}

interface FilterDropdownProps {
  setSelectedKeys: (keys: string[]) => void;
  selectedKeys: string[];
  confirm: () => void;
  clearFilters: () => void;
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
      const res = await instance.get("/bienthekichthuoc");
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
      const response = await instance.delete(`/bienthekichthuoc/${id}`);
      if (response.data.status) {
        return id;
      } else {
        throw new Error(response.data.message || "Failed to delete");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["size"] });
      message.success("Xóa kích thước thành công");
    },
    onError: (error: any) => {
      console.error("Error deleting kích thước:", error);
      if (error.response && error.response.data) {
        message.error(error.response.data.message);
      } else {
        message.error("Xóa kích thước thất bại");
      }
    },
  });

  const addSizeMutation = useMutation({
    mutationFn: async (newSize: {
      kich_thuoc: string;
      loai_kich_thuoc: string;
      chieu_cao_toi_thieu: number;
      chieu_cao_toi_da: number;
      can_nang_toi_thieu: number;
      can_nang_toi_da: number;
    }) => {
      const existingSize = sizes.find(
        (size: any) =>
          size.kich_thuoc.toLowerCase() === newSize.kich_thuoc.toLowerCase() &&
          size.loai_kich_thuoc === newSize.loai_kich_thuoc
      );
      if (existingSize) {
        throw new Error("Kích thước đã tồn tại");
      }

      const response = await instance.post("/bienthekichthuoc", newSize);
      if (response.data.status) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to add size");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["size"] });
      message.success("Thêm kích thước thành công");
      form.resetFields();
    },
    onError: (error: any) => {
      console.error("Error adding size:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        errorMessages.map((msg) => message.error(msg as string));
      } else {
        message.error(error.message || "Thêm kích thước thất bại");
      }
    },
  });

  const handleAddSize = (): void => {
    form.validateFields().then((values: any) => {
      addSizeMutation.mutate({
        kich_thuoc: values.tensize,
        loai_kich_thuoc: values.loai_kich_thuoc,
        chieu_cao_toi_thieu: Number(values.chieu_cao_toi_thieu),
        chieu_cao_toi_da: Number(values.chieu_cao_toi_da),
        can_nang_toi_thieu: Number(values.can_nang_toi_thieu),
        can_nang_toi_da: Number(values.can_nang_toi_da),
      });
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

  const columns: ColumnsType<SizeDataType> = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => index + 1,
      width: "5%",
    },
    {
      title: "Tên",
      dataIndex: "kich_thuoc",
      key: "kich_thuoc",
      width: "15%",
      sorter: (a: SizeDataType, b: SizeDataType) =>
        a.kich_thuoc.localeCompare(b.kich_thuoc),
      ...getColumnSearchProps("kich_thuoc"),
    },
    {
      title: "Loại",
      dataIndex: "loai_kich_thuoc",
      key: "loai_kich_thuoc",
      width: "15%",
      sorter: (a: SizeDataType, b: SizeDataType) =>
        a.loai_kich_thuoc.localeCompare(b.loai_kich_thuoc),
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
      title: "Chiều cao (cm)",
      key: "chieu_cao",
      width: "20%",
      render: (_, record) =>
        `${record.chieu_cao_toi_thieu} - ${record.chieu_cao_toi_da}`,
    },
    {
      title: "Cân nặng (kg)",
      key: "can_nang",
      width: "20%",
      render: (_, record) =>
        `${record.can_nang_toi_thieu} - ${record.can_nang_toi_da}`,
    },
    {
      title: "Quản trị",
      key: "action",
      width: "25%",
      render: (_, item) => (
        <Space>
          <Popconfirm
            title="chuyển vào thùng rác?"
            description="Bạn có chắc chắn muốn xóa không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => deleteMutation.mutate(item.id)}
          >
            <Button className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300">
              Xóa
            </Button>
          </Popconfirm>
          <Link to={`/admin/products/bienthesize/edit/${item.id}`}>
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
        <div className="flex items-center justify-center mt-[250px]">
          <div className=" ">
            <Spin size="large" />
          </div>
        </div>
      </div>
    );

  return (
    <>
     <Form form={form} className="mt-4 space-y-2">
  <div className="grid grid-cols-3 gap-4">
    <Form.Item
      className="mb-0"
      name="tensize"
      rules={[
        { required: true, message: "Vui lòng nhập tên kích thước" },
        { max: 50, message: "Tên kích thước không được quá 50 ký tự" },
        {
          pattern: /^[^\s]+(\s+[^\s]+)*$/,
          message: "Vui lòng nhập họ không chứa ký tự trắng!",
        },
      ]}
    >
      <Input placeholder="Tên kích thước" />
    </Form.Item>

    <Form.Item
      className="mb-0"
      name="loai_kich_thuoc"
      rules={[{ required: true, message: "Vui lòng chọn loại kích thước" }]}
    >
      <Select placeholder="Chọn loại kích thước">
        <Select.Option value="nam">Nam</Select.Option>
        <Select.Option value="nu">Nữ</Select.Option>
        <Select.Option value="tre_em">Trẻ em</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item
      className="mb-0"
      name="chieu_cao_toi_thieu"
      rules={[
        { required: true, message: "Vui lòng nhập chiều cao tối thiểu" },
        {
          validator: (_, value) => {
            if (!value) return Promise.resolve();
            const num = Number(value);
            if (isNaN(num)) {
              return Promise.reject('Vui lòng nhập số');
            }
            if (num <= 0) {
              return Promise.reject('Vui lòng nhập số lớn hơn 0');
            }
            return Promise.resolve();
          }
        }
      ]}
    >
      <Input type="number" placeholder="Chiều cao tối thiểu (cm)" />
    </Form.Item>

    <Form.Item
      className="mb-0"
      name="chieu_cao_toi_da"
      rules={[
        { required: true, message: "Vui lòng nhập chiều cao tối đa" },
        {
          validator: (_, value) => {
            if (!value) return Promise.resolve();
            const num = Number(value);
            if (isNaN(num)) {
              return Promise.reject('Vui lòng nhập số');
            }
            if (num <= 0) {
              return Promise.reject('Vui lòng nhập số lớn hơn 0');
            }
            const minHeight = form.getFieldValue('chieu_cao_toi_thieu');
            if (value && minHeight && num <= Number(minHeight)) {
              return Promise.reject('Chiều cao tối đa phải lớn hơn chiều cao tối thiểu');
            }
            return Promise.resolve();
          }
        }
      ]}
    >
      <Input type="number" placeholder="Chiều cao tối đa (cm)" />
    </Form.Item>

    <Form.Item
      className="mb-0"
      name="can_nang_toi_thieu"
      rules={[
        { required: true, message: "Vui lòng nhập cân nặng tối thiểu" },
        {
          validator: (_, value) => {
            if (!value) return Promise.resolve();
            const num = Number(value);
            if (isNaN(num)) {
              return Promise.reject('Vui lòng nhập số');
            }
            if (num <= 0) {
              return Promise.reject('Vui lòng nhập số lớn hơn 0');
            }
            return Promise.resolve();
          }
        }
      ]}
    >
      <Input type="number" placeholder="Cân nặng tối thiểu (kg)" />
    </Form.Item>

    <Form.Item
      className="mb-0"
      name="can_nang_toi_da"
      rules={[
        { required: true, message: "Vui lòng nhập cân nặng tối đa" },
        {
          validator: (_, value) => {
            if (!value) return Promise.resolve();
            const num = Number(value);
            if (isNaN(num)) {
              return Promise.reject('Vui lòng nhập số');
            }
            if (num <= 0) {
              return Promise.reject('Vui lòng nhập số lớn hơn 0');
            }
            const minWeight = form.getFieldValue('can_nang_toi_thieu');
            if (value && minWeight && num <= Number(minWeight)) {
              return Promise.reject('Cân nặng tối đa phải lớn hơn cân nặng tối thiểu');
            }
            return Promise.resolve();
          }
        }
      ]}
    >
      <Input type="number" placeholder="Cân nặng tối đa (kg)" />
    </Form.Item>
  </div>
  <div className="flex justify-end mt-4">
  <Button
    type="primary"
    className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
    onClick={handleAddSize}
  >
    Thêm size
  </Button>
</div>

</Form>


      <br />
      <Table
        columns={columns}
        dataSource={sizes}
        pagination={{ pageSize: 5, className: "my-5" }}
        className="equal-width-table"
        loading={isLoading}
      />
    </>
  );
};

export default SizeManagement;

