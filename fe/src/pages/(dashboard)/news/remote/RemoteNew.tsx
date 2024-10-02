import { INew } from "@/common/types/new";
import instance from "@/configs/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Popconfirm, Space, Table, TableColumnsType } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RemoteNew: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch danh sách tin tức đã xóa
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tintuc-da-xoa"], // Đặt tên queryKey riêng biệt
    queryFn: async () => {
      try {
        const response = await instance.get("/admin/tintuc/thung-rac");
        console.log("Remote news data:", response.data); // Log phản hồi
        return response.data;
      } catch (error) {
        console.error("Error fetching remote news:", error);
        throw new Error("Error fetching remote news");
      }
    },
  });

  // Xử lý khôi phục danh mục
  const handleRestore = async (id: number) => {
    try {
      await instance.post(`/admin/tintuc/thung-rac/${id}`);
      toast.success("Khôi phục tin tức thành công");
      queryClient.invalidateQueries({ queryKey: ["tintuc-da-xoa"] }); // Invalidate query sau khi khôi phục
    } catch (error) {
      console.error("Error restoring news:", error);
      toast.error("Khôi phục tin tức thất bại");
    }
  };

  // Tính toán dataSource từ data
  const dataSource =
    data?.data.map((newsItem: any) => ({
      key: newsItem.id,
      ...newsItem,
      user_id: newsItem.user?.ten || "Chưa có dữ liệu", // Kiểm tra user
      danh_muc_tin_tuc_id:
        newsItem.danh_muc_tin_tuc_id?.ten_danh_muc_tin_tuc || "Chưa có dữ liệu", // Kiểm tra danh mục
    })) || [];
  console.log("toan", dataSource);
  const columns: TableColumnsType<INew> = [
    {
      title: "STT",
      width: "10%",
      key: "id",
      dataIndex: "key",
    },
    {
      title: "Tác giả",
      width: "10%",
      key: "user_id",
      dataIndex: "user_id",
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Danh mục tin tức",
      width: "10%",
      key: "danh_muc_tin_tuc_id",
      dataIndex: "danh_muc_tin_tuc_id",
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Tiêu đề",
      width: "15%",
      key: "tieu_de",
      dataIndex: "tieu_de",
      sorter: (a: any, b: any) => a.tieu_de.localeCompare(b.tieu_de),
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Thời gian tạo",
      width: "10%",
      key: "created_at",
      dataIndex: "created_at",
      render: (text) => (text ? new Date(text).toLocaleDateString() : ""),
    },
    {
      title: "Quản trị",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn có chắc chắn muốn khôi phục?"
            onConfirm={() => handleRestore(record.key)}
          >
            <Button type="primary">Khôi phục</Button>
          </Popconfirm>
          {/* <Button type="default" onClick={() => navigate(`/admin/news/details/${record.key}`)}>
            Chi tiết
          </Button> */}
        </Space>
      ),
    },
  ];

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (isError) return <p>Đã có lỗi xảy ra khi tải dữ liệu.</p>;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold px-px">Thùng rác</span>
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Danh mục đã xóa</h1>
        <Link to="/admin/news">
          <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
            Quay lại
          </Button>
        </Link>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        pagination={{ pageSize: 10, className: "my-5" }}
        loading={isLoading}
      />
    </main>
  );
};

export default RemoteNew;
