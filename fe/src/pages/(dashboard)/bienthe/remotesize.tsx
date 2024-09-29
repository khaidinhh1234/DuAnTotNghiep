import React from "react";
import { Table, Button, Space, message, Spin } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Link, useParams } from "react-router-dom";

const Remotesize: React.FC = () => {
  const queryClient = useQueryClient(); // Sử dụng queryClient để invalidate queries
  const { id } = useParams();

  // Fetch danh mục đã xóa
  const { data, isLoading, isError } = useQuery({
    queryKey: ["size"],
    queryFn: async () => {
      try {
        const response = await instance.get(
          "/admin/bienthekichthuoc/thung-rac"
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching remote :", error);
        throw new Error("Error fetching remote ");
      }
    },
  });

  // Xử lý khôi phục danh mục
  const handleRestore = async (id: string) => {
    try {
      await instance.post(`/admin/bienthekichthuoc/thung-rac/${id}`);
      message.success("Khôi phục danh mục thành công");
      // Refresh lại dữ liệu sau khi khôi phục
      queryClient.invalidateQueries({ queryKey: ["size"] });
    } catch (error) {
      console.error("Error restoring category:", error);
      message.error("Khôi phục danh mục thất bại");
    }
  };

  // Xử lý xóa danh mục vĩnh viễn
  // const handleDelete = async (id: string) => {
  //   try {
  //     await instance.delete(`/admin/danhmuc/${id}`);
  //     toast.success("Xóa danh mục vĩnh viễn thành công");
  //     // Refresh lại dữ liệu sau khi xóa vĩnh viễn
  //     queryClient.invalidateQueries(["danhmuc-remote"]);
  //   } catch (error) {
  //     console.error("Error deleting category:", error);
  //     toast.error("Xóa danh mục vĩnh viễn thất bại");
  //   }
  // };

  const columns = [
    {
      title: "STT",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Tên kích thước",
      key: "kich_thuoc",
      dataIndex: "kich_thuoc",
    },

    {
      title: "Quản trị",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => handleRestore(record.id)}>Khôi phục</Button>
          {/* <Button onClick={() => handleDelete(record.id)} danger>Xóa vĩnh viễn</Button> */}
        </Space>
      ),
    },
  ];
  if (isError)
    return (
      <div>
        <div className="flex items-center justify-center  mt-[250px]">
          <div className=" ">
            <Spin size="large" />
          </div>
        </div>
      </div>
    );
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Sản phẩm / Biến thể /
          <span className="font-semibold px-px">Thùng rác</span>
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Biến thể kích thước</h1>
        <Link to="/admin/products/bienthe">
          <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
            Quay lại
          </Button>
        </Link>
      </div>
      <div className="max-w-5xl">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={isLoading}
        />
      </div>
    </main>
  );
};

export default Remotesize;
