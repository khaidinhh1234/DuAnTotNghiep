import instance from "@/configs/admin";
import {
  DesktopOutlined,
  EnvironmentOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Row, Typography } from "antd";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocalStorage } from "@/components/hook/useStoratge";
// import { faBriefcase, faUser } from "@fortawesome/free-regular-svg-icons"; // Import icons/

const { Title, Text } = Typography;

const IntroCard = ({ profile }: any) => {
  const thongtin = profile?.tai_khoan;

  // Xử lý khi đang loading
  // if (isLoading) {
  //   return <p>Loading...</p>;
  // }

  // Xử lý khi gặp lỗi
  // if (isError) {
  //   return <p>Error loading data</p>;
  // }

  // Nếu không có dữ liệu, trả về thông báo
  // if (!data?.data) {
  //   return <p>No data available</p>;
  // }

  // const { email, so_dien_thoai, dia_chi, ngay_sinh, gioi_tinh } = data.data;
  // console.log(thongtin);
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
          <Text className="text-lg">
            Email: {thongtin?.email ?? "không có thông tin"}
          </Text>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-3">
        <Col span={2}>
          <DesktopOutlined style={{ fontSize: "21px" }} />
        </Col>
        <Col span={22}>
          <Text className="text-lg">
            Số điện thoại:{thongtin?.so_dien_thoai ?? "không có thông tin"}
          </Text>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-3">
        <Col span={2}>
          <EnvironmentOutlined style={{ fontSize: "21px" }} />
        </Col>
        <Col span={22}>
          <Text className="text-lg">
            Địa chỉ: {thongtin?.dia_chi ?? "không có thông tin"}
          </Text>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mb-3">
        <Col span={2}>
          {/* <FontAwesomeIcon icon={faBriefcase} style={{ fontSize: "21px" }} /> */}
        </Col>
        <Col span={22}>
          <Text className="text-lg">
            Ngày sinh: {thongtin?.ngay_sinh ?? "không có thông tin"}
          </Text>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={2}>
          {/* <FontAwesomeIcon icon={faUser} style={{ fontSize: "21px" }} /> */}
        </Col>
        <Col span={22}>
          <Text className="text-lg">
            Giới tính:{" "}
            {thongtin?.gioi_tinh == 1
              ? "Nam"
              : thongtin?.gioi_tinh == 2
                ? "Nữ"
                : "Khác"}
          </Text>
        </Col>
      </Row>
    </Card>
  );
};

export default IntroCard;
