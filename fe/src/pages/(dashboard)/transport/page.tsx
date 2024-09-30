import React, { useState } from 'react';
import { Card, Col, Row, Select, Checkbox, Typography } from 'antd';
import { CaretDownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Title, Text } = Typography;

const PageTransport = () => {
    const [autoUpdate, setAutoUpdate] = useState(false);
    const navigate = useNavigate(); // Sử dụng useNavigate để chuyển trang

    // Hàm xử lý sự kiện chọn ngày
    const handleDateChange = (value: any) => {
        console.log('Selected Date:', value);
    };

    // Hàm xử lý sự kiện thay đổi cập nhật liên tục
    const handleAutoUpdateChange = (e: any) => {
        setAutoUpdate(e.target.checked);
    };

    // Hàm điều hướng trang khi click vào card
    const handleCardClick = (route: any) => {
        navigate(route); // Chuyển hướng tới route được truyền vào
    };

    const renderCard = (title: any, number: any, amount: any, color = 'black', highlight = false, route = '/') => (
        <Card
            bordered={false}
            style={{ backgroundColor: highlight ? '#fff5f5' : '#f5f5f5', cursor: 'pointer' }} // Thêm hiệu ứng pointer để dễ nhận biết là có thể click
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
                <Col>
                    <Checkbox onChange={handleAutoUpdateChange}>
                        Cập nhật liên tục <InfoCircleOutlined />
                    </Checkbox>
                </Col>
            </Row>

            {/* Phần nội dung chính */}
            <div style={{ marginTop: 20 }}>
                {/* Đơn hàng */}
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Title level={4}>Đơn hàng</Title>
                    </Col>
                    <Col span={8}>
                        {renderCard('Đơn chưa xác thực', '0', '0', 'black', false, '/admin/transport/uncomfirmedorder')}
                    </Col>
                    <Col span={8}>
                        {renderCard('Chờ thanh toán', '1', '1,300,000', 'black', false, '/cho-thanh-toan')}
                    </Col>
                    <Col span={8}>
                        {renderCard('Chưa giao hàng', '2', '1,526,000', 'black', false, '/chua-giao-hang')}
                    </Col>
                </Row>

                {/* Giao hàng */}
                <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                    <Col span={24}>
                        <Title level={4}>Giao hàng</Title>
                    </Col>
                    <Col span={8}>
                        {renderCard('Chờ lấy hàng', '0', '0', 'black', false, '/cho-lay-hang')}
                    </Col>
                    <Col span={8}>
                        {renderCard('Đang giao hàng', '0', '0', 'black', false, '/dang-giao-hang')}
                    </Col>
                    <Col span={8}>
                        {renderCard('Không gặp khách', '0 đơn', '0', 'red', true, '/khong-gap-khach')}
                    </Col>
                </Row>

                {/* Hoàn hàng */}
                <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                    <Col span={24}>
                        <Title level={4}>Hoàn hàng</Title>
                    </Col>
                    <Col span={8}>
                        {renderCard('Chờ chuyển hoàn', '0', '0', 'black', false, '/cho-chuyen-hoan')}
                    </Col>
                    <Col span={8}>
                        {renderCard('Đã chuyển hoàn, chưa nhập kho', '0', '0', 'black', false, '/da-chuyen-hoan')}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default PageTransport;
