
import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Tabs, Button } from 'antd';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';

const { Option } = Select;

const AddVoucher = () => {
  const [form] = Form.useForm();
  const [voucherCode, setVoucherCode] = useState('');

  const handleSubmit = (values: any) => {

    const formattedEndDate = values.endDate
      ? DateTime.fromJSDate(values.endDate.toDate()).toFormat('dd/MM/yyyy')
      : null;

    const formValues = { ...values, endDate: formattedEndDate };
    console.log('Form Values: ', formValues);
  };

  const generateRandomCode = () => {
    const randomCode = uuidv4().substring(0, 8).toUpperCase();
    setVoucherCode(randomCode);
    form.setFieldsValue({ code: randomCode });
  };

  const tabItems = [
    {
      key: '1',
      label: 'Giá trị khuyến mãi',
      children: (
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Giá trị giảm giá:</label>
            <Form.Item
              name="discountValue"
              initialValue={300000}
              rules={[{ required: true, message: 'Please input the discount amount!' }]}
              className="mb-0 w-3/4"
            >
              <InputNumber className="w-full rounded-md" />
            </Form.Item>
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Kiểu giảm giá:</label>
            <Form.Item
              name="discountType"
              initialValue="Flat Amount (₫)"
              rules={[{ required: true, message: 'Please select a discount type!' }]}
              className="mb-0 w-3/4"
            >
              <Select className="w-full rounded-md">
                <Option value="Flat Amount (₫)">Giảm giá tiền mặt (₫)</Option>
                <Option value="Percentage">Giảm giá phần trăm</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Giảm giá với các danh mục:</label>
            <Form.Item
              name="categoryDiscount"
              rules={[{ required: true, message: 'Please select a category!' }]}
              className="mb-0 w-3/4"
            >
              <Select className="w-full rounded-md">
                <Option value="All">Áo Nam</Option>
                <Option value="All">Áo Nữ</Option>
                <Option value="All">Quần Nam</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Giảm giá với các phương thức thanh toán:</label>
            <Form.Item
              name="paymentDiscount"
              rules={[{ required: true, message: 'Please select a payment method!' }]}
              className="mb-0 w-3/4"
            >
              <Select className="w-full rounded-md">
                <Option value="All">Tiền mặt</Option>
                <Option value="All">Thanh toán Momo</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Ngày kết thúc:</label>
            <Form.Item
              name="endDate"
              rules={[{ required: true, message: 'Please select an end date!' }]}
              className="mb-0 w-3/4"
            >
              <DatePicker className="w-full rounded-md" />
            </Form.Item>
          </div>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Yêu cầu sử dụng',
      children: (
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Chi tiêu tối thiểu:</label>
            <Form.Item
              name="minSpend"
              initialValue={500000}
              rules={[{ required: true, message: 'Please input the minimum spend!' }]}
              className="mb-0 w-3/4"
            >
              <InputNumber className="w-full rounded-md" />
            </Form.Item>
          </div>

          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Chi tiêu tối đa:</label>
            <Form.Item
              name="usageLimit"
              initialValue={100}
              rules={[{ required: true, message: 'Please input the usage limit!' }]}
              className="mb-0 w-3/4"
            >
              <InputNumber className="w-full rounded-md" />
            </Form.Item>
          </div>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Giới hạn khuyến mãi',
      children: (
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <label className="w-1/4 font-semibold">Số lượng khuyến mãi tối đa:</label>
            <Form.Item
              name="maxTotalUses"
              initialValue={1000}
              rules={[{ required: true, message: 'Please input the max total uses!' }]}
              className="mb-0 w-3/4"
            >
              <InputNumber className="w-full rounded-md" />
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

      <div className="flex flex-col lg:flex-row lg:gap-6">
        <div className="bg-white p-8 shadow-lg rounded-lg w-full lg:w-[calc(100%+300px)]">
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
          >
            <Form.Item
              label="Mã khuyến mãi (CODE)"
              name="code"
              initialValue={voucherCode}
              rules={[{ required: true, message: 'Please input the voucher code!' }]}
            >
              <Input
                addonAfter={
                  <Button
                    onClick={generateRandomCode}
                    className="bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Tạo mã
                  </Button>
                }
                className="rounded-md"
              />
            </Form.Item>

            <Tabs defaultActiveKey="1" items={tabItems} className="mb-6" />

          </Form>
        </div>
      </div>

      <Form.Item className="absolute bottom-12 right-6">
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
