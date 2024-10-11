import { PageContainer } from '@ant-design/pro-layout'; // or 'antd'
import { Row, Col } from 'antd';
import ProfileBanner from '../profile/ProfileBanner';
import IntroCard from '../profile/IntroCard';
import PhotosCard from '../profile/PhotosCard';
import Post from '../profile/Post';

const AdminProfile = () => {
  return (
    <PageContainer >
      <div className="container mx-auto p-4">
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
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default AdminProfile;