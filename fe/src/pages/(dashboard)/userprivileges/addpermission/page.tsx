import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Row, Col, Card } from 'antd';

const { TextArea } = Input;

const PageAddPermission: React.FC = () => {
  // Trạng thái lưu trữ các quyền theo chức năng
  const [permissions, setPermissions] = useState({
    manageProduct: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    manageCategory: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    managePost: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
    manageOrder: {
      view: false,
      add: false,
      edit: false,
      delete: false,
    },
  });

  // Hàm xử lý khi gửi form
  const onFinish = (values: any) => {
    const permissionData = {
      ...values,
      permissions,
    };
    console.log('Nhận giá trị:', permissionData);
    // Thực hiện logic gửi dữ liệu đến API hoặc server tại đây
  };

  // Hàm xử lý thay đổi cho checkbox con theo chức năng
  const handleCheckboxChange = (e: any, category: string) => {
    const { value, checked } = e.target;
    setPermissions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [value]: checked,
      },
    }));
  };

  // Hàm xử lý thay đổi cho checkbox chính
  const handleMasterCheckboxChange = (e: any, category: string) => {
    const { checked } = e.target;
    setPermissions(prev => ({
      ...prev,
      [category]: {
        view: checked,
        add: checked,
        edit: checked,
        delete: checked,
      },
    }));
  };

  // Hàm kiểm tra trạng thái của checkbox chính
  const isMasterCheckboxChecked = (category: string) => {
    const values = permissions[category];
    return values.view && values.add && values.edit && values.delete;
  };

  return (
    <div className="container mx-auto p-4">
      <Row gutter={16}>
        {/* Phần thông tin quyền */}
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

        {/* Phần phân quyền */}
        <Col span={12}>
          <Card title="Quản lý quyền" bordered={false}>
            <Form layout="vertical">
              {/* Checkbox nhóm quyền theo chức năng */}
              <Form.Item>
                <Row gutter={16}>
                  {Object.keys(permissions).map((category) => (
                    <Col span={24} key={category}>
                      <Card title={`Quản lý ${category.replace('manage', '')}`} bordered={false}>
                        <Checkbox
                          checked={isMasterCheckboxChecked(category)}
                          onChange={(e) => handleMasterCheckboxChange(e, category)}
                        >
                          Tất cả quyền
                        </Checkbox>
                        <Checkbox.Group style={{ display: 'block', marginTop: 8 }}>
                          <Row>
                            {Object.keys(permissions[category]).map(action => (
                              <Col span={24} key={action}>
                                <Checkbox
                                  value={action}
                                  checked={permissions[category][action]}
                                  onChange={(e) => handleCheckboxChange(e, category)}
                                >
                                  {action === 'view' ? 'Xem' :
                                    action === 'add' ? 'Thêm' :
                                    action === 'edit' ? 'Sửa' :
                                    action === 'delete' ? 'Xóa' : ''}
                                </Checkbox>
                              </Col>
                            ))}
                          </Row>
                        </Checkbox.Group>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PageAddPermission;
