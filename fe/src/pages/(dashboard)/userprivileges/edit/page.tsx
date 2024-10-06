import instance from "@/configs/admin";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Checkbox, Form, Input, message, Tree } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const { TextArea } = Input;

const PageEditPermission: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const response = await instance.get("/vaitro/routes");
      return response.data;
    },
  });
  const quyen = data?.data.map((item: any) => {
    return { ...item, key: item?.key };
  });
  //   console.log(quyen);
  const { id } = useParams();
  const {
    data: vaitro,
    isLoading: isloading,
    isError: iserror,
  } = useQuery({
    queryKey: ["userPrivilegesID", id],
    queryFn: async () => {
      try {
        const response = await instance.get(`/vaitro/${id}`);
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
  });
  const vt = vaitro?.data?.quyens?.map((item: any) => item?.ten_quyen);
  // console.log(vt);
  const vaitroid = vaitro?.data;
  // console.log(vaitroid);

  const { mutate } = useMutation({
    mutationFn: async (values: any) => {
      try {
        const response = await instance.put("/vaitro/" + id, values);
        message.open({
          type: "success",
          content: "Cập nhật vai trò thành công!",
        });
        navigate("/admin/ADmin/userprivileges");
        return response.data;
      } catch (error: any) {
        const errorMessage = error?.response?.data?.error?.ten_vai_tro
          ? "Tên vai trò đã tồn tại"
          : "Vui lòng chọn quyền truy cập!";
        message.open({
          type: "error",
          content: errorMessage,
        });
        throw error;
      }
    },
  });

  useEffect(() => {
    if (vt && vt.length > 0) {
      setCheckedKeys(vt);
    }
  }, [vaitro]);

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  // console.log(vt);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>();
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onFinish = (values: any) => {
    const permissionData = {
      ...values,
      ten_quyen: checkedKeys,
    };
    if (!permissionData.ten_quyen) {
      permissionData.ten_quyen = [];
      message.open({
        type: "error",
        content: "Vui lòng chọn quyền truy cập!",
      });
      return false;
    }
    return mutate(permissionData);
    console.log("Received values:", permissionData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
  if (isloading) return <div>Loading...</div>;
  if (iserror) return <div>Error...</div>;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className=" md:text-base">
          Quản trị / <span className="font-semibold">Xem Vai trò</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">
          Xem Vai trò : {vaitroid?.ten_vai_tro ? vaitroid?.ten_vai_tro : ""}
        </h1>
        <div className="flex gap-2"></div>
      </div>
      <div className="bg-white p-5 w-full rounded-lg">
        <div className="w-full flex gap-20 mb-3">
          <h1 className="text-2xl font-semibold w-[50%]">Vai trò </h1>
          <h1 className="text-2xl font-semibold  w-[50%]">
            Quản lý quyền truy cập
          </h1>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={vaitro?.data}
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
                  message: "Vui lòng nhập tên không chứa khoảng trắng!",
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
                  message: "Vui lòng nhập mô tả không chứa khoảng trắng!",
                },
              ]}
            >
              <TextArea placeholder="Nhập mô tả" rows={4} />
            </Form.Item>
            <Form.Item className="flex">
              <Link to="/admin/ADmin/userprivileges">
                <Button className="font-semibold mx-2 text-black">
                  Quay lại
                </Button>
              </Link>
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
                  onExpand={(expandedKeysValue) => {
                    setExpandedKeys(expandedKeysValue);
                    setAutoExpandParent(false);
                  }}
                  expandedKeys={expandedKeys}
                  autoExpandParent={autoExpandParent}
                  onCheck={(checkedKeysValue) => {
                    if (
                      Array.isArray(checkedKeysValue) &&
                      checkedKeysValue.length < 1
                    ) {
                      message.open({
                        type: "error",
                        content: "Vui lòng chọn quyền truy cập!",
                      });
                    }
                    // } else {
                    setCheckedKeys(checkedKeysValue as React.Key[]);
                    // }
                  }}
                  checkedKeys={checkedKeys}
                  onSelect={(selectedKeysValue) => {
                    setSelectedKeys(selectedKeysValue);
                  }}
                  selectedKeys={selectedKeys}
                  treeData={quyen}
                />
              </Checkbox.Group>
            </Form.Item>
          </div>
        </Form>
      </div>
    </main>
  );
};

export default PageEditPermission;
