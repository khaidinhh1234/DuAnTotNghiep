import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Spin, Typography, Button, Card, Divider } from "antd";
import instance from "@/configs/admin";

const { Title, Text } = Typography;

const ViewNew: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["news", id],
    queryFn: async () => {
      const response = await instance.get(`/tintuc/${id}`);
      return response.data;
    },
    enabled: !!id, // Chỉ gọi API khi có id
  });

  if (isLoading)
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <Spin size="large" />
      </div>
    );
  if (isError)
    return (
      <Text type="danger" style={{ textAlign: "center" }}>
        Lỗi khi lấy thông tin bài viết.
      </Text>
    );

  const { tieu_de, user, danh_muc_tin_tuc, noi_dung, created_at } = data.data;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold px-px">Tin tức</span>
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Chi tiết: {data?.data.tieu_de}</h1>
        <Link to="/admin/news">
          <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
            Quay lại
          </Button>
        </Link>
      </div>
      <div style={{ padding: 14, minHeight: 360 }}>
        {/* <div className="bg-white px-4 rounded-xl py-5 shadow-lg max-w-7xl"> */}
          <Title className="font-bold" level={2} style={{ color: "#1890ff" }}>
            {tieu_de}
          </Title>
          <Text strong style={{ color: "#555" }}>
            Tác giả: {user?.ten || "Chưa có dữ liệu"}
          </Text>
          <br />
          <Text style={{ color: "#555" }}>
            Danh mục:{" "}
            {danh_muc_tin_tuc?.ten_danh_muc_tin_tuc || "Chưa có dữ liệu"}
          </Text>
          <br />
          <Text style={{ color: "#555" }}>
            Ngày tạo: {new Date(created_at).toLocaleDateString()}
          </Text>
          <Divider />
          <Text strong style={{ fontSize: "16px" }}>
            Nội dung:
          </Text>
          <div
            className="mt-2"
            style={{
              border: "1px solid #eaeaea",
              padding: "16px",
              borderRadius: "4px",
              backgroundColor: "#fafafa",
            }}
            dangerouslySetInnerHTML={{ __html: noi_dung }}
          />
          <Divider />
        {/* </div> */}
      </div>
    </main>
  );
};

export default ViewNew;
