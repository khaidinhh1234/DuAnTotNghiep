import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Tabs,
  Button,
  Divider,
} from "antd";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import type { SelectProps } from "antd";

const { Option } = Select;
const options: SelectProps["options"] = [] as {
  label: string;
  value: string;
}[];
const AddVoucher = () => {
  const [form] = Form.useForm();
  const [voucherCode, setVoucherCode] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSubmit = (values: any) => {
    const formattedEndDate = values.endDate
      ? DateTime.fromJSDate(values.endDate.toDate()).toFormat("dd/MM/yyyy")
      : null;

    const formValues = { ...values, endDate: formattedEndDate };
    console.log("Form Values: ", formValues);
  };

  const generateRandomCode = () => {
    const randomCode = uuidv4().substring(0, 8).toUpperCase();
    setVoucherCode(randomCode);
    form.setFieldsValue({ code: randomCode });
  };

  const productList = [
    { value: "Áo Thun Nam", label: "Áo Thun Nam" },
    { value: "Áo Sơ Mi Nam", label: "Áo Sơ Mi Nam" },
    { value: "Áo Thun Nữ", label: "Áo Thun Nữ" },
    { value: "Áo Sơ Mi Nữ", label: "Áo Sơ Mi Nữ" },
    { value: "Điện thoại", label: "Điện thoại" },
    { value: "Laptop", label: "Laptop" },
  ];

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleDeselectAll = () => {
    setSelectedValues([]);
    setIsAllSelected(false);
  };

  const handleProductChange = (value: any) => {
    if (isAllSelected) {
      if (value.length > 0) {
        setIsAllSelected(false);
        setSelectedProducts(value);
      }
    } else {
      if (value.length === productList.length) {
        setIsAllSelected(true);
      }
      setSelectedProducts(value);
    }

    if (value.length > 0) {
      setSearchTerm("");
    }
  };

  const handleSearch = (value: any) => {
    setSearchTerm(value);
  };

  const getSelectLabel = () => {
    if (isAllSelected) {
      return "Tất cả sản phẩm";
    }
    return selectedProducts.length > 0
      ? `Đã chọn ${selectedProducts.length} sản phẩm`
      : "Chọn sản phẩm";
  };

  // const filteredProducts = productList.filter((product) =>
  //   product.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  const handleSelectAll = () => {
    const allValues = productList.map((option) => option.label);
    setSelectedValues(allValues as any);
    setIsAllSelected(true);
  };
  const handleChange = (value: string[]) => {
    setSelectedValues(value);
    setIsAllSelected(value.length === productList.length); // Cập nhật trạng thái chọn tất cả
    console.log(`Selected: ${value}`);
  };
  const tabItems = [
    {
      key: "1",
      label: "Giá trị khuyến mãi",
      children: (
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Tên khuyến mãi</label>
            <Form.Item
              name="ten_khuyen_mai"
              initialValue=""
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn Nhập tên khuyễn mãi!",
                },
              ]}
              className="mb-0 w-3/4"
            >
              <Input placeholder="Nhập tên khuyến mãi" />
            </Form.Item>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Giá trị giảm giá:</label>
            <Form.Item
              name="gia_tri"
              initialValue=""
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập giá trị giảm giá!",
                },
                {
                  validator: (_, value) =>
                    value >= 0
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("Giá trị giảm giá không được âm")
                        ),
                },
              ]}
              className="mb-0 w-3/4"
            >
              <InputNumber
                className="w-full rounded-md"
                placeholder="Nhập giá trị giảm giá"
              />
            </Form.Item>
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Kiểu giảm giá:</label>
            <Form.Item
              name="loai_khuyen_mai"
              initialValue="Flat Amount (₫)"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn Chọn kiểu giảm giá!",
                },
              ]}
              className="mb-0 w-3/4"
            >
              <Select className="w-full rounded-md">
                <Option value="Flat Amount (₫)">Giảm giá tiền mặt (₫)</Option>
                <Option value="Percentage">Giảm giá phần trăm</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex items-center mb-4">
            <label className="w-1/4 font-semibold">Chọn sản phẩm</label>
            <Form.Item
              name="productDiscount"
              rules={[
                {
                  required: !isAllSelected && selectedProducts.length === 0,
                  message: "Vui lòng chọn sản phẩm!",
                },
              ]}
              className="mb-0 w-3/4"
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                value={selectedValues}
                onChange={handleChange}
                onSearch={handleSearch}
                options={productList}
                dropdownRender={(menu) => (
                  <div>
                    <Button
                      type="link"
                      onClick={
                        isAllSelected ? handleDeselectAll : handleSelectAll
                      }
                    >
                      {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                    </Button>
                    <Divider style={{ margin: "4px 0" }} />
                    {menu}
                  </div>
                )}
              />{" "}
            </Form.Item>
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Ngày bắt đầu:</label>
            <Form.Item
              name="Date"
              rules={[{ required: true, message: "Vui lòng chọn!" }]}
              className="mb-0 w-3/4"
            >
              <DatePicker className="w-full rounded-md" />
            </Form.Item>
          </div>
          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Ngày kết thúc:</label>
            <Form.Item
              name="endDate"
              rules={[
                { required: true, message: "Vui lòng chọn!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || value.isAfter(getFieldValue("Date"))) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Ngày kết thúc không được nhỏ hơn ngày bắt đầu")
                    );
                  },
                }),
              ]}
              className="mb-0 w-3/4"
            >
              <DatePicker className="w-full rounded-md" />
            </Form.Item>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Yêu cầu sử dụng",
      children: (
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Chi tiêu tối thiểu:</label>
            <Form.Item
              name="minSpend"
              initialValue=""
              // rules={[{ required: true, message: 'Please input the minimum spend!' }]}
              className="mb-0 w-3/4"
            >
              <InputNumber
                className="w-full rounded-md"
                placeholder="Nhập Chi tiêu tối thiểu"
              />
            </Form.Item>
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Giảm giá tối đa:</label>
            <Form.Item
              name="usageLimit"
              initialValue=""
              rules={[{ required: true, message: "vui long Nhập!" }]}
              className="mb-0 w-3/4"
            >
              <InputNumber
                className="w-full rounded-md"
                placeholder="Nhập giamr tối đa"
              />
            </Form.Item>
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: "Giới hạn khuyến mãi",
      children: (
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <label className="w-1/4 font-semibold">
              Số lượng khuyến mãi tối đa:
            </label>
            <Form.Item
              name="maxTotalUses"
              initialValue=""
              rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
              className="mb-0 w-3/4"
            >
              <InputNumber
                className="w-full rounded-md"
                placeholder="Nhập số lượng"
              />
            </Form.Item>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="relative flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="md:text-base">
          <span className="font-semibold">Thêm mới mã khuyến mãi</span>
        </h1>
        <div className="flex gap-2 ml-auto">
          <Link to="/admin/vouchers">
            <Button className="bg-[rgb(37,150,190)] text-white rounded-lg py-1 hover:bg-[rgb(37,150,190,0.8)] flex items-center gap-2">
              <ArrowLeftOutlined className="text-white" />
              Quay lại
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-6 ">
        <div className="bg-white p-8 shadow-lg rounded-lg w-full lg:w-[calc(100%+300px)]">
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              label="Mã khuyến mãi (CODE)"
              name="code"
              initialValue={voucherCode}
              rules={[
                { required: true, message: "Vui lòng nhập mã khuyến mãi!" },
              ]}
            >
              <div className="flex items-center">
                <Input
                  value={voucherCode}
                  readOnly
                  className="rounded-md flex-1"
                />
                <Button
                  onClick={generateRandomCode}
                  className="ml-4 bg-blue-500 text-white hover:bg-blue-600"
                >
                  Tạo mã
                </Button>
              </div>
            </Form.Item>

            <Tabs defaultActiveKey="1" items={tabItems} className="mb-6" />
          </Form>
        </div>
      </div>

      <Form.Item className="absolute bottom-2 right-14">
        <Button
          type="primary"
          htmlType="submit"
          className="w-[240px] bg-blue-500 text-white hover:bg-blue-600 py-2 rounded-md border-0 flex items-center gap-2"
        >
          <CheckOutlined className="text-white text-lg" />
          <span className="text-sm">Hoàn tất & Đăng khuyến mãi</span>
        </Button>
      </Form.Item>
    </main>
  );
};

export default AddVoucher;
