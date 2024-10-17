
import instance from "@/configs/admin";
import { uploadToCloudinary } from "@/configs/cloudinary";
import {
  FacebookOutlined,
  InstagramOutlined,
  PlusOutlined,
  TikTokOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  message,
  Row,
  Spin,
  Table,
  Upload,
} from "antd";
import "antd/dist/reset.css";
import { useEffect, useState } from "react";

// const { Content } = Layout;
// const { Title } = Typography;

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Contents = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [localWebsiteInfo, setLocalWebsiteInfo] = useState<any>(null);
  const [originalBanner, setOriginalBanner] = useState<any>(null);

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["websiteInfo"],
    queryFn: async () => {
      const response = await instance.get("/thong-tin-web");
      console.log("Raw API Response:", response.data);
      return response.data;
    },
  });

  useEffect(() => {
    if (apiResponse?.data) {
      setLocalWebsiteInfo(apiResponse.data);
      setOriginalBanner(apiResponse.data.banner);
      form.setFieldsValue(apiResponse.data);
    }
  }, [apiResponse, form]);

  const updateWebsiteInfo = useMutation({
    mutationFn: (updatedInfo: any) => {
      const bannerArray = Array.isArray(originalBanner)
        ? originalBanner
        : originalBanner
          ? [originalBanner]
          : [];

      const dataToSend = {
        ...updatedInfo,
        banner: bannerArray,
      };
      return instance.post("/thong-tin-web", dataToSend);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websiteInfo"] });
      message.success("Thông tin đã được cập nhật thành công");
    },
    onError: (error: any) => {
      message.error("Có lỗi xảy ra khi cập nhật thông tin");
      console.error("Error updating website info:", error);
    },
  });

  const [fileList, setFileList] = useState<any[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (localWebsiteInfo && localWebsiteInfo.logo_website) {
      setFileList([
        {
          uid: "-1",
          name: "logo.png",
          status: "done",
          url: localWebsiteInfo.logo_website,
        },
      ]);
    }
  }, [localWebsiteInfo]);

  const handleInputChange = (key: string, value: string) => {
    setLocalWebsiteInfo((prev: any) => ({ ...prev, [key]: value }));
    form.setFieldsValue({ [key]: value });
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    const key = `link_${platform.toLowerCase()}`;
    setLocalWebsiteInfo((prev: any) => ({ ...prev, [key]: value }));
    form.setFieldsValue({ [key]: value });
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = async ({
    file,
    fileList: newFileList,
  }: {
    file: any;
    fileList: any[];
  }) => {
    setFileList(newFileList);

    if (file.status === "done") {
      try {
        const cloudinaryUrl = await uploadToCloudinary(file.originFileObj);
        setLocalWebsiteInfo((prev: any) => ({
          ...prev,
          logo_website: cloudinaryUrl,
        }));
        form.setFieldsValue({ logo_website: cloudinaryUrl });
        message.success("Logo đã được tải lên thành công");
      } catch (error) {
        message.error("Không thể tải lên logo");
        console.error("Lỗi khi tải lên:", error);
      }
    }
  };

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        updateWebsiteInfo.mutate(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const uploadButton = (
    <div style={{ border: 0, background: "none", textAlign: "center" }}>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );


  if (isLoading)
    return (
      <div className="flex items-center justify-center mt-[250px]">
        <Spin size="large" />
      </div>
    );
  if (error) return <div>An error occurred: {(error as Error).message}</div>;
  if (!localWebsiteInfo) return <div>No data available</div>;

  const contactData = [
    {
      key: "ten_website",
      label: "Tên Website",
      value: localWebsiteInfo?.ten_website || "",
    },
    {
      key: "ten_doanh_nghiep",
      label: "Tên Doanh Nghiệp",
      value: localWebsiteInfo?.ten_doanh_nghiep || "",
    },
    { key: "dia_chi", label: "Địa Chỉ", value: localWebsiteInfo?.dia_chi || "" },
    { key: "email", label: "Email", value: localWebsiteInfo?.email || "" },
    {
      key: "so_dien_thoai_dat_hang",
      label: "SĐT Đặt Hàng",
      value: localWebsiteInfo?.so_dien_thoai_dat_hang || "",
    },
    {
      key: "so_dien_thoai_khieu_nai",
      label: "SĐT Khiếu Nại",
      value: localWebsiteInfo?.so_dien_thoai_khieu_nai || "",
    },
    { key: "cau_noi", label: "Câu Nói", value: localWebsiteInfo?.cau_noi || "" },
  ];

  const socialLinks = [
    {
      platform: "Facebook",
      icon: <FacebookOutlined />,
      value: localWebsiteInfo?.link_facebook || "",
    },
    {
      platform: "Instagram",
      icon: <InstagramOutlined />,
      value: localWebsiteInfo?.link_instagram || "",
    },
    {
      platform: "Youtube",
      icon: <YoutubeOutlined />,
      value: localWebsiteInfo?.link_youtube || "",
    },
    {
      platform: "TikTok",
      icon: <TikTokOutlined />,
      value: localWebsiteInfo?.link_tiktok || "",
    },
    {
      platform: "Zalo",
      icon: <TikTokOutlined />,
      value: localWebsiteInfo?.link_zalo || "",
    },
  ];

  return (

    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị /{" "}
          <span className="font-semibold px-px">Thông tin website</span>
        </h1>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Thông tin website</h1>
      </div>
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={8}>
            <div className="flex flex-col space-y-4">
              <h2 className="text-xl font-semibold mb-2">Logo</h2>
              <Form.Item
                name="logo_website"
                rules={[{ required: true, message: "Vui lòng tải lên logo" }]}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  customRequest={async ({ file, onSuccess }) => {
                    try {
                      const cloudinaryUrl = await uploadToCloudinary(
                        file as File
                      );
                      setLocalWebsiteInfo((prev: any) => ({
                        ...prev,
                        logo_website: cloudinaryUrl,
                      }));
                      form.setFieldsValue({ logo_website: cloudinaryUrl });
                      onSuccess?.("Ok");
                    } catch (error) {
                      message.error("Không thể tải lên logo");
                      console.error("Lỗi khi tải lên:", error);
                    }
                  }}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>
              {previewImage && (
                <Image
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                  }}
                  src={previewImage}
                />
              )}
              <br />

              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">
                  Liên kết mạng xã hội
                </h2>
                <Table
                  dataSource={socialLinks}
                  pagination={false}
                  rowKey="platform"
                >
                  <Table.Column
                    title="Mạng xã hội"
                    dataIndex="platform"
                    key="platform"
                  />
                  <Table.Column
                    title="Liên kết"
                    dataIndex="value"
                    key="value"
                    render={(_, record) => (
                      <Form.Item
                        name={`link_${record.platform.toLowerCase()}`}
                        rules={[
                          {
                            required: true,
                            message: `Vui lòng nhập liên kết ${record.platform}`,
                          },
                        ]}
                      >
                        <Input
                          prefix={record.icon}
                          onChange={(e) =>
                            handleSocialLinkChange(
                              record.platform,
                              e.target.value
                            )
                          }
                          placeholder={`Nhập liên kết ${record.platform}`}
                        />
                      </Form.Item>
                    )}
                    
                  />
                </Table>
              </div>
            </div>
          </Col>

          <Col span={16}>
            <div className="flex flex-col space-y-4">
              <h2 className="text-xl font-semibold mb-2">Thông tin liên hệ</h2>
              <Table dataSource={contactData} pagination={false} rowKey="key">
                <Table.Column title="Chỉ số" dataIndex="label" key="label" />
                <Table.Column
                  title="Giá trị"
                  dataIndex="value"
                  key="value"
                  render={(_, record) => (
                    <Form.Item
                      name={record.key}
                      rules={[
                        {
                          required: true,
                          message: `Vui lòng nhập ${record.label}`,
                        },
                        record.key.includes("so_dien_thoai")
                          ? {
                              pattern: /^[0-9]+$/,
                              message: "Vui lòng chỉ nhập số",
                            }
                          : {},
                      ]}
                    >
                      <Input
                        onChange={(e) =>
                          handleInputChange(record.key, e.target.value)
                        }
                        placeholder={`Nhập ${record.label}`}
                      />
                    </Form.Item>
                  )}
                  
                />
              </Table>
            </div>
          </Col>
        </Row>
        <Button
          onClick={handleUpdate}
          className=" mt-8 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-2 hover:bg-blue-600 shadow-md transition-colors"
        >
          Cập nhật thông tin
        </Button>
      </Form>
    </main>
  );
};

export default Contents;
