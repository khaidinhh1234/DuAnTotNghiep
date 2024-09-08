import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Row, Col, Card } from 'antd';

const { TextArea } = Input;

const PageAddPermission: React.FC = () => {
  // Trạng thái lưu trữ các quyền
  const [permissions, setPermissions] = useState({
    manageProduct: false,
    view: false,
    add: false,
    edit: false,
    delete: false,
  });

  // Hàm xử lý khi gửi form
  const onFinish = (values: any) => {
    const permissionData = {
      ...values,
      permissions,
    };
    console.log('Received values:', permissionData);
    // Thực hiện logic gửi dữ liệu đến API hoặc server tại đây
  };

  // Hàm xử lý thay đổi cho checkbox chính (Quản lý sản phẩm)
  const handleMainCheckboxChange = (e: any) => {
    const checked = e.target.checked;
    setPermissions({
      manageProduct: checked,
      view: checked,
      add: checked,
      edit: checked,
      delete: checked,
    });
  };

  // Hàm xử lý thay đổi cho các checkbox con (Xem, Thêm, Sửa, Xóa)
  const handleSubCheckboxChange = (e: any) => {
    setPermissions(prev => ({
      ...prev,
      [e.target.value]: e.target.checked,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <Row gutter={16}>
        {/* Form nhập tên quyền và mô tả */}
        <Col span={12}>
          <Card title="Thông tin quyền" bordered={false}>
            <Form
              layout="vertical"
              onFinish={onFinish}
              style={{ maxWidth: 800 }}
            >
              <Form.Item
                label="Tên quyền"
                name="permissionName"
                rules={[{ required: true, message: 'Vui lòng nhập tên quyền!' }]}
              >
                <Input placeholder="Nhập tên quyền" />
              </Form.Item>
              <Form.Item
                label="Mô tả"
                name="description"
              >
                <TextArea placeholder="Nhập mô tả" rows={4} />
              </Form.Item>
              {/* Nút lưu quyền */}
              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  Lưu Quyền
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Phần phân quyền quản lý sản phẩm */}
        <Col span={12}>
          <Card title="Các quyền được thực hiện" bordered={false}>
            <Form layout="vertical">
              <Form.Item>
                {/* Checkbox chính: Quản lý sản phẩm */}
                <Checkbox
                  checked={permissions.manageProduct}
                  onChange={handleMainCheckboxChange}
                >
                  Quản lý sản phẩm
                </Checkbox>
                
                {/* Checkbox nhóm quyền con */}
                <Checkbox.Group style={{ display: 'block', marginTop: 8 }}>
                  <Row>
                    <Col span={24}>
                      <Checkbox
                        value="view"
                        checked={permissions.view}
                        onChange={handleSubCheckboxChange}
                        disabled={!permissions.manageProduct}
                      >
                        Xem
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox
                        value="add"
                        checked={permissions.add}
                        onChange={handleSubCheckboxChange}
                        disabled={!permissions.manageProduct}
                      >
                        Thêm
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox
                        value="edit"
                        checked={permissions.edit}
                        onChange={handleSubCheckboxChange}
                        disabled={!permissions.manageProduct}
                      >
                        Sửa
                      </Checkbox>
                    </Col>
                    <Col span={24}>
                      <Checkbox
                        value="delete"
                        checked={permissions.delete}
                        onChange={handleSubCheckboxChange}
                        disabled={!permissions.manageProduct}
                      >
                        Xóa
                      </Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PageAddPermission;
