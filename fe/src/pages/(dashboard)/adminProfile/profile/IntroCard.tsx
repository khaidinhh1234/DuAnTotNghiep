
import instance from "@/configs/admin";
import {
  DesktopOutlined,
  EnvironmentOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Row, Typography } from "antd";
import { useParams } from "react-router-dom";

const { Title, Text } = Typography;

interface IntroData {
  email: string;
  so_dien_thoai: string;
  dia_chi: string;
  ngay_sinh: string;
  gioi_tinh: string;
}

const IntroCard = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["taikhoanid", id],
    queryFn: async () => {
      try {
        const res = await instance.get(`/taikhoan/${id}`);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
  });
console.log(data)
  // Xử lý khi đang loading
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // Xử lý khi gặp lỗi
  // if (error) {
  //   return <p>Error loading data</p>;
  // }

  // Nếu không có dữ liệu, trả về thông báo
  if (!data?.data) {
    return <p>No data available</p>;
  }

  // Truy xuất thông tin từ dữ liệu API
  const { email, so_dien_thoai, dia_chi, ngay_sinh, gioi_tinh } = data.data;

  return (
    <Card className="p-4 shadow-md">
      <Title level={4} className="mb-4 font-semibold">
        Thông tin cá nhân
      </Title>

      <Row gutter={[16, 16]} className="mb-3">
        <Col span={2}>
          <MailOutlined style={{ fontSize: "21px" }} />
        </Col>
        <Col span={22}>
          <Text className="text-lg">Email: {email}</Text>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-3">
        <Col span={2}>
          <DesktopOutlined style={{ fontSize: "21px" }} />
        </Col>
        <Col span={22}>
          <Text className="text-lg">Số điện thoại: {so_dien_thoai}</Text>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-3">
        <Col span={2}>
          <EnvironmentOutlined style={{ fontSize: "21px" }} />
        </Col>
        <Col span={22}>
          <Text className="text-lg">Địa chỉ: {dia_chi}</Text>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-3">
        <Col span={2}>
          <i className="fa-regular fa-briefcase"></i>
        </Col>
        <Col span={22}>
          <Text className="text-lg">Ngày sinh: {ngay_sinh}</Text>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={2}>
          <i className="fa-regular fa-user"></i>
        </Col>
        <Col span={22}>
          <Text className="text-lg">Giới tính: {gioi_tinh}</Text>
        </Col>
      </Row>
    </Card>
  );
};

export default IntroCard;
