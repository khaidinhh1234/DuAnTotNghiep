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
} from "antd";
import type { UploadFile, UploadProps } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadToCloudinary } from "@/configs/cloudinary";
import instance from "@/configs/admin";

interface BannerData {
  noi_dung: {
    mau_nut: string;
    tieu_de_nut: string;
    tieu_de_phu: string;
    tieu_de_chinh: string;
    mau_tieu_de_phu: string;
    mau_tieu_de_chinh: string;
    van_ban_quang_cao: string;
    mau_van_ban_quang_cao: string;
    duong_dan: string;
    mau_tieu_de_nut: string;
  };
  duong_dan_anh: string[];
}

interface ApiResponse {
  status: boolean;
  data: {
    banner: BannerData[];
  };
  message: string;
}

const BannerManagement: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useQuery<ApiResponse>({
    queryKey: ["bannerData"],
    queryFn: async () => {
      console.log("Starting API call");
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout
        const response = await instance.get("/thong-tin-web", {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        console.log("API response:", response.data);
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

  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [bannerTextData, setBannerTextData] = useState([
    { key: "Tiêu đề chính", value: "", color: "" },
    { key: "tiêu đề phụ", value: "", color: "" },
    { key: "văn bản quảng cáo", value: "", color: "" },
    { key: "tiêu đề nút", value: "", color: "" },
    { key: "đường dẫn", value: "" },
  ]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [accentColor, setAccentColor] = useState("#000000");
  const [uploadingFiles, setUploadingFiles] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (
      apiResponse &&
      apiResponse.data &&
      apiResponse.data.banner &&
      apiResponse.data.banner.length > 0
    ) {
      console.log("Setting banner data");
      setBannerData(apiResponse.data.banner[0]);
    } else {
      console.log("No banner data in response");
    }
  }, [apiResponse]);

  useEffect(() => {
    if (bannerData) {
      setBannerTextData([
        {
          key: "Tiêu đề chính",
          value: bannerData.noi_dung.tieu_de_chinh || "",
          color: bannerData.noi_dung.mau_tieu_de_chinh || "",
        },
        {
          key: "tiêu đề phụ",
          value: bannerData.noi_dung.tieu_de_phu || "",
          color: bannerData.noi_dung.mau_tieu_de_phu || "",
        },
        {
          key: "văn bản quảng cáo",
          value: bannerData.noi_dung.van_ban_quang_cao || "",
          color: bannerData.noi_dung.mau_van_ban_quang_cao || "",
        },
        {
          key: "tiêu đề nút",
          value: bannerData.noi_dung.tieu_de_nut || "",
          color: bannerData.noi_dung.mau_tieu_de_nut || "",
        },
        { key: "đường dẫn", value: bannerData.noi_dung.duong_dan || "" },
      ]);
      setAccentColor(bannerData.noi_dung.mau_nut || "#000000");

      setFileList(
        bannerData.duong_dan_anh.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: "done",
          url: url,
        }))
      );
    }
  }, [bannerData]);

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = async ({
    fileList: newFileList,
  }) => {
    const updatedFileList = await Promise.all(
      newFileList.map(async (file) => {
        if (file.originFileObj && !file.url && !uploadingFiles[file.uid]) {
          setUploadingFiles((prev) => ({ ...prev, [file.uid]: true }));
          try {
            const cloudinaryUrl = await uploadToCloudinary(file.originFileObj);
            return { ...file, status: "done", url: cloudinaryUrl };
          } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            message.error("Failed to upload image");
            return { ...file, status: "error" };
          } finally {
            setUploadingFiles((prev) => ({ ...prev, [file.uid]: false }));
          }
        }
        return file;
      })
    );

    setFileList(updatedFileList);
  };

  const handleTextChange = (key: string, newValue: string) => {
    setBannerTextData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, value: newValue } : item
      )
    );
  };

  const handleRemove = (file: UploadFile) => {
    return fileList.length > 3;
  };

  const handleColorChange = (key: string, newColor: string) => {
    setBannerTextData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, color: newColor } : item
      )
    );
  };

  const mutation = useMutation({
    mutationFn: (newBannerData: BannerData[]) => {
      return instance.post("/thong-tin-web", {
        banner: newBannerData,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bannerData"] });
      message.success("Banner updated successfully");
    },
    onError: (error: any) => {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        errorMessages.forEach((msg: string) => message.error(msg));
      } else {
        message.error("Failed to update banner");
      }
    },
  });

  const handleSave = () => {
    if (!bannerData) return;

    const newBannerData: BannerData = {
      duong_dan_anh: fileList
        .map((file) => file.url || "")
        .filter((url) => url !== ""),
      noi_dung: {
        mau_nut: accentColor,
        tieu_de_nut: bannerTextData[3].value,
        tieu_de_phu: bannerTextData[1].value,
        tieu_de_chinh: bannerTextData[0].value,
        mau_tieu_de_phu: bannerTextData[1].color,
        mau_tieu_de_chinh: bannerTextData[0].color,
        van_ban_quang_cao: bannerTextData[2].value,
        mau_van_ban_quang_cao: bannerTextData[2].color,
        mau_tieu_de_nut: bannerTextData[3].color || "",
        duong_dan: bannerTextData[4].value,
      },
    };

    mutation.mutate([newBannerData]);
  };

  if (isLoading) {
    console.log("Still loading...");
    return (
      <Spin tip="Loading...">
        <div className="content" />
      </Spin>
    );
  }
  if (isError) {
    console.log("Error occurred");
    return <div>Error loading banner data. Please try again later.</div>;
  }
  if (!bannerData) {
    console.log("No banner data");
    return <div>No banner data available. Please add some data.</div>;
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
            onRemove={handleRemove}
            beforeUpload={() => false}
            itemRender={(originNode, file) => {
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
          <Table dataSource={bannerTextData} pagination={false}>
            <Table.Column title="Key" dataIndex="key" key="key" />
            <Table.Column
              title="Value"
              dataIndex="value"
              key="value"
              render={(text, record: any) => (
                <Input
                  value={text}
                  onChange={(e) => handleTextChange(record.key, e.target.value)}
                />
              )}
            />
            <Table.Column
              title="Color"
              key="color"
              render={(text, record: any) =>
                record.key !== "đường dẫn" ? (
                  <ColorPicker
                    value={record.color}
                    onChange={(color) =>
                      handleColorChange(record.key, color.toHexString())
                    }
                  />
                ) : null
              }
            />
          </Table>
        </div>
      </div>

      <div className="flex flex-col space-y-4 mt-40">
        <div>
          <h2 className="text-xl font-semibold mb-2">Màu Banner</h2>
          <div className="flex space-x-4">
            <div>
              <p>Màu button</p>
              <ColorPicker
                value={accentColor}
                onChange={(color) => setAccentColor(color.toHexString())}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Xem trước</h2>
          {fileList.length > 0 ? (
            <Carousel autoplay>
              {fileList.map((file, index) => (
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
                      src={file.url || ""}
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
                    <div className="absolute top-[100px] left-16">
                      <div className="mb-4">
                        <p
                          className="font-semibold text-sm mb-2"
                          style={{ color: bannerTextData[0].color }}
                        >
                          {bannerTextData[0].value}
                        </p>
                        <p
                          className="text-xl font-bold mb-2 tracking-[1px]"
                          style={{ color: bannerTextData[1].color }}
                        >
                          {bannerTextData[1].value}
                        </p>
                        <p
                          className="text-base font-medium uppercase"
                          style={{ color: bannerTextData[2].color }}
                        >
                          {bannerTextData[2].value}
                        </p>
                      </div>
                      <div>
                        <button
                          className="px-4 py-2 rounded-lg shadow-2xl shadow-slate-500/50 hover:bg-white hover:text-black font-medium"
                          style={{
                            backgroundColor: accentColor,
                            color: bannerTextData[3].color,
                          }}
                        >
                          {bannerTextData[3].value}
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
          className="  bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-2 hover:bg-blue-600 shadow-md transition-colors"
          onClick={handleSave}
        >
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default BannerManagement;
