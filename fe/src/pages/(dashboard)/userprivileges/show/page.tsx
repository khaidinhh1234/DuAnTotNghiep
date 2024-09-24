import instance from "@/configs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TreeProps } from "antd";
import { Button, Checkbox, Form, Input, message, Tree } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const { TextArea } = Input;

const Showvaitro: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const response = await instance.get("/admin/vaitro/routes");
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
        const response = await instance.get(`/admin/vaitro/${id}`);
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
        const response = await instance.post("/admin/vaitro", values);
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
        queryKey: ["userPrivileges"],
      });
    },
  });

  useEffect(() => {
    if (vt && vt.length > 0) {
      setCheckedKeys(vt);
    }
  }, [vaitro]);

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  // console.log(vt);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(); // Gán các quyền đã chọn
  // console.log(checkedKeys);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

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
  //   console.log(vaitroid?.data?.quyens);
  //   const treeData = vaitroid?.quyens?.map((item: any) => {
  //     return {
  //       title: item.ten_quyen,
  //       key: item.id,
  //       //   children: item.quyens.map((subItem: any) => {
  //       //     return {
  //       //       title: subItem.ten_quyen,
  //       //       key: subItem.id,
  //       //     };
  //       //   }),
  //     };
  //   });
  //   useEffect(() => {
  //     setCheckedKeys(vaitroid.quyens); // Gán danh sách quyền đã chọn
  //   }, [vaitroid.quyens]);
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
              //   rules={[
              //     { required: true, message: "Vui lòng nhập tên vai trò!" },
              //     {
              //       pattern: /^[^\s]+(\s+[^\s]+)*$/,
              //       message: "Vui lòng nhập tên không chứa ký tự trắng!",
              //     },
              //   ]}
            >
              <Input placeholder="Nhập tên quyền" disabled />
            </Form.Item>
            <Form.Item
              label="Mô tả"
              name="mo_ta"

              //   rules={[
              //     { required: true, message: "Vui lòng nhập mô tả !" },
              //     {
              //       pattern: /^[^\s]+(\s+[^\s]+)*$/,
              //       message: "Vui lòng nhập mô tả không chứa ký tự trắng!",
              //     },
              //   ]}
            >
              <TextArea placeholder="Nhập mô tả" rows={4} disabled />
            </Form.Item>
            <Form.Item className="flex">
              <Link to="/admin/ADmin/userprivileges">
                <Button className="font-semibold mx-2 text-black">
                  Quay lại
                </Button>
              </Link>
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
                    const checkedKeysArray = Array.isArray(checkedKeysValue)
                      ? checkedKeysValue
                      : checkedKeysValue.checked;
                    if (checkedKeysArray.length === 0) {
                      message.open({
                        type: "error",
                        content: "Vui lòng chọn quyền truy cập!",
                      });
                    } else {
                      setCheckedKeys(checkedKeysArray as React.Key[]);
                    }
                  }}
                  disabled
                  checkedKeys={checkedKeys} // Gán quyền đã chọn vào checkbox
                  onSelect={(selectedKeysValue) => {
                    setSelectedKeys(selectedKeysValue);
                  }}
                  selectedKeys={selectedKeys}
                  treeData={quyen} // Gán dữ liệu tree
                />
              </Checkbox.Group>
            </Form.Item>
          </div>
        </Form>
      </div>
    </main>
  );
};

export default Showvaitro;
