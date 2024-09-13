import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Row, Col, Card } from 'antd';

const { TextArea } = Input;

const PageAddPermission: React.FC = () => {
  const [permissions, setPermissions] = useState({
    manageProduct: false,
    view: false,
    add: false,
    edit: false,
    delete: false,
  });

  const onFinish = (values: any) => {
    const permissionData = {
      ...values,
      permissions,
    };
    console.log('Received values:', permissionData);
    // Thực hiện logic gửi dữ liệu đến API hoặc server tại đây
  };

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

  const handleSubCheckboxChange = (e: any) => {
    setPermissions(prev => ({
      ...prev,
      [e.target.value]: e.target.checked,
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Card title="Thông tin quyền" bordered={true} className="shadow-lg">
            <Form
              layout="vertical"
              onFinish={onFinish}
              style={{ maxWidth: 600 }}
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
              <Form.Item>
                <Button type="primary" htmlType="submit" className="w-full">
                  Lưu Quyền
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Quản lý quyền truy cập" bordered={true} className="shadow-lg">
            <Form layout="vertical">
              <Form.Item>
                <Checkbox
                  checked={permissions.manageProduct}
                  onChange={handleMainCheckboxChange}
                >
                  Quản lý sản phẩm
                </Checkbox>
                <div style={{ marginTop: 16, paddingLeft: 24 }}>
                  <Checkbox.Group>
                    <Row gutter={16}>
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
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PageAddPermission;
