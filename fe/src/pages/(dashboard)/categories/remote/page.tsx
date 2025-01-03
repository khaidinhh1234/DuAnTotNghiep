import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Space, Table } from "antd";
import React from "react";

import instance from "@/configs/admin";
import { Link } from "react-router-dom";

const categoriesMap = new Map<string, string>([
  // Add your category mappings here
  ["1", "Category 1"],
  ["2", "Category 2"],
  // Add more mappings as needed
]);

const CategoriesRemote: React.FC = () => {
  const queryClient = useQueryClient(); 
  // const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["danhmuc-remote"],
    queryFn: async () => {
      try {
        const response = await instance.get("/danhmuc/thung-rac");
        return response.data;
      } catch (error) {
        console.error("Error fetching remote categories:", error);
        throw new Error("Error fetching remote categories");
      }
    },
  });

  const handleRestore = async (id: string) => {
    try {
      await instance.post(`/danhmuc/thung-rac/${id}`);
      message.open({
        type: "success",
        content: "Khôi phục danh mục thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["danhmuc-remote"] });
    } catch (error) {
      console.error("Error restoring category:", error);
      message.open({
        type: "error",
        content: "Khôi phục danh mục thất bại",
      });
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
      key: "ten_danh_muc",
      dataIndex: "ten_danh_muc",
    },
    {
      title: "Ảnh danh mục",
      key: "anh_danh_muc",
      dataIndex: "anh_danh_muc",
      render: (anh_danh_muc: string) =>
        anh_danh_muc ? (
          <img
            src={anh_danh_muc}
            alt="Ảnh danh mục"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          <span>Ảnh không có</span>
        ),
    },
    {
      title: "Danh mục cha",
      key: "cha_id",
      dataIndex: "cha_id",
      sorter: (a: any, b: any) => a.cha_id.localeCompare(b.cha_id),
      render: (text: string) => categoriesMap.get(text) || "________",
    },
    // {
    //   title: "Thời gian xóa",
    //   key: "delete_at",
    //   dataIndex: "delete_at",
    // },
    {
      title: "Quản trị",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Button
            className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold"
            onClick={() => handleRestore(record.id)}
          >
            Khôi phục
          </Button>
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
          <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
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

export default CategoriesRemote;
