import {
  CameraOutlined,
  CodepenOutlined,
  FacebookFilled,
  FormOutlined,
  HeartOutlined,
  TwitterCircleFilled,
  YoutubeFilled,
} from "@ant-design/icons";
import { Avatar, Button, Card, Col, message, Row, Typography } from "antd";
import { useEffect, useState } from "react";
// import ProfileTab from './ProfileTab';
import { banner } from "@/assets/img";
import { useLocalStorage } from "@/components/hook/useStoratge";
import { Upload } from "antd";
// import ProfileTab from './ProfileTab';
import instanceClient from "@/configs/client";
import { uploadToCloudinary } from "@/configs/cloudinary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
const { Text, Title } = Typography;

const ProfileBanner = ({ profile, refetch }: any) => {
  const [avatarImage, setAvatarImage] = useState<string>("");
  const [{ user }, setUser] = useLocalStorage("user" as any, {});
  const [tempImageUrl, setTempImageUrl] = useState<string>("");

  const url = user.anh_nguoi_dung;
  const vaitro = user.vai_tros.map((item: any) => item.ten_vai_tro);
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user") {
        const newUser = JSON.parse(event.newValue || "{}");
        setUser(newUser);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Dọn dẹp khi component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setUser]);

  // console.log(hang_thanh_vien);
  const updateAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const imageUrl = await uploadToCloudinary(file);
      await instanceClient.post("/cap-nhat-thong-tin", {
        anh_nguoi_dung: imageUrl,
      });
      return imageUrl;
    },
    onSuccess: (imageUrl) => {
      setUser((prev: any) => ({
        ...prev,
        user: {
          ...prev.user,
          anh_nguoi_dung: imageUrl,
        },
      }));
      setAvatarImage(imageUrl);
      setTempImageUrl("");
      refetch();
    },
    // onError: () => {
    //   setTempImageUrl("");
    //   toast.error("Không thể cập nhật ảnh đại diện");
    // },
  });

  const handleAvatarChange = async (info: any) => {
    if (info.file?.originFileObj) {
      setTempImageUrl(URL.createObjectURL(info.file.originFileObj));
      updateAvatarMutation.mutate(info.file.originFileObj);
    }
  };

  // console.log("Profile:", profile);
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
                <FormOutlined style={{ fontSize: "24px", color: "#50b2fc" }} />
                <Title level={4} className="m-0">
                  {profile?.so_luong_danh_gia?.toLocaleString() ?? 0}
                </Title>
                <Text type="secondary">Bài viết</Text>
              </div>
              <div>
                <CodepenOutlined
                  style={{ fontSize: "24px", color: "#50b2fc" }}
                />
                <Title level={4} className="m-0">
                  {profile?.so_luong_don_hang?.toLocaleString() ?? 0}
                </Title>
                <Text type="secondary">Đơn hàng</Text>
              </div>
              <div>
                <HeartOutlined style={{ fontSize: "24px", color: "#50b2fc" }} />
                <Title level={4} className="m-0">
                  {profile?.so_luong_yeu_thich?.toLocaleString() ?? 0}
                </Title>
                <Text type="secondary">Yêu thích</Text>
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
                <div className="relative w-26 h-26 mx-auto rounded-full bg-gradient-to-r">
                  <Avatar
                    src={tempImageUrl || avatarImage || url}
                    size={100}
                    className="border-4 border-white shadow-lg bg-top bg-no-repeat"
                  />
                  {updateAvatarMutation.isPending && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]">
                          .
                        </span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.2s]">
                          .
                        </span>
                        <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.1s]">
                          .
                        </span>
                      </div>
                    </div>
                  )}
                  <Upload
                    showUploadList={false}
                    onChange={handleAvatarChange}
                    className="absolute bottom-0 right-0"
                    disabled={updateAvatarMutation.isPending}
                  >
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<CameraOutlined />}
                      disabled={updateAvatarMutation.isPending}
                      className={`${
                        updateAvatarMutation.isPending
                          ? "bg-gray-400"
                          : "bg-blue-400 hover:bg-blue-500"
                      } text-white p-2`}
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
              {/* <Button
                type="default"
                className="text-white bg-slate-950"
                onClick={() => setpass(true)}
              >
                Đổi mật khẩu
              </Button> */}
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
