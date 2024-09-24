import React from "react";
import { Table, Button, Space } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const CategoriesRemote: React.FC = () => {
  const queryClient = useQueryClient(); // Sử dụng queryClient để invalidate queries
  const { id } = useParams();

  // Fetch danh mục đã xóa
  const { data, isLoading, isError } = useQuery({
    queryKey: ["danhmuc-remote"],
    queryFn: async () => {
      try {
        const response = await instance.get("/admin/danhmuc/thung-rac");
        return response.data;
      } catch (error) {
        console.error("Error fetching remote categories:", error);
        throw new Error("Error fetching remote categories");
      }
    },
  });

  // Xử lý khôi phục danh mục
  const handleRestore = async (id: string) => {
    try {
      await instance.post(`/admin/danhmuc/thung-rac/${id}`);
      toast.success("Khôi phục danh mục thành công");
      // Refresh lại dữ liệu sau khi khôi phục
      queryClient.invalidateQueries(["danhmuc-remote"]);
    } catch (error) {       
      console.error("Error restoring category:", error);
      toast.error("Khôi phục danh mục thất bại");
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
      title: "Tên danh mục",
      key: "ten_danh_muc",
      dataIndex: "ten_danh_muc",
    },
    {
      title: "Ảnh danh mục",
      key: "anh_danh_muc",
      dataIndex: "anh_danh_muc",
      render: (anh_danh_muc: string) => (
        <img
          src={anh_danh_muc}
          alt="Ảnh danh mục"
          style={{ width: "50px", height: "50px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Danh mục cha",
      key: "cha_id",
      dataIndex: "cha_id",
    },
    {
      title: "Thời gian tạo",
      key: "createdAt",
      dataIndex: "createdAt",
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

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold px-px">Thùng rác</span>
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Danh mục đã xóa</h1>
        <Link to="/admin/categories">
          <Button className="bg-black text-white rounded-lg py-1">
            Quay lại
          </Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={data?.data || []}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={isLoading}
      />
    </main>
  );
};

export default CategoriesRemote;
