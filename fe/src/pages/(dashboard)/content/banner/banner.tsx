import React, { useState, useEffect } from "react";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Table,
  Upload,
  Image,
  ColorPicker,
  Carousel,
  Empty,
  message,
  Spin,
  Tabs,
  Select,
} from "antd";
import type { UploadFile, UploadProps } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadToCloudinary } from "@/configs/cloudinary";
import instance from "@/configs/admin";

interface BannerData {
  id: number;
  duong_dan_anh: string;
  vi_tri: number;
  noi_dung: {
    tieu_de_chinh: string;
    mau_tieu_de_chinh: string;
    tieu_de_phu: string;
    mau_tieu_de_phu: string;
    van_ban_quang_cao: string;
    mau_van_ban_quang_cao: string;
    tieu_de_nut: string;
    mau_nut: string;
    mau_tieu_de_nut: string;
    duong_link: string;
  };
}

interface ApiResponse {
  status: boolean;
  data: {
    banner: BannerData[];
  };
  message: string;
}

const { TabPane } = Tabs;

const BannerManagement: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useQuery<ApiResponse>({
    queryKey: ["bannerData"],
    queryFn: async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const response = await instance.get("/thong-tin-web", {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response.data;
      } catch (error: any) {
        console.error("API call failed:", error);
        if (error.name === "AbortError") {
          console.error("Request timed out");
        }
        throw error;
      }
    },
  });

  const [banners, setBanners] = useState<BannerData[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (apiResponse && apiResponse.data && apiResponse.data.banner) {
      setBanners(apiResponse.data.banner.sort((a, b) => a.vi_tri - b.vi_tri));
      setFileList(
        apiResponse.data.banner.map((banner, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: "done",
          url: banner.duong_dan_anh,
        }))
      );
    }
  }, [apiResponse]);

  const saveMutation = useMutation({
    mutationFn: (newBanners: BannerData[]) =>
      instance.post("/thong-tin-web", { banner: newBanners }),
    onSuccess: () => {
      message.success("Đã lưu thay đổi thành công");
      queryClient.invalidateQueries({ queryKey: ["bannerData"] });
    },
    onError: () => {
      message.error("Lỗi khi lưu thay đổi");
    },
  });

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    if (fileList.length <= 3 && newFileList.length < fileList.length) {
      message.warning("Không thể xóa khi chỉ còn 3 ảnh");
      return;
    }
    const updatedFileList = await Promise.all(
      newFileList.map(async (file) => {
        if (file.originFileObj && !file.url && !uploadingFiles[file.uid]) {
          setUploadingFiles((prev) => ({ ...prev, [file.uid]: true }));
          try {
            const cloudinaryUrl = await uploadToCloudinary(file.originFileObj);
            return { ...file, status: "done", url: cloudinaryUrl };
          } catch (error) {
            message.error("Không tải được hình ảnh lên");
            return { ...file, status: "error" };
          } finally {
            setUploadingFiles((prev) => ({ ...prev, [file.uid]: false }));
          }
        }
        return file;
      })
    );

    setFileList(updatedFileList as UploadFile[]);

    const updatedBanners = updatedFileList.map((file, index) => {
      const existingBanner = banners.find(
        (banner) => banner.duong_dan_anh === file.url
      );
      if (existingBanner) {
        return existingBanner;
      } else {
        return {
          id: Date.now() + index,
          duong_dan_anh: file.url || "",
          vi_tri: banners.length + 1,
          noi_dung: {
            tieu_de_chinh: "",
            mau_tieu_de_chinh: "",
            tieu_de_phu: "",
            mau_tieu_de_phu: "",
            van_ban_quang_cao: "",
            mau_van_ban_quang_cao: "",
            tieu_de_nut: "",
            mau_nut: "",
            mau_tieu_de_nut: "",
            duong_link: "",
          },
        };
      }
    });

    setBanners(updatedBanners);
  };

  const handleBannerChange = (
    bannerId: number,
    field: string,
    value: string
  ) => {
    setBanners((prevBanners) =>
      prevBanners.map((banner) =>
        banner.id === bannerId
          ? { ...banner, noi_dung: { ...banner.noi_dung, [field]: value } }
          : banner
      )
    );
  };

  const handlePositionChange = (bannerId: number, newPosition: number) => {
    setBanners((prevBanners) => {
      const bannerToMove = prevBanners.find((banner) => banner.id === bannerId);
      if (!bannerToMove) return prevBanners;

      const updatedBanners = prevBanners.map((banner) => {
        if (banner.id === bannerId) {
          return { ...banner, vi_tri: newPosition };
        } else if (banner.vi_tri === newPosition) {
          return { ...banner, vi_tri: bannerToMove.vi_tri };
        }
        return banner;
      });

      return updatedBanners.sort((a, b) => a.vi_tri - b.vi_tri);
    });
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center mt-[250px]">
        <Spin size="large" />
      </div>
    );

  if (isError) return <div>Error</div>;

  if (banners.length === 0) {
    return (
      <div>
        Không có dữ liệu biểu ngữ nào khả dụng. Vui lòng thêm một số dữ liệu.
      </div>
    );
  }

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      <div className="flex flex-col space-y-9">
        <h1 className="md:text-base">
          Quản trị /{" "}
          <span className="font-semibold px-px">Thông tin website</span>
        </h1>

        <div className="flex items-center justify-between mb-4">
          <h1 className="font-semibold md:text-3xl">Thông tin banner</h1>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Ảnh Banner</h2>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={() => false}
            itemRender={(originNode, file, fileList) => {
              if (uploadingFiles[file.uid]) {
                return (
                  <div className="ant-upload-list-item-container">
                    <Spin
                      indicator={
                        <LoadingOutlined style={{ fontSize: 24 }} spin />
                      }
                    />
                  </div>
                );
              }
              if (fileList.length <= 3) {
                return React.cloneElement(originNode, {
                  actions: originNode.props.actions?.filter(
                    (action: any) => action.key !== "delete"
                  ),
                });
              }
              return originNode;
            }}
          >
            {fileList.length >= 4 ? null : uploadButton}
          </Upload>

          {previewImage && (
            <Image
              style={{ display: "none" }}
              src={previewImage}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
              }}
            />
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Nội dung banner</h2>
          <Tabs defaultActiveKey="0">
            {banners.map((banner, index) => (
              <TabPane tab={`Banner ${index + 1}`} key={index}>
                <Table
                  dataSource={[
                    { key: "Vị trí", field: "vi_tri", value: banner.vi_tri },
                    {
                      key: "Tiêu đề chính",
                      field: "tieu_de_chinh",
                      value: banner.noi_dung.tieu_de_chinh,
                      color: banner.noi_dung.mau_tieu_de_chinh,
                    },
                    {
                      key: "Tiêu đề phụ",
                      field: "tieu_de_phu",
                      value: banner.noi_dung.tieu_de_phu,
                      color: banner.noi_dung.mau_tieu_de_phu,
                    },
                    {
                      key: "Văn bản quảng cáo",
                      field: "van_ban_quang_cao",
                      value: banner.noi_dung.van_ban_quang_cao,
                      color: banner.noi_dung.mau_van_ban_quang_cao,
                    },
                    {
                      key: "Tiêu đề nút",
                      field: "tieu_de_nut",
                      value: banner.noi_dung.tieu_de_nut,
                      color: banner.noi_dung.mau_tieu_de_nut,
                    },
                    {
                      key: "Đường dẫn",
                      field: "duong_link",
                      value: banner.noi_dung.duong_link,
                    },
                    {
                      key: "Màu nền nút",
                      field: "mau_nut",
                      color: banner.noi_dung.mau_nut,
                    },
                  ]}
                  pagination={false}
                >
                  <Table.Column title="Tên" dataIndex="key" key="key" />
                  <Table.Column
                    title="Nội Dung"
                    dataIndex="value"
                    key="value"
                    render={(text, record: any) => {
                      if (record.field === "mau_nut") {
                        return null;
                      }
                      if (record.field === "vi_tri") {
                        return (
                          <Select
                            value={text}
                            onChange={(value) =>
                              handlePositionChange(banner.id, value)
                            }
                            style={{ width: 120 }}
                          >
                            {banners.map((_, i) => (
                              <Select.Option key={i} value={i + 1}>
                                {i + 1}
                              </Select.Option>
                            ))}
                          </Select>
                        );
                      }
                      return (
                        <Input
                          value={text}
                          onChange={(e) =>
                            handleBannerChange(
                              banner.id,
                              record.field,
                              e.target.value
                            )
                          }
                        />
                      );
                    }}
                  />
                  <Table.Column
                    title="Màu"
                    key="color"
                    render={(_text, record: any) => {
                      if (
                        record.field === "duong_link" ||
                        record.field === "vi_tri"
                      ) {
                        return null;
                      }
                      return (
                        <ColorPicker
                          value={record.color}
                          onChange={(color) =>
                            handleBannerChange(
                              banner.id,
                              record.field === "mau_nut"
                                ? "mau_nut"
                                : `mau_${record.field}`,
                              color.toHexString()
                            )
                          }
                        />
                      );
                    }}
                  />
                </Table>
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>

      <div className="flex flex-col space-y-4 mt-40">
        <div>
          <h2 className="text-xl font-semibold mb-2">Xem trước</h2>
          {fileList.length > 0 ? (
            <Carousel autoplay>
              {banners.map((banner, index) => (
                <div key={index}>
                  <div
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      position: "relative",
                      overflow: "hidden",
                      height: "300px",
                      width: "100%",
                    }}
                  >
                    <img
                      src={banner.duong_dan_anh}
                      alt={`Banner preview ${index}`}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        zIndex: 0,
                      }}
                    />
                    <div className="absolute top-[75px] w-[500px] left-10">
                      <div className="mb-4">
                        <p
                          className="font-semibold text-base mb-2"
                          style={{ color: banner.noi_dung.mau_tieu_de_chinh }}
                        >
                          {banner.noi_dung.tieu_de_chinh}
                        </p>
                        <p
                          className="text-xl font-bold mb-2 tracking-[1px]"
                          style={{ color: banner.noi_dung.mau_tieu_de_phu }}
                        >
                          {banner.noi_dung.tieu_de_phu}
                        </p>
                        <p
                          className="text-xs font-normal uppercase w-[450px]"
                          style={{
                            color: banner.noi_dung.mau_van_ban_quang_cao,
                          }}
                        >
                          {banner.noi_dung.van_ban_quang_cao}
                        </p>
                      </div>
                      <div>
                        <button
                          className="px-4 py-2 rounded-lg shadow-2xl shadow-slate-500/50 hover:bg-white hover:text-black font-medium"
                          style={{
                            backgroundColor: banner.noi_dung.mau_nut,
                            color: banner.noi_dung.mau_tieu_de_nut,
                          }}
                        >
                          {banner.noi_dung.tieu_de_nut}
                          <i className="fa-solid fa-arrow-right ml-2"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          ) : (
            <div
              className="flex items-center justify-center h-full"
              style={{ marginTop: 40 }}
            >
              <Empty description="Không có dữ liệu" />
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-start">
        <Button
          className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-2 hover:bg-blue-600 shadow-md transition-colors"
          onClick={() => {
            saveMutation.mutate(banners);
          }}
          loading={saveMutation.isPending}
        >
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default BannerManagement;
