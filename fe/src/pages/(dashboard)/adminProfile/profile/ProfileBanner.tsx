import { Avatar, Button, Card, Row, Col, Typography } from 'antd';
import {
  FacebookFilled,
  YoutubeFilled,
  TwitterCircleFilled,
  UserOutlined,
  CameraOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useState } from 'react';
// import profilecover from 'src/assets/images/backgrounds/profilebg.jpg';
// import userimg from 'src/assets/images/profile/user-1.jpg';
// import ProfileTab from './ProfileTab';
import { Upload } from 'antd';

const { Text, Title } = Typography;

const ProfileBanner = () => {
  const [avatarImage, setAvatarImage] = useState<string>('');

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
          <img src="http://localhost:5174/src/assets/images/backgrounds/profilebg.jpg" alt="Profile Cover" className="w-full h-48 object-cover" />
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
                <UserOutlined style={{ fontSize: '24px', color: '#50b2fc' }} />
                <Title level={4} className="m-0">
                  938
                </Title>
                <Text type="secondary">Posts</Text>
              </div>
              <div>
                <UserOutlined style={{ fontSize: '24px', color: '#50b2fc' }} />
                <Title level={4} className="m-0">
                  3,586
                </Title>
                <Text type="secondary">Followers</Text>
              </div>
              <div>
                <UserOutlined style={{ fontSize: '24px', color: '#50b2fc' }} />
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
              src={avatarImage}
              size={100}
              className="border-4 border-white"
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
            <Title level={5} className="flex items-center justify-center">
              Ngô Quốc Toản
              <CheckCircleOutlined className="ml-2 text-blue-500" />
            </Title>
            <Text type="secondary" className="text-gray-500">
              0983827425
            </Text>
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
                style={{ backgroundColor: '#1877F2' }}
              />
              <Button
                shape="circle"
                icon={<TwitterCircleFilled className="text-white" />}
                style={{ backgroundColor: '#1DA1F2' }}
              />
              <Button
                shape="circle"
                icon={<YoutubeFilled className="text-white" />}
                style={{ backgroundColor: '#CD201F' }}
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
