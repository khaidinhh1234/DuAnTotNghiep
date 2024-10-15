import { Avatar, Button, Card, Row, Col, Typography } from "antd";
import {
  FacebookFilled,
  YoutubeFilled,
  TwitterCircleFilled,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useLocalStorage } from "@/components/hook/useStoratge";
// import profilecover from 'src/assets/images/backgrounds/profilebg.jpg';
// import userimg from 'src/assets/images/profile/user-1.jpg';
// import ProfileTab from './ProfileTab';

const { Text, Title } = Typography;

const Banner = () => {
  const [{ user }] = useLocalStorage("user" as any, {});
  // console.log(user);
  const url = user.anh_nguoi_dung;
  const vaitro = user.vai_tros.map((item: any) => item.ten_vai_tro);
  // console.log(vaitro);
  return (
    <>
      <Card
        cover={
          <img
            src="https://res.cloudinary.com/dpypwbeis/image/upload/v1728621916/1000_F_620906721_ReTaV6nVI1CXbmb5pG0uMjz7TmrYXo3z_fm1usn.jpg"
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
                <FileTextOutlined
                  style={{ fontSize: "24px", color: "#50b2fc" }}
                />
                <Title level={4} className="m-0">
                  938
                </Title>
                <Text type="secondary">Bài viết</Text>
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
            <div className="-mt-20 flex flex-col items-center">
              <Avatar
                src={url}
                size={110}
                className="border-4 border-white shadow-lg"
              />

              <div className="mt-3 text-center">
                <Title level={5} className="m-0">
                  {user?.ho + " " + user?.ten}
                </Title>
                {vaitro?.map((item: any) => (
                  <Text type="secondary">
                    {item.length > 1 ? item : item + ","}
                  </Text>
                ))}
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
            </div>
          </Col>
        </Row>
        {/* Tabbing Section */}
        {/* <ProfileTab /> */}
      </Card>
    </>
  );
};

export default Banner;
