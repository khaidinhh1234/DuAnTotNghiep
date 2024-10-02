import React, { useState } from "react";
import { Table, Input, DatePicker, Upload, Modal, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { UploadFile } from "antd/es/upload/interface";
import "@/global.css";
import { VariantFormProps, Variant, VariantPull } from "@/common/types/product";

const VariantForm: React.FC<VariantFormProps> = ({
  variants,
  updateVariant,
  handleRemoveImage,
  handleImageChange,
  colorsData,
  sizesData,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const formatNumber = (value: string) => {
    // Chỉ giữ lại các ký tự số
    const cleanedValue = value.replace(/\D/g, "");
    // Thêm dấu phẩy vào số
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpdate = (record: Variant, field: keyof Variant, value: any) => {
    const update: VariantPull = { [field]: value };
    updateVariant({ ...record, ...update });
  };

  const columns = [
    {
      title: "Kích thước",
      dataIndex: "kich_thuoc_id",
      key: "kich_thuoc",
      render: (sizeId: number) => {
        const size = sizesData.find((s) => Number(s.id) === sizeId);
        return size ? size.kich_thuoc : "";
      },
    },
    {
      title: "Màu sắc",
      dataIndex: "mau_sac_id",
      key: "mau_sac",
      render: (colorId: number) => {
        const color = colorsData.find((c) => Number(c.id) === colorId);
        return color ? color.ten_mau_sac : "";
      },
    },
    {
      title: "Giá bán",
      dataIndex: "gia_ban",
      key: "gia_ban",
      render: (text: string, record: Variant) => (
        <Form.Item
          name={`gia_ban_${record.id}`} // Tên duy nhất cho mỗi biến thể
          hasFeedback
          validateStatus={
            text && (isNaN(Number(text)) || Number(text) < 1) ? "error" : ""
          } // Chỉ kiểm tra nếu có giá trị nhập
          help={
            text === undefined || text === ""
              ? "" // Không báo lỗi khi chưa nhập
              : isNaN(Number(text))
                ? "Giá bán phải là số!"
                : Number(text) < 1
                  ? "Giá bán phải lớn hơn 0!"
                  : ""
          }
          initialValue="0" // Gán giá trị mặc định là 0
          rules={[{ required: true, message: "Giá bán bắt buộc phải nhập!" }]}
          validateTrigger="onBlur"
        >
          <Input
            value={text ? formatNumber(text) : formatNumber("0")}
            placeholder="Giá bán sản phẩm " // Định dạng giá trị mặc định là 0
            onChange={(e) => handleUpdate(record, "gia_ban", e.target.value)}
            className="rounded-md mt-5"
          />
        </Form.Item>
      ),
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "gia_khuyen_mai",
      key: "gia_khuyen_mai",
      render: (text: string, record: Variant) => (
        <Form.Item
          name={`gia_khuyen_mai_${record.id}`} // Tên duy nhất cho mỗi biến thể
          hasFeedback
          validateStatus={
            text && isNaN(Number(text))
              ? "error"
              : Number(record.gia_ban) > 0 &&
                  (Number(text) < Number(record.gia_ban) * 0.5 ||
                    Number(text) >= Number(record.gia_ban))
                ? "error"
                : ""
          }
          help={
            text === undefined || text === ""
              ? ""
              : isNaN(Number(text))
                ? "Bắt buộc phải là số!"
                : Number(record.gia_ban) > 0 &&
                    Number(text) < Number(record.gia_ban) * 0.5
                  ? "Bắt buộc nhỏ hơn 50% giá bán!"
                  : Number(record.gia_ban) > 0 &&
                      Number(text) >= Number(record.gia_ban)
                    ? "Bắt buộc phải nhỏ hơn giá bán"
                    : ""
          }
          initialValue="0"
          className="rounded-md w-40"
          rules={[{ required: true, message: "Bắt buộc phải nhập!" }]}
          validateTrigger="onBlur"
        >
          <Input
            value={text ? formatNumber(text) : formatNumber("0")}
            placeholder="Giá khuyến mãi sản phẩm"
            onChange={(e) =>
              handleUpdate(record, "gia_khuyen_mai", e.target.value)
            }
            className="rounded-md mt-5"
          />
        </Form.Item>
      ),
    },

    {
      title: "Số lượng",
      dataIndex: "so_luong_bien_the",
      key: "so_luong_bien_the",
      render: (text: string, record: Variant) => (
        <Form.Item
          name={`so_luong_bien_the_${record.id}`} // Tên duy nhất cho mỗi biến thể
          hasFeedback
          validateStatus={
            text !== "" &&
            (isNaN(Number(text)) || Number(text) < 0 || Number(text) > 100000)
              ? "error"
              : ""
          }
          help={
            text === ""
              ? "" // Thông báo khi trường rỗng
              : isNaN(Number(text))
                ? "Bắt buộc phải là số!"
                : Number(text) < 0
                  ? "Số lượng không được âm!"
                  : Number(text) > 100000
                    ? "Số lượng không được lớn hơn 100000!"
                    : ""
          }
          initialValue="0"
          className="rounded-md w-40"
          rules={[
            { required: true, message: "Bắt buộc phải nhập!" },
            {
              type: "number",
              min: 100000,
              message: "Số lượng không được nhỏ hơn 100000!",
            },
          ]}
          validateTrigger="onBlur"
        >
          <Input
            placeholder="Số lượng biến thể"
            className="rounded-md mt-5"
            // Đảm bảo người dùng chỉ nhập số
            onChange={(e) =>
              handleUpdate(record, "so_luong_bien_the", e.target.value)
            } // Cập nhật giá trị
          />
        </Form.Item>
      ),
    },
    {
      title: "Ngày bắt đầu khuyến mãi",
      dataIndex: "ngay_bat_dau_khuyen_mai",
      key: "ngay_bat_dau_khuyen_mai",
      render: (text: string | null, record: Variant) => (
        <Form.Item name="ngay_bat_dau_khuyen_mai">
          <DatePicker
            value={text ? dayjs(text) : null}
            onChange={(_, dateString) =>
              handleUpdate(
                record,
                "ngay_bat_dau_khuyen_mai",
                dateString || null
              )
            }
            format="YYYY-MM-DD"
            className="rounded-md mt-5"
            disabled={!record.gia_khuyen_mai}
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
          />
        </Form.Item>
      ),
    },
    {
      title: "Ngày kết thúc khuyến mãi",
      dataIndex: "ngay_ket_thuc_khuyen_mai",
      key: "ngay_ket_thuc_khuyen_mai",
      render: (text: string | null, record: Variant) => (
        <Form.Item name="ngay_ket_thuc_khuyen_mai">
          <DatePicker
            value={text ? dayjs(text) : null}
            onChange={(_, dateString) =>
              handleUpdate(
                record,
                "ngay_ket_thuc_khuyen_mai",
                dateString || null
              )
            }
            format="YYYY-MM-DD"
            disabledDate={(current: Dayjs) => {
              const startDate = record.ngay_bat_dau_khuyen_mai;
              return startDate ? current.isBefore(dayjs(startDate)) : false;
            }}
            className="rounded-md mt-5"
            disabled={!record.gia_khuyen_mai}
          />
        </Form.Item>
      ),
    },
    {
      title: "Ảnh biến thể",
      dataIndex: "anh_bien_the",
      key: "anh_bien_the",
      render: (_: any, record: Variant) => (
        <Upload
          listType="picture-card"
          fileList={record.anh_bien_the}
          onPreview={handlePreview}
          onRemove={(file) => handleRemoveImage(file, record)}
          onChange={(info) => handleImageChange(info, record)}
          beforeUpload={() => false}
          className={`custom-upload   ${record.anh_bien_the.length >= 3 ? "w-[200px]" : "w-auto"}`}
        >
          {record.anh_bien_the.length >= 5 ? null : (
            <div>
              <PlusOutlined />
            </div>
          )}
        </Upload>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={variants}
        columns={columns}
        rowKey="id"
        className="bg-white rounded-lg shadow-md "
        pagination={false}
      />
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

export default VariantForm;
