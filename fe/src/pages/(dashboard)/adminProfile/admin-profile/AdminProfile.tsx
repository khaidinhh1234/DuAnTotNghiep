import { PageContainer } from "@ant-design/pro-layout"; // or 'antd'
import { Col, Row } from "antd";
import ChangePasswordAdmin from "../profile/ChangePassword";
import IntroCard from "../profile/IntroCard";
import ProfileBanner from "../profile/ProfileBanner";
import { useLocalStorage } from "@/components/hook/useStoratge";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/admin";
import { useEffect, useState } from "react";
import Profile from "../profile/profile";

const AdminProfile = () => {
  // const [pass, setpass] = useState(false);
  const [user] = useLocalStorage("user" as any, {});
  const id = user?.user?.id;
  console.log(id);
  // const { id } = useParams();
  // console.log(id);

  const { data, refetch } = useQuery({
    queryKey: ["taikhoanid", id],
    queryFn: async () => {
      try {
        const res = await instance.get(`/taikhoan/${id}`);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
  });
  console.log(data);
  const profile = data?.data;

  return (
    <PageContainer>
      <div className="">
        <Row gutter={[16, 16]} className="space-y-3">
          <Col span={24} className="w-full">
            <ProfileBanner profile={profile} refetch={refetch} />
          </Col>

          {/* Thẻ giới thiệu và Thẻ ảnh */}
          <Col xs={24} lg={8} className="space-y-3">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <IntroCard profile={profile} />
              </Col>
              <Col span={24}>{/* <PhotosCard /> */}</Col>
            </Row>
          </Col>

          <Col xs={24} lg={16}>
            {/* <Post /> */}
            <ChangePasswordAdmin />
            {/* {pass && <Profile profile={profile} />} */}
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default AdminProfile;
