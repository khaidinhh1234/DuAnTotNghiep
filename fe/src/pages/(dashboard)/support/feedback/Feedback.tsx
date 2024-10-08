import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';

const Feedback: React.FC = () => {
  const [form] = Form.useForm();
  const [phanHoi, setPhanHoi] = useState('');

  const handleSubmit = async (values: any) => {
    // Chỉ cần gửi nội dung phản hồi của admin, không cần nhập email người dùng
    const feedbackData = {
      noiDungPhanHoi: values.phan_hoi,
      adminName: 'Ngô Toản (Admin)',
      subject: 'Phản hồi từ Admin về yêu cầu của bạn',
    };

    try {
      await axios.post('/api/send-feedback', feedbackData);
      notification.success({
        message: 'Phản hồi đã được gửi thành công!',
      });
      form.resetFields();
    } catch (error) {
      notification.error({
        message: 'Có lỗi xảy ra khi gửi phản hồi!',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg p-8">
        {/* Thông tin khách hàng */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-lg shadow-md text-white">
            <h2 className="text-3xl font-bold mb-4">Thông tin khách hàng</h2>
            <p className="mb-2"><strong>Họ tên:</strong> Ngô Toản</p>
            <p className="mb-2"><strong>Email:</strong> nqton301004@gmail.com</p>
            <p className="mb-2"><strong>Số điện thoại:</strong> 0123-456-789</p>
            <p className="mb-2"><strong>Nội dung yêu cầu:</strong> Tôi muốn mua hàng với số lượng lớn.</p>
          </div>

          {/* Form nhập phản hồi */}
          <div className="p-6 rounded-lg shadow-md bg-white">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Phản hồi của Admin</h2>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="space-y-6"
            >
              <Form.Item
                label="Nhập phản hồi của bạn"
                name="phan_hoi"
                rules={[{ required: true, message: 'Vui lòng nhập phản hồi!' }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập phản hồi"
                  value={phanHoi}
                  onChange={(e) => setPhanHoi(e.target.value)}
                  className="rounded-lg border-gray-300 focus:ring focus:ring-blue-200"
                />
              </Form.Item>
              
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 text-white font-semibold transition-all duration-200"
                >
                  Gửi phản hồi
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
