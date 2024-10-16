import { PageContainer } from "@ant-design/pro-layout"; // or 'antd'
import { Col, Row } from "antd";
import ChangePassword from "../profile/ChangePassword";
import IntroCard from "../profile/IntroCard";
import ProfileBanner from "../profile/ProfileBanner";

const AdminProfile = () => {
  return (
    <PageContainer>
      <div className="">
        <Row gutter={[16, 16]} className="space-y-3">
          <Col span={24} className="w-full">
            <ProfileBanner />
          </Col>

          {/* Thẻ giới thiệu và Thẻ ảnh */}
          <Col xs={24} lg={8} className="space-y-3">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <IntroCard />
              </Col>
              <Col span={24}>
                {/* <PhotosCard /> */}
              </Col>
            </Row>
          </Col>

          {/* Thẻ bài viết */}
          <Col xs={24} lg={16}>
            {/* <Post /> */}
            <ChangePassword/>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default AdminProfile;
