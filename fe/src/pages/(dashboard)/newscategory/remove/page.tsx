import instance from "@/configs/admin";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Space, Table } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const NewCategoriesRemote: React.FC = () => {
  const queryClient = useQueryClient();
  // const { id } = useParams();

  // Fetch danh mục đã xóa
  const { data, isLoading } = useQuery({
    queryKey: ["danhmuc-remote"],
    queryFn: async () => {
      try {
        const response = await instance.get("/danhmuctintuc/thung-rac");
        return response.data;
      } catch (error) {
        console.error("Error fetching remote categories:", error);
        throw new Error("Error fetching remote categories");
      }
    },
  });

  const handleRestore = async (id: string) => {
    try {
      await instance.post(`/danhmuctintuc/thung-rac/${id}`);
      toast.success("Khôi phục danh mục thành công");
      // Refresh lại dữ liệu sau khi khôi phục
      queryClient.invalidateQueries({ queryKey: ["danhmuc-remote"] });
    } catch (error) {
      console.error("Error restoring category:", error);
      toast.error("Khôi phục danh mục thất bại");
    }
  };

  const columns = [
    {
      title: "STT",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Tên danh mục",
      key: "ten_danh_muc_tin_tuc",
      dataIndex: "ten_danh_muc_tin_tuc",
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
        <Link to="/admin/newcategory">
          <Button className="bg-black text-white rounded-lg py-1">
            Quay lại
          </Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={data?.data || []}
        rowKey="id"
        pagination={{ pageSize: 10, className: "my-5" }}
        loading={isLoading}
      />
    </main>
  );
};

export default NewCategoriesRemote;
