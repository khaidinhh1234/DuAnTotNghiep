import {
  DesktopOutlined,
  EnvironmentOutlined,
  //   BriefcaseOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Typography } from "antd";

const { Title, Text } = Typography;

const IntroCard = () => (
  <Card className="p-4 shadow-md">
    <Title level={4} className="mb-4 font-semibold">
      Introduction
    </Title>
    <Text className="block mb-4 text-gray-600">
      Hello, I am Julia Roberts. I love making websites and graphics. Lorem
      ipsum dolor sit amet, consectetur adipiscing elit.
    </Text>

    <Row gutter={[16, 16]} className="mb-3">
      <Col span={2}>
        {/* <BriefcaseOutlined style={{ fontSize: '21px' }} /> */}
        <i className="fa-regular fa-briefcase"></i>
      </Col>
      <Col span={22}>
        <Text className="text-lg">Sir, P P Institute Of Science</Text>
      </Col>
    </Row>

    <Row gutter={[16, 16]} className="mb-3">
      <Col span={2}>
        <MailOutlined style={{ fontSize: "21px" }} />
      </Col>
      <Col span={22}>
        <Text className="text-lg">xyzjonathan@gmail.com</Text>
      </Col>
    </Row>

    <Row gutter={[16, 16]} className="mb-3">
      <Col span={2}>
        <DesktopOutlined style={{ fontSize: "21px" }} />
      </Col>
      <Col span={22}>
        <Text className="text-lg">www.xyz.com</Text>
      </Col>
    </Row>

    <Row gutter={[16, 16]}>
      <Col span={2}>
        <EnvironmentOutlined style={{ fontSize: "21px" }} />
      </Col>
      <Col span={22}>
        <Text className="text-lg">New York, USA - 100001</Text>
      </Col>
    </Row>
  </Card>
);

export default IntroCard;
