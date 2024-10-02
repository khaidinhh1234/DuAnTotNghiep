import React from "react";
import { Table, Button, Space, message, Spin } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { Link, useParams } from "react-router-dom";

const Remotecolor: React.FC = () => {
  const queryClient = useQueryClient(); // Sử dụng queryClient để invalidate queries
  const { id } = useParams();

  // Fetch danh mục đã xóa
  const { data, isLoading, isError } = useQuery({
    queryKey: ["color"],
    queryFn: async () => {
      try {
        const response = await instance.get("/admin/bienthemausac/thung-rac");
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
      await instance.post(`/admin/bienthemausac/thung-rac/${id}`);
      message.success("Khôi phục danh mục thành công");
      // Refresh lại dữ liệu sau khi khôi phục
      queryClient.invalidateQueries({ queryKey: ["color"] });
    } catch (error) {
      console.error("Error restoring category:", error);
      message.error("Khôi phục danh mục thất bại");
    }
  };

  const columns = [
    {
      title: "STT",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Tên màu",
      key: "ten_mau_sac",
      dataIndex: "ten_mau_sac",
    },
    {
      title: "Mã màu",
      dataIndex: "ma_mau_sac",
      key: "ma_mau_sac",
      render: (text: string) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: text,
              marginRight: "8px",
              border: "1px solid #d9d9d9",
              borderRadius: "2px",
            }}
          />
          {text}
        </div>
      ),
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
          Quản trị / Sản phẩm /{" "}
          <span className="font-semibold px-px">Biến thể màu sắc</span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Biến thể màu sắc</h1>
        <Link to="/admin/products/bienthe">
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

export default Remotecolor;
