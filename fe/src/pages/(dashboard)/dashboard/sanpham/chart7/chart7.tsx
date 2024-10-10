// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from "react";
import Chart from "react-apexcharts";
import { Row, Col, Typography, Button, Avatar, Select, Card } from "antd";

const { Option } = Select;

const Chart6 = () => {
  const [month, setMonth] = React.useState("1");

  const handleChange = (value: string) => {
    setMonth(value);
  };

  // màu sắc biểu đồ
  const primary = "#1890ff"; // Màu chính của Ant Design
  const secondary = "#52c41a"; // Màu phụ của Ant Design

  // biểu đồ
  const optionscolumnchart = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: true,
      },
      height: 370,
      stacked: true,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "20%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      min: -5,
      max: 5,
      tickAmount: 4,
    },
    xaxis: {
      categories: [
        "16/08",
        "17/08",
        "18/08",
        "19/08",
        "20/08",
        "21/08",
        "22/08",
      ],
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: "light",
      fillSeriesColor: false,
    },
  };

  const seriescolumnchart = [
    {
      name: "Thu nhập tháng này",
      data: [1.5, 2.7, 2.2, 3.6, 1.5, 1.0],
    },
    {
      name: "Chi phí tháng này",
      data: [-1.8, -1.1, -2.5, -1.5, -0.6, -1.8],
    },
  ];

  return (
    <Card
      className="max-w-5xl"
      title="Cập nhật doanh thu"
      extra={
        <Select value={month} onChange={handleChange} size="small">
          <Option value="1">Tháng 3 năm 2023</Option>
          <Option value="2">Tháng 4 năm 2023</Option>
          <Option value="3">Tháng 5 năm 2023</Option>
        </Select>
      }
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={16}>
          <Chart
            options={optionscolumnchart as any}
            series={seriescolumnchart}
            type="bar"
            height="370px"
          />
        </Col>

        <Col xs={24} sm={8}>
          <Row align="middle" gutter={[16, 16]}>
            <Col>
              <Avatar size={40} style={{ backgroundColor: primary }}>
                {/* <IconGridDots /> */}
              </Avatar>
            </Col>
            <Col>
              <Typography.Title level={3}>$63,489.50</Typography.Title>
              <Typography.Text type="secondary">Tổng thu nhập</Typography.Text>
            </Col>
          </Row>

          <div style={{ margin: "20px 0" }}>
            <Row gutter={16}>
              <Col>
                <Avatar size={9} style={{ backgroundColor: primary }} />
              </Col>
              <Col>
                <Typography.Text type="secondary">
                  Thu nhập tháng này
                </Typography.Text>
                <Typography.Title level={5}>$48,820</Typography.Title>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col>
                <Avatar size={9} style={{ backgroundColor: secondary }} />
              </Col>
              <Col>
                <Typography.Text type="secondary">
                  Chi phí tháng này
                </Typography.Text>
                <Typography.Title level={5}>$26,498</Typography.Title>
              </Col>
            </Row>
          </div>

          <Button type="primary" block>
            Xem báo cáo đầy đủ
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default Chart6;
