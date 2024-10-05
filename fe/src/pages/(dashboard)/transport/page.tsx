import React, { useState } from "react";
import { Card, Col, Row, Select, Checkbox, Typography } from "antd";
import { CaretDownOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Title, Text } = Typography;

const PageTransport = () => {
  const [autoUpdate, setAutoUpdate] = useState(false);
  const navigate = useNavigate(); // Sử dụng useNavigate để chuyển trang

  // Hàm xử lý sự kiện chọn ngày
  const handleDateChange = (value: any) => {
    console.log("Selected Date:", value);
  };

  // Hàm xử lý sự kiện thay đổi cập nhật liên tục
  const handleAutoUpdateChange = (e: any) => {
    setAutoUpdate(e.target.checked);
  };

  // Hàm điều hướng trang khi click vào card
  const handleCardClick = (route: any) => {
    navigate(route); // Chuyển hướng tới route được truyền vào
  };

  const renderCard = (
    title: any,
    number: any,
    amount: any,
    color = "black",
    highlight = false,
    route = "/"
  ) => (
    <Card
      bordered={false}
      style={{
        backgroundColor: highlight ? "#fff5f5" : "#f5f5f5",
        cursor: "pointer",
      }} // Thêm hiệu ứng pointer để dễ nhận biết là có thể click
      onClick={() => handleCardClick(route)} // Thêm sự kiện onClick để chuyển trang
    >
      <Title level={5}>{title}</Title>
      <Text style={{ fontSize: 24, color }}>{number}</Text>
      <br />
      <Text>{amount} ₫</Text>
    </Card>
  );

  return (
    <div style={{ padding: 20 }}>
      {/* Header với dropdown chọn ngày và checkbox cập nhật liên tục */}
      <Row justify="space-between" align="middle">
        <Col>
          <Select
            defaultValue="Hôm nay"
            style={{ width: 150 }}
            onChange={handleDateChange}
            suffixIcon={<CaretDownOutlined />}
          >
            <Option value="homnay">Hôm nay</Option>
            <Option value="homqua">Hôm qua</Option>
            <Option value="tuantruoc">Tuần trước</Option>
          </Select>
        </Col>
      </Row>

      <div>
        <div style={{ marginTop: 20 }}>
          {/* Đơn hàng */}
          <div className="bg-white  px-7 py-7 rounded-lg my-5">
            <div className="flex items-center ">
              <h1 className=" font-semibold md:text-2xl">
                <i className="fa-regular fa-cart-shopping text-[#63E6BE] mr-3"></i>
                Đơn hàng{" "}
              </h1>
            </div>
            <div className="grid grid-cols-3 gap-10">
              <div className="col-span-1 border p-3 text-center rounded-lg">
                <h3 className="text-lg font-semibold text-slate-700">
                  Đơn chưa xác nhận
                </h3>
                <span className="text-2xl font-semibold py-1 text-blue-600">
                  0
                </span>
                <br />
                <span className="text-xl text-slate-600"> 0 đ</span>
              </div>
              <div className="col-span-1 border p-3 text-center rounded-lg">
                <h3 className="text-lg font-semibold text-slate-700">
                  Chờ thanh toán
                </h3>
                <span className="text-2xl font-semibold py-1 text-blue-600">
                  1
                </span>
                <br />
                <span className="text-xl text-slate-600"> 10,023,000 đ</span>
              </div>
              <div className="col-span-1 border p-3 text-center rounded-lg">
                <h3 className="text-lg font-semibold text-slate-700">
                  Chưa giao hàng
                </h3>
                <span className="text-2xl font-semibold py-1 text-blue-600">
                  2
                </span>
                <br />
                <span className="text-xl text-slate-600"> 1,420,023đ</span>
              </div>
            </div>
          </div>

          {/* Giao hàng */}
          <div className="bg-white  px-7 py-7 rounded-lg my-5">
            <div className="flex items-center ">
              <h1 className=" font-semibold md:text-2xl">
                <i
                  className="fa-regular fa-truck mr-3"
                  style={{ color: "#ffae00" }}
                ></i>
                Giao hàng
              </h1>
            </div>
            <div className="grid grid-cols-3 gap-10">
              <div className="col-span-1 border p-3 text-center rounded-lg">
                <h3 className="text-lg font-semibold text-slate-700">
                  Chờ lấy hàng
                </h3>
                <span className="text-2xl font-semibold py-1 text-blue-600">
                  0
                </span>
                <br />
                <span className="text-xl text-slate-600"> 0 đ</span>
              </div>
              <div className="col-span-1 border p-3 text-center rounded-lg">
                <h3 className="text-lg font-semibold text-slate-700">
                  Đang giao hàng
                </h3>
                <span className="text-2xl font-semibold py-1 text-blue-600">
                  1
                </span>
                <br />
                <span className="text-xl text-slate-600"> 10,023,000 đ</span>
              </div>
              <div className="col-span-1 border p-3 text-center rounded-lg">
                <h3 className="text-lg font-semibold text-slate-700">
                  Giao hàng thất bại
                </h3>
                <span className="text-2xl font-semibold py-1 text-red-600">
                  2
                </span>
                <br />
                <span className="text-xl text-slate-600"> 1,420,023đ</span>
              </div>
            </div>
          </div>

          {/* Hoàn hàng */}
          <div className="bg-white  px-7 py-7 rounded-lg my-5 ">
            <div className="flex items-center ">
              <h1 className=" font-semibold md:text-2xl">
                <i className="fa-regular fa-cart-shopping text-[#63E6BE] mr-3"></i>
                Đơn hàng{" "}
              </h1>
            </div>
            <div className="grid grid-cols-3 gap-10">
              <div className="col-span-1 border p-3 text-center rounded-lg">
                <h3 className="text-lg font-semibold text-slate-700">
                  Đơn chưa xác nhận
                </h3>
                <span className="text-2xl font-semibold py-1 text-blue-600">
                  0
                </span>
                <br />
                <span className="text-xl text-slate-600"> 0 đ</span>
              </div>
              <div className="col-span-1 border p-3 text-center rounded-lg">
                <h3 className="text-lg font-semibold text-slate-700">
                  Chờ thanh toán
                </h3>
                <span className="text-2xl font-semibold py-1 text-blue-600">
                  1
                </span>
                <br />
                <span className="text-xl text-slate-600"> 10,023,000 đ</span>
              </div>
              <div className="col-span-1 border p-3 text-center rounded-lg">
                <h3 className="text-lg font-semibold text-slate-700">
                  Chưa giao hàng
                </h3>
                <span className="text-2xl font-semibold py-1 text-blue-600">
                  2
                </span>
                <br />
                <span className="text-xl text-slate-600"> 1,420,023đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTransport;
