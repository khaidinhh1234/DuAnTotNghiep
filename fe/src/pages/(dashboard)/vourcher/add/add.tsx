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

const { Option } = Select;

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
    { id: 1, name: "Áo Thun Nam" },
    { id: 2, name: "Áo Sơ Mi Nam" },
    { id: 3, name: "Áo Thun Nữ" },
    { id: 4, name: "Áo Sơ Mi Nữ" },
    { id: 5, name: "Điện thoại" },
    { id: 6, name: "Laptop" },
  ];

  const handleSelectAll = () => {
    setSelectedProducts([]);
    setIsAllSelected(true);
    setSearchTerm("");
  };

  const handleDeselectAll = () => {
    setSelectedProducts([]);
    setIsAllSelected(false);
    setSearchTerm("");
  };

  const handleProductChange = (value) => {
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

  const handleSearch = (value) => {
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

  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const tabItems = [
    {
      key: "1",
      label: "Giá trị khuyến mãi",
      children: (
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Mô tả khuyến mãi</label>
            <Form.Item
              name="discountType"
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
              name="name"
              initialValue=""
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn Nhập giá trị giảm giá!",
                },
              ]}
              className="mb-0 w-3/4"
            >
              <InputNumber
                className="w-full rounded-md"
                placeholder="Nhập tên Giá trị khuyến mãi"
              />
            </Form.Item>
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Kiểu giảm giá:</label>
            <Form.Item
              name="discountType"
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
            <label className="w-1/4 font-semibold">{getSelectLabel()}</label>
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
                placeholder="Chọn sản phẩm"
                value={selectedProducts}
                onChange={handleProductChange}
                style={{ width: "100%" }}
                showSearch
                filterOption={false}
                onSearch={handleSearch}
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
              >
                {filteredProducts.map((product) => (
                  <Option key={product.id} value={product.id}>
                    {product.name}
                  </Option>
                ))}
              </Select>
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
              rules={[{ required: true, message: "Vui lòng chọn!" }]}
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
