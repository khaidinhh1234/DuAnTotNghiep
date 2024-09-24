
import React, { useState, useMemo } from "react";
import { Table, InputNumber, DatePicker, Upload, Modal } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { UploadFile } from "antd/es/upload/interface";
import '@/global.css'
import { VariantFormProps, Variant, VariantPull } from "@/common/types/product";

const VariantForm = ({ 
  variants, 
  updateVariant, 
  handleRemoveImage, 
  handleImageChange,
  colorsData,
  sizesData
}: VariantFormProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  console.log("VariantForm received variants:", variants);
  console.log("VariantForm received colorsData:", colorsData);
  console.log("VariantForm received sizesData:", sizesData);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || (file.url && typeof file.url === 'string' ? file.url.substring(file.url.lastIndexOf('/') + 1) : 'Preview'));
  };

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleUpdate = (record: Variant, field: keyof Variant, value: any) => {

    const update: VariantPull = { [field]: value };
    updateVariant({ ...record, ...update });
  };

  const columns = useMemo(() => [
    {
      title: 'Kích thước',
      dataIndex: 'kich_thuoc_id',
      key: 'kich_thuoc',
      render: (sizeId: number) => {
        const size = sizesData.find(s => Number(s.id) === sizeId);
        return size ? size.kich_thuoc : 'Unknown size';
      },
    },
    {
      title: 'Màu sắc',
      dataIndex: 'mau_sac_id',
      key: 'mau_sac',
      render: (colorId: number) => {
        const color = colorsData.find(c => Number(c.id) === colorId);
        return color ? color.ten_mau_sac : 'Unknown color';
      },
    },
    {
      title: 'Giá bán',
      dataIndex: 'gia_ban',
      key: 'gia_ban',
      render: (text: string, record: Variant) => (
        <InputNumber
          value={Number(text)}
          onChange={(value) => handleUpdate(record, 'gia_ban', value?.toString())}
          className="rounded-md w-full"
          min={0}
          step={1000}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
        />
      ),
    },
    {
      title: 'Giá khuyến mãi',
      dataIndex: 'gia_khuyen_mai',
      key: 'gia_khuyen_mai',
      render: (text: string, record: Variant) => (
        <InputNumber
          value={Number(text)}
          onChange={(value) => handleUpdate(record, 'gia_khuyen_mai', value?.toString())}
          className="rounded-md w-full"
          min={0}
          step={1000}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
        />
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'so_luong_bien_the',
      key: 'so_luong_bien_the',
      render: (text: string, record: Variant) => (
        <InputNumber
          value={Number(text)}
          onChange={(value) => handleUpdate(record, 'so_luong_bien_the', value?.toString())}
          className="rounded-md w-full"
          min={0}
          step={1}
        />
      ),
    },
    {
      title: 'Ngày bắt đầu khuyến mãi',
      dataIndex: 'ngay_bat_dau_khuyen_mai',
      key: 'ngay_bat_dau_khuyen_mai',
      render: (text: string | null, record: Variant) => (
        <DatePicker
          value={text ? dayjs(text) : null}
          onChange={(_, dateString) => handleUpdate(record, 'ngay_bat_dau_khuyen_mai', dateString || null)}
          format="YYYY-MM-DD"
          className="rounded-md"
          placeholder="Chọn ngày bắt đầu"
        />
      ),
    },
    {
      title: 'Ngày kết thúc khuyến mãi',
      dataIndex: 'ngay_ket_thuc_khuyen_mai',
      key: 'ngay_ket_thuc_khuyen_mai',
      render: (text: string | null, record: Variant) => (
        <DatePicker
          value={text ? dayjs(text) : null}
          onChange={(_, dateString) => handleUpdate(record, 'ngay_ket_thuc_khuyen_mai', dateString || null)}
          format="YYYY-MM-DD"
          disabledDate={(current) => {
            const startDate = record.ngay_bat_dau_khuyen_mai;
            return startDate ? current.isBefore(dayjs(startDate)) : false;
          }}
          className="rounded-md"
          placeholder="Chọn ngày kết thúc"
        />
      ),
    },
    {
      title: 'Ảnh biến thể',
      dataIndex: 'anh_bien_the',
      key: 'anh_bien_the',
      render: (_: any, record: Variant) => (
        <Upload
          listType="picture-card"
          fileList={record.anh_bien_the.map((img: any) => ({
            uid: img.id || `${record.id}-${Math.random()}`,
            name: img.name || 'image.png',
            status: 'done',
            url: img.duong_dan_anh || img.url,
          }))}
          onPreview={handlePreview}
          onRemove={(file) => handleRemoveImage(file, record)}
          onChange={(info) => handleImageChange(info, record)}
          beforeUpload={() => false}
          accept="image/*"
          multiple
        >
          {record.anh_bien_the.length >= 8 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
            </div>
          )}
        </Upload>
      ),
    }
  ], [handlePreview, handleRemoveImage, handleImageChange]);

  return (
    <>
      <Table 
        dataSource={variants} 
        columns={columns} 
        rowKey="id" 
        className="bg-white rounded-lg shadow-md"
        pagination={false}
      />
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default VariantForm;
