import React, { useState, useMemo, useCallback } from "react";
import { Table, Input, DatePicker, Upload, Modal } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { UploadFile } from "antd/es/upload/interface";
import '@/global.css'
import { VariantFormProps, Variant, VariantPull } from "@/common/types/product";

const VariantForm: React.FC<VariantFormProps> = ({ 
  variants, 
  updateVariant, 
  handleRemoveImage, 
  handleImageChange,
  colorsData,
  sizesData
}) => {
  const [previewState, setPreviewState] = useState({
    open: false,
    image: '',
    title: ''
  });

  const handlePreview = useCallback(async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setPreviewState({
      open: true,
      image: file.url || (file.preview as string),
      title: file.name || (file.url && typeof file.url === 'string' ? file.url.substring(file.url.lastIndexOf('/') + 1) : 'Preview')
    });
  }, []);

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleUpdate = useCallback((record: Variant, field: keyof Variant, value: any) => {
    const update: VariantPull = { [field]: value };
    updateVariant({ ...record, ...update });
  }, [updateVariant]);

  const columns = useMemo(() => [
    {
      title: 'Kích thước',
      dataIndex: 'kich_thuoc_id',
      key: 'kich_thuoc',
      render: (sizeId: number) => sizesData.find(s => Number(s.id) === sizeId)?.kich_thuoc || 'Unknown size',
    },
    {
      title: 'Màu sắc',
      dataIndex: 'mau_sac_id',
      key: 'mau_sac',
      render: (colorId: number) => colorsData.find(c => Number(c.id) === colorId)?.ten_mau_sac || 'Unknown color',
    },
    {
      title: 'Giá bán',
      dataIndex: 'gia_ban',
      key: 'gia_ban',
      render: (text: string, record: Variant) => (
        <Input
          value={text}
          onChange={(e) => handleUpdate(record, 'gia_ban', e.target.value)}
          className="rounded-md"
        />
      ),
    },
    {
      title: 'Giá khuyến mãi',
      dataIndex: 'gia_khuyen_mai',
      key: 'gia_khuyen_mai',
      width: 150,
      render: (text: string, record: Variant) => (
        <Input
          value={text}
          onChange={(e) => handleUpdate(record, 'gia_khuyen_mai', e.target.value)
            
          }
          className="rounded-md"
        />
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'so_luong_bien_the',
      key: 'so_luong_bien_the',
      width: 150,
      render: (text: string, record: Variant) => (
        <Input
          value={text}
          onChange={(e) => handleUpdate(record, 'so_luong_bien_the', e.target.value)}
          className="rounded-md"
        />
      ),
    },
    {
      title: 'Ngày bắt đầu khuyến mãi',
      dataIndex: 'ngay_bat_dau_khuyen_mai',
      key: 'ngay_bat_dau_khuyen_mai',
      width: 150,

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
      width: 150,

      render: (text: string | null, record: Variant) => (
        <DatePicker
          value={text ? dayjs(text) : null}
          onChange={(_, dateString) => handleUpdate(record, 'ngay_ket_thuc_khuyen_mai', dateString || null)}
          format="YYYY-MM-DD"
          disabledDate={(current) => record.ngay_bat_dau_khuyen_mai ? current.isBefore(dayjs(record.ngay_bat_dau_khuyen_mai)) : false}
          className="rounded-md"
          placeholder="Chọn ngày kết thúc"
        />
      ),
    },
    {
      title: 'Ảnh biến thể',
      dataIndex: 'anh_bien_the',
      key: 'anh_bien_the',
      width: 200,
      render: (_: any, record: Variant) => (
        // <div className="image-upload-container" style={{ minHeight: '102px' }}>

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
          className="custom-upload"
        >
          {record.anh_bien_the.length < 8 && (
            <div>
              <PlusOutlined />
              <div style={{ marginTop:8 }}></div>
            </div>
          )}
        </Upload>
        // </div>
      ),
    }
  ], [handlePreview, handleRemoveImage, handleImageChange, handleUpdate, colorsData, sizesData]);

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
        open={previewState.open}
        title={previewState.title}
        footer={null}
        onCancel={() => setPreviewState(prev => ({ ...prev, open: false }))}
      >
        <img alt="example" style={{ width: '100%' }} src={previewState.image} />
      </Modal>
    </>
  );
};

export default VariantForm;
