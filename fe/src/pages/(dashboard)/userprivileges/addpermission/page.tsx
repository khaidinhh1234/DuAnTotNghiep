import instance from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";
import type { TreeDataNode, TreeProps } from "antd";
import { Button, Card, Checkbox, Form, Input, message, Tree } from "antd";
import React, { useState } from "react";

const treeData: TreeDataNode[] = [
  {
    title: "Quản lý sản phẩm",
    key: "products",
    children: [
      { title: "Xóa sản phẩm", key: "delete" },
      { title: "Thêm sản phẩm", key: "add" },
      { title: "Cập nhật sản phẩm", key: "edit" },
    ],
  },
  {
    title: "Quản lý danh mục",
    key: "admin.danhmuc.index",
    children: [
      { title: "Xóa người dùng", key: "admin.danhmuc.thungrac" },
      { title: "Thêm người dùng", key: "admin.danhmuc.them" },
      { title: "Cập nhật người dùng", key: "admin.danhmuc.edit" },
    ],
  },
  // {
  //   title: "Quản lý người dùng",
  //   key: "",
  //   children: [
  //     { title: "Xóa người dùng", key: "admin.danhmuc.thungrac" },
  //     { title: "Thêm người dùng", key: "admin.danhmuc.them" },
  //     { title: "Cập nhật người dùng", key: "admin.danhmuc.edit" },
  //   ],
  // },
  {
    title: "Quản lý đơn hàng",
    key: "orders",
    children: [
      { title: "Xóa đơn hàng", key: "delete-order" },
      { title: "Thêm đơn hàng", key: "add-order" },
      { title: "Cập nhật đơn hàng", key: "edit-order" },
    ],
  },
  {
    title: "Quản lý khách hàng",
    key: "customers",
    children: [
      { title: "Xóa khách hàng", key: "delete-customer" },
      { title: "Thêm khách hàng", key: "add-customer" },
      { title: "Cập nhật khách hàng", key: "edit-customer" },
    ],
  },
  {
    title: "Quản lý nội dung",
    key: "content",
    children: [
      { title: "Xóa nội dung", key: "delete-content" },
      { title: "Thêm nội dung", key: "add-content" },
      { title: "Cập nhật nội dung", key: "edit-content" },
    ],
  },
  {
    title: "Quản lý báo cáo",
    key: "reports",
    children: [
      { title: "Xóa báo cáo", key: "delete-report" },
      { title: "Thêm báo cáo", key: "add-report" },
      { title: "Cập nhật báo cáo", key: "edit-report" },
    ],
  },
  {
    title: "Quản lý khuyến mãi",
    key: "promotions",
    children: [
      { title: "Xóa khuyến mãi", key: "delete-promotion" },
      { title: "Thêm khuyến mãi", key: "add-promotion" },
      { title: "Cập nhật khuyến mãi", key: "edit-promotion" },
    ],
  },
  {
    title: "Quản lý đánh giá",
    key: "reviews",
    children: [
      { title: "Xóa đánh giá", key: "delete-review" },
      { title: "Thêm đánh giá", key: "add-review" },
      { title: "Cập nhật đánh giá", key: "edit-review" },
    ],
  },
  {
    title: "Quản lý doanh thu",
    key: "revenue",
    children: [
      { title: "Xóa doanh thu", key: "delete-revenue" },
      { title: "Thêm doanh thu", key: "add-revenue" },
      { title: "Cập nhật doanh thu", key: "edit-revenue" },
    ],
  },
];

const { TextArea } = Input;

const PageAddPermission: React.FC = () => {
  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ["permissions"],
  //   queryFn: async () => {
  //     const response = await instance.get("/admin/vaitro/routes");
  //     return response.data;
  //   },
  // });
  // console.log(data);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([""]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand: TreeProps["onExpand"] = (expandedKeysValue) => {
    console.log("onExpand", expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    console.log("onExpand", expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onSelect: TreeProps["onSelect"] = (selectedKeysValue, info) => {
    console.log("onSelect", info);
    console.log("onSelect", selectedKeysValue);
    setSelectedKeys(selectedKeysValue);
  };
  const onFinish = (values: any) => {
    const permissionData = {
      ...values,
      ten_quyen: checkedKeys,
    };
    console.log(permissionData);
    if (!permissionData.ten_quyen) {
      permissionData.ten_quyen = [];
      message.open({
        type: "error",
        content: "Vui lòng chọn quyền truy cập!",
      });
      return false;
    }
    return permissionData;
    // console.log("Received values:", values);
    console.log("Received values:", permissionData);
    // Thực hiện logic gửi dữ liệu đến API hoặc server tại đây
  };
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className=" md:text-base">
          Quản trị / <span className="font-semibold">Vai trò</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Vai trò</h1>
        <div className="flex gap-2"></div>
      </div>
      <div className="bg-white p-5 w-full rounded-lg">
        <div className="w-full flex gap-20 mb-3">
          <h1 className="text-2xl font-semibold w-[50%]">Vai trò</h1>
          <h1 className="text-2xl font-semibold  w-[50%]">
            Quản lý quyền truy cập
          </h1>
        </div>
        <Form
          layout="vertical"
          onFinish={onFinish}
          className="flex gap-20 w-full"
        >
          <div className="w-[50%]">
            <Form.Item
              label="Tên quyền"
              name="ten_vai_tro"
              rules={[
                { required: true, message: "Vui lòng nhập tên vai trò!" },
                {
                  pattern: /^[^\s]+(\s+[^\s]+)*$/,
                  message: "Vui lòng nhập tên không chứa ký tự trắng!",
                },
              ]}
            >
              <Input placeholder="Nhập tên quyền" />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="mo_ta"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả !" },
                {
                  pattern: /^[^\s]+(\s+[^\s]+)*$/,
                  message: "Vui lòng nhập mô tả không chứa ký tự trắng!",
                },
              ]}
            >
              <TextArea placeholder="Nhập mô tả" rows={4} />
            </Form.Item>
            <Form.Item className="flex">
              <Button htmlType="submit" className="font-semibold mx-2">
                Quay lại
              </Button>
              <Button
                htmlType="submit"
                className="text-white font-semibold bg-black hover:bg-black/50"
              >
                Lưu
              </Button>
            </Form.Item>{" "}
          </div>
          <div className="w-[50%]">
            <Form.Item name="ten_quyen">
              <Checkbox.Group value={checkedKeys}>
                <Tree
                  checkable
                  onExpand={onExpand}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  onCheck={(checkedKeysValue) => {
                    setCheckedKeys(checkedKeysValue as React.Key[]);
                  }}
                  checkedKeys={checkedKeys}
                  onSelect={onSelect}
                  selectedKeys={selectedKeys}
                  treeData={treeData}
                />
              </Checkbox.Group>
            </Form.Item>
          </div>
        </Form>
      </div>
    </main>
  );
};

export default PageAddPermission;
