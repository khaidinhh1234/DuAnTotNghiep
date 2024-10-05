import React from "react";
import { Table, Button, Space, message, Spin } from "antd";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Link, useParams } from "react-router-dom";
import instance from "@/configs/admin";

const Remotecolor: React.FC = () => {
  const queryClient = useQueryClient(); // Sử dụng queryClient để invalidate queries
  const { id } = useParams();


  const { data, isLoading, isError } = useQuery({
    queryKey: ["color"],
    queryFn: async () => {
      try {
        const response = await instance.get("/bienthemausac/thung-rac");
        return response.data;
      } catch (error) {
        console.error("Error fetching remote :", error);
        throw new Error("Error fetching remote ");
      }
    },
  });

  
  const handleRestore = async (id: string) => {
    try {
      await instance.post(`/bienthemausac/thung-rac/${id}`);
      message.success("Khôi phục màu sản phẩm thành công");
      // Refresh lại dữ liệu sau khi khôi phục
      queryClient.invalidateQueries({ queryKey: ["color"] });
    } catch (error) {
      console.error("Error restoring category:", error);
      message.error("Khôi phục màu sản phẩm thất bại");
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
          <Button
            className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold"
            onClick={() => handleRestore(record.id)}
          >
            Khôi phục
          </Button>
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
        <h1 className="font-semibold md:text-3xl">Thùng rác</h1>
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
          pagination={{ pageSize: 10, className: "my-5" }}
          loading={isLoading}
        />
      </div>
    </main>
  );
};

export default Remotecolor;
