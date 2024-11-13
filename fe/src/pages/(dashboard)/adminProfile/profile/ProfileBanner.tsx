import {
  CameraOutlined,
  FacebookFilled,
  TwitterCircleFilled,
  UserOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import { Avatar, Button, Card, Col, Row, Typography } from "antd";
import { useState } from "react";
// import ProfileTab from './ProfileTab';
import { banner } from "@/assets/img";
import { useLocalStorage } from "@/components/hook/useStoratge";
import { Upload } from "antd";

const { Text, Title } = Typography;

const ProfileBanner = () => {
  const [avatarImage, setAvatarImage] = useState<string>("");
  const [{ user }] = useLocalStorage("user" as any, {});
  const url = user.anh_nguoi_dung;
  const vaitro = user.vai_tros.map((item: any) => item.ten_vai_tro);
  const handleAvatarChange = (info: any) => {
    if (info.file && info.file.originFileObj) {
      const file = URL.createObjectURL(info.file.originFileObj);
      setAvatarImage(file);
    }
  };
  return (
    <>
      <Card
        cover={
          <img
            src={banner}
            alt="Profile Cover"
            className="w-full h-48 object-cover"
          />
        }
        className="p-4 bg-white shadow-md"
      >
        <Row gutter={[16, 16]} justify="center">
          {/* Posts | Followers | Following */}
          <Col
            xs={24}
            sm={24}
            lg={8}
            className="flex justify-center order-2 lg:order-1"
          >
            <div className="flex justify-between w-full max-w-xs space-x-6 text-center">
              <div>
                <UserOutlined style={{ fontSize: "24px", color: "#50b2fc" }} />
                <Title level={4} className="m-0">
                  938
                </Title>
                <Text type="secondary">Posts</Text>
              </div>
              <div>
                <UserOutlined style={{ fontSize: "24px", color: "#50b2fc" }} />
                <Title level={4} className="m-0">
                  3,586
                </Title>
                <Text type="secondary">Followers</Text>
              </div>
              <div>
                <UserOutlined style={{ fontSize: "24px", color: "#50b2fc" }} />
                <Title level={4} className="m-0">
                  2,659
                </Title>
                <Text type="secondary">Following</Text>
              </div>
            </div>
          </Col>
          {/* Profile Image and Info */}
          <Col
            xs={24}
            sm={24}
            lg={8}
            className="flex flex-col items-center order-1 lg:order-2"
          >
            <div className="flex justify-center mt-[-70px] relative">
              <div className="text-center">
                <div className="relative w-28 h-28 mx-auto rounded-full bg-gradient-to-r">
                  <Avatar
                    src={avatarImage || url}
                    size={110}
                    className="border-4 border-white shadow-lg"
                  />
                  <Upload
                    showUploadList={false}
                    onChange={handleAvatarChange}
                    className="absolute bottom-0 right-0 "
                  >
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<CameraOutlined />}
                      className="bg-blue-400 hover:bg-blue-500 text-white p-2"
                    />
                  </Upload>
                </div>

                <div className="mt-2">
                  <Title level={5} className="m-0">
                    {user?.ho + " " + user?.ten}
                  </Title>
                  {/* <Title level={5} className="m-0">
                  {user?.so_dien_thoai}
                </Title> */}
                  {vaitro?.map((item: any) => (
                    <Text type="secondary">
                      {item.length > 1 ? item : item + ","}
                    </Text>
                  ))}
                </div>
              </div>
            </div>
          </Col>
          {/* Social Buttons and Story Button */}
          <Col
            xs={24}
            sm={24}
            lg={8}
            className="flex justify-center order-3 lg:order-3"
          >
            <div className="flex items-center space-x-4">
              <Button
                shape="circle"
                icon={<FacebookFilled className="text-white" />}
                style={{ backgroundColor: "#1877F2" }}
              />
              <Button
                shape="circle"
                icon={<TwitterCircleFilled className="text-white" />}
                style={{ backgroundColor: "#1DA1F2" }}
              />
              <Button
                shape="circle"
                icon={<YoutubeFilled className="text-white" />}
                style={{ backgroundColor: "#CD201F" }}
              />
              <Button type="primary">Add To Story</Button>
            </div>
          </Col>
        </Row>
        {/* Tabbing Section */}
        {/* <ProfileTab /> */}
      </Card>
    </>
  );
};

export default ProfileBanner;
