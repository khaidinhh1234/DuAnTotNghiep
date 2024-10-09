import { Card, Col, Row, Typography } from "antd";

const topcards = [
  { title: "Employees", digits: "96", bgcolor: "#000000" },
  { title: "Clients", digits: "3,650", bgcolor: "#dc281e" },
  { title: "Projects", digits: "356", bgcolor: "#dc281e" },
  { title: "Events", digits: "696", bgcolor: "#6dd5ed" },
  // { title: "Payroll", digits: "$96k", bgcolor: "success" },
  // { title: "Reports", digits: "59", bgcolor: "info" },
];

const Chart6 = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={4}>
        <Card className={`bg-[#ECF2FF] text-center`}>
          {/* <i className="fa-solid fa-user" style={{ color: "#FFD43B" }} /> */}

          <img
            src={
              "https://res.cloudinary.com/dpypwbeis/image/upload/v1728369411/icon-user-male_n0cyt5.svg"
            }
            alt={""}
            width="50"
            className="mx-auto"
          />
          <Typography.Title level={5}>sdfdsf</Typography.Title>
          <Typography.Title level={3}>sdf</Typography.Title>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={4}>
        <Card className={`bg-[#FEF5E5] text-center`}>
          <img
            src={
              "https://res.cloudinary.com/dpypwbeis/image/upload/v1728369411/icon-user-male_n0cyt5.svg"
            }
            alt={""}
            width="50"
            className="mx-auto"
          />
          <Typography.Title level={5}>sdfdsf</Typography.Title>
          <Typography.Title level={3}>sdf</Typography.Title>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={4}>
        <Card className={`bg-[#6dd5ed] text-center`}>
          <img
            src={
              "https://res.cloudinary.com/dpypwbeis/image/upload/v1728369411/icon-user-male_n0cyt5.svg"
            }
            alt={""}
            width="50"
            className="mx-auto"
          />
          <Typography.Title level={5}>sdfdsf</Typography.Title>
          <Typography.Title level={3}>sdf</Typography.Title>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={4}>
        <Card className={`bg-[#def6fc] text-center`}>
          <img
            src={
              "https://res.cloudinary.com/dpypwbeis/image/upload/v1728369411/icon-briefcase_ulhtgt.svg"
            }
            alt={""}
            width="50"
            className="mx-auto"
          />
          <Typography.Title level={5}>sdfdsf</Typography.Title>
          <Typography.Title level={3}>sdf</Typography.Title>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={4}>
        <Card className={`bg-[#cbf0f8] text-center`}>
          <img
            src={
              "https://res.cloudinary.com/dpypwbeis/image/upload/v1728369411/icon-speech-bubble_raifev.svg"
            }
            alt={""}
            width="50"
            className="mx-auto"
          />
          <Typography.Title level={5}>sdfdsf</Typography.Title>
          <Typography.Title level={3}>sdf</Typography.Title>
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={4}>
        <Card className={`bg-[#6dd5ed] text-center`}>
          <img
            src={
              "https://res.cloudinary.com/dpypwbeis/image/upload/v1728369411/icon-favorites_pupquo.svg"
            }
            alt={""}
            width="50"
            className="mx-auto"
          />
          <Typography.Title level={5}>sdfdsf</Typography.Title>
          <Typography.Title level={3}>sdf</Typography.Title>
        </Card>
      </Col>
    </Row>
  );
};

export default Chart6;
