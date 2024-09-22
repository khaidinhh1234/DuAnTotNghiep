
// import React, { useState } from "react";
// import { Table, Input, DatePicker, Upload, Modal } from "antd";
// import { PlusOutlined } from '@ant-design/icons';
// import dayjs, { Dayjs } from 'dayjs';import { VariantFormProps, Variant, VariantPull } from "@/common/types/product";
// import '@/global.css'

// const VariantForm: React.FC<VariantFormProps> = ({ 
//   variants, 
//   updateVariant, 
//   handleRemoveImage, 
//   handleImageChange,
//   colorsData,
//   sizesData
// }) => {
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');
//   const [previewTitle, setPreviewTitle] = useState('');
//   const handlePreview = async (file: any) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }

//     setPreviewImage(file.url || file.preview);
//     setPreviewOpen(true);
//     setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
//   };
//   const getBase64 = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = error => reject(error);
//     });
//   };

//   const handleUpdate = (record: Variant, field: keyof Variant, value: any) => {
//     const update: VariantPull = { [field]: value };
//     updateVariant({ ...record, ...update });
//   };

//   const columns = [
//     {
//       title: 'Kích thước',
//       dataIndex: ['kich_thuoc_bien_the', 'kich_thuoc'],
//       key: 'kich_thuoc',
//       render: (_: any, record: Variant) => {
//         const size = sizesData.find(s => s.id === record.bien_the_kich_thuoc_id);
//         return size ? size.kich_thuoc : '';
//       },
//     },
//     {
//       title: 'Màu sắc',
//       dataIndex: ['mau_bien_the', 'ten_mau_sac'],
//       key: 'mau_sac',
//       render: (_: any, record: Variant) => {
//         const color = colorsData.find(c => c.id === record.bien_the_mau_sac_id);
//         return color ? color.ten_mau_sac : '';
//       },
//     },
//     {
//       title: 'Giá bán',
//       dataIndex: 'gia_ban',
//       key: 'gia_ban',
//       render: (text: string, record: Variant) => (
//         <Input
//           value={text}
//           onChange={(e) => handleUpdate(record, 'gia_ban', e.target.value)}
//           className="rounded-md"
//         />
//       ),
//     },
//     {
//       title: 'Giá khuyến mãi',
//       dataIndex: 'gia_khuyen_mai',
//       key: 'gia_khuyen_mai',
//       render: (text: string, record: Variant) => (
//         <Input
//           value={text}
//           onChange={(e) => handleUpdate(record, 'gia_khuyen_mai', e.target.value)}
//           className="rounded-md"
//         />
//       ),
//     },
//     {
//       title: 'Số lượng',
//       dataIndex: 'so_luong_bien_the',
//       key: 'so_luong_bien_the',
//       render: (text: string, record: Variant) => (
//         <Input
//           value={text}
//           onChange={(e) => handleUpdate(record, 'so_luong_bien_the', e.target.value)}
//           className="rounded-md"
//         />
//       ),
//     },
//     {
//       title: 'Ngày bắt đầu khuyến mãi',
//       dataIndex: 'ngay_bat_dau_khuyen_mai',
//       key: 'ngay_bat_dau_khuyen_mai',
//       render: (text: string | null, record: Variant) => (
//         <DatePicker
//           value={text ? dayjs(text) : null}
//           onChange={(_, dateString) => handleUpdate(record, 'ngay_bat_dau_khuyen_mai', dateString || null)}
//           format="YYYY-MM-DD"
//           className="rounded-md"
//         />
//       ),
//     },
//     {
//       title: 'Ngày kết thúc khuyến mãi',
//       dataIndex: 'ngay_ket_thuc_khuyen_mai',
//       key: 'ngay_ket_thuc_khuyen_mai',
//       render: (text: string | null, record: Variant) => (
//         <DatePicker
//           value={text ? dayjs(text) : null}
//           onChange={(_, dateString) => handleUpdate(record, 'ngay_ket_thuc_khuyen_mai', dateString || null)}
//           format="YYYY-MM-DD"
//           disabledDate={(current: Dayjs) => {
//             const startDate = record.ngay_bat_dau_khuyen_mai;
//             return startDate ? current.isBefore(dayjs(startDate)) : false;
//           }}
//           className="rounded-md"
//         />
//       ),
//     },
//     {
//       title: 'Ảnh biến thể',
//       dataIndex: 'anh_bien_the',
//       key: 'anh_bien_the',
//       render: (_: any, record: Variant) => (
//         <Upload
//           listType="picture-card"
//           fileList={record.anh_bien_the}
//           onPreview={handlePreview}
//           onRemove={(file) => handleRemoveImage(file, record)}
//           onChange={(info) => handleImageChange(info, record)}
//           beforeUpload={() => false}
//           className="custom-upload"
//         >
//           {record.anh_bien_the.length >= 8 ? null : (
//             <div>
//               <PlusOutlined />
//               <div style={{ marginTop: 8 }}></div>
//             </div>
//           )}
//         </Upload>
//       ),
//     }
//   ];

//   return (
//     <>
//     <Table 
//         dataSource={variants} 
//         columns={columns} 
//         rowKey="id" 
//         className="bg-white rounded-lg shadow-md"
//         pagination={false}
//       />
//       <Modal
//         open={previewOpen}
//         title={previewTitle}
//         footer={null}
//         onCancel={() => setPreviewOpen(false)}
//       >
//         <img alt="example" style={{ width: '100%' }} src={previewImage} />
//       </Modal>
//     </>
//   );
// };

// export default VariantForm;
import React, { useState } from "react";
import { Table, Input, DatePicker, Upload, Modal } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
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

  const columns = [
    {
      title: 'Kích thước',
      dataIndex: 'kich_thuoc_id',
      key: 'kich_thuoc',
      render: (sizeId: number) => {
        const size = sizesData.find(s => Number(s.id) === sizeId);
        return size ? size.kich_thuoc : '';
      },
    },
    {
      title: 'Màu sắc',
      dataIndex: 'mau_sac_id',
      key: 'mau_sac',
      render: (colorId: number) => {
        const color = colorsData.find(c => Number(c.id) === colorId);
        return color ? color.ten_mau_sac : '';
      },
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
      render: (text: string, record: Variant) => (
        <Input
          value={text}
          onChange={(e) => handleUpdate(record, 'gia_khuyen_mai', e.target.value)}
          className="rounded-md"
        />
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'so_luong_bien_the',
      key: 'so_luong_bien_the',
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
      render: (text: string | null, record: Variant) => (
        <DatePicker
          value={text ? dayjs(text) : null}
          onChange={(_, dateString) => handleUpdate(record, 'ngay_bat_dau_khuyen_mai', dateString || null)}
          format="YYYY-MM-DD"
          className="rounded-md"
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
          disabledDate={(current: Dayjs) => {
            const startDate = record.ngay_bat_dau_khuyen_mai;
            return startDate ? current.isBefore(dayjs(startDate)) : false;
          }}
          className="rounded-md"
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
          fileList={record.anh_bien_the}
          onPreview={handlePreview}
          onRemove={(file) => handleRemoveImage(file, record)}
          onChange={(info) => handleImageChange(info, record)}
          beforeUpload={() => false}
          className="custom-upload"
        >
          {record.anh_bien_the.length >= 8 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}></div>
            </div>
          )}
        </Upload>
      ),
    }
  ];

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
