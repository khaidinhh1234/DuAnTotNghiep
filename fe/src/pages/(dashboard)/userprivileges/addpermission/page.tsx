import instance from "@/configs/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TreeProps } from "antd";
import { Button, Checkbox, Form, Input, message, Tree } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const { TextArea } = Input;

const PageAddPermission: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const response = await instance.get("/vaitro/routes");
      return response.data;
    },
  });
  // console.log("data", data);
  const vaitro = data?.data.map((item: any) => {
    return { ...item };
  });
  // console.log("vaitro", vaitro);
  const { mutate } = useMutation({
    mutationFn: async (values: any) => {
      try {
        const response = await instance.post("/vaitro", values);
        message.open({
          type: "success",
          content: "Thêm mới vai trò thành công!",
        });
        navigate("/admin/ADmin/userprivileges");
        return response.data;
      } catch (error: any) {
        message.open({
          type: "error",
          content: error?.response?.data.error.ten_vai_tro
            ? "tên vai trò đã tồn tại"
            : "Vui lòng chọn quyền truy cập!",
        });
        // console.log(error?.response.data.error.ten_vai_tro);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["VAITRO_KEY"],
      });
    },
  });

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([""]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand: TreeProps["onExpand"] = (expandedKeysValue) => {
    // console.log("onExpand", expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    console.log("onExpand", expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onSelect: TreeProps["onSelect"] = (selectedKeysValue) => {
    // console.log("onSelect", info);
    // console.log("onSelect", selectedKeysValue);
    setSelectedKeys(selectedKeysValue);
  };
  const onFinish = (values: any) => {
    const permissionData = {
      ...values,
      ten_quyen: checkedKeys,
    };
    mutate(permissionData);
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
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
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
                  pattern: /^[A-Z].*$/,
                  message: "Chữ cái đầu tiên phải viết hoa!",
                },
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
                  pattern: /^[A-Z].*$/,
                  message: "Chữ cái đầu tiên phải viết hoa!",
                },

                {
                  pattern: /^[^\s]+(\s+[^\s]+)*$/,
                  message: "Vui lòng nhập mô tả không chứa ký tự trắng!",
                },
              ]}
            >
              <TextArea placeholder="Nhập mô tả" rows={4} />
            </Form.Item>
            <Form.Item className="flex">
              <Link to={"/admin/ADmin/userprivileges"}>
                <Button htmlType="submit" className="font-semibold mx-2">
                  Quay lại
                </Button>
              </Link>
              <Button
                htmlType="submit"
                className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
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
                    const checkedKeysArray = Array.isArray(checkedKeysValue)
                      ? checkedKeysValue
                      : checkedKeysValue.checked;
                    if (checkedKeysArray.length === 0) {
                      message.open({
                        type: "error",
                        content: "Vui lòng chọn quyền truy cập!",
                      });
                    }
                    if (checkedKeysArray.length > 0) {
                      setCheckedKeys(checkedKeysArray as React.Key[]);
                    }
                  }}
                  checkedKeys={checkedKeys}
                  onSelect={onSelect}
                  selectedKeys={selectedKeys}
                  treeData={vaitro}
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
