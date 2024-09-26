
// import React, { useState, useEffect } from 'react';
// import { PlusOutlined } from '@ant-design/icons';
// import { Button, Input, Table, Upload, Image, ColorPicker, Carousel, Empty } from 'antd';
// import type { UploadFile, UploadProps } from 'antd';

// const getBase64 = (file: File): Promise<string> =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });

// const BannerManagement = () => {
//   const [bannerTextData, setBannerTextData] = useState([
//     { key: 'Tiêu đề chính', value: 'Beyond Builder', color: '#000000' },
//     { key: 'tiêu đề phụ', value: 'FASHION SHOP.COM', color: '#000000' },
//     { key: 'văn bản quảng cáo', value: 'UPTO 40% OFF', color: '#000000' },
//     { key: 'tiêu đề nút', value: 'Shop Now', color: '#FFFFFF' },
//   ]);

//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');
//   const [fileList, setFileList] = useState<UploadFile[]>([]);
//   const [backgroundColor, setBackgroundColor] = useState('#E6E6FA');
//   const [accentColor, setAccentColor] = useState('#FFD700');
//   const [bannerImageUrls, setBannerImageUrls] = useState<string[]>([]);


//   useEffect(() => {
//     const loadImages = async () => {
//       const urls = await Promise.all(
//         fileList.map(async (file) => {
//           if (file.originFileObj) {
//             return await getBase64(file.originFileObj);
//           }
//           return '';
//         })
//       );
//       setBannerImageUrls(urls.filter((url) => url !== ''));
//     };
//     loadImages();
//   }, [fileList]);
  
//   const handlePreview = async (file: UploadFile) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj as File);
//     }
//     setPreviewImage(file.url || (file.preview as string));
//     setPreviewOpen(true);
//   };

//   const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
//     setFileList(newFileList);

//   const handleTextChange = (key: string, newValue: string) => {
//     setBannerTextData(prevData =>
//       prevData.map(item =>
//         item.key === key ? { ...item, value: newValue } : item
//       )
//     );
//   };
//   const handleRemove = (file: UploadFile) => {
//     if (fileList.length <= 3) {
//       return false;
//     }
//     return true;
//   };
//   const handleColorChange = (key: string, newColor: string) => {
//     setBannerTextData(prevData =>
//       prevData.map(item =>
//         item.key === key ? { ...item, color: newColor } : item
//       )
//     );
//   };

//   const uploadButton = (
//     <button style={{ border: 0, background: 'none' }} type="button">
//       <PlusOutlined />
//       <div style={{ marginTop: 8 }}>Upload</div>
//     </button>
//   );

//   return (
//     <div className="p-4 grid grid-cols-2 gap-4">
//       <div className="flex flex-col space-y-9">
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Ảnh Banner</h2>
//           <Upload
//             action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
//             listType="picture-card"
//             fileList={fileList}
//             onPreview={handlePreview}
//             onChange={handleChange}
//             onRemove={handleRemove}
//           >
//             {fileList.length >= 4 ? null : uploadButton}
//           </Upload>
//           {previewImage && (
//             <Image
//               wrapperStyle={{ display: 'none' }}
//               preview={{
//                 visible: previewOpen,
//                 onVisibleChange: (visible) => setPreviewOpen(visible),
//                 afterOpenChange: (visible) => !visible && setPreviewImage(''),
//               }}
//               src={previewImage}
//             />
//           )}
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold mb-2">Nội dung banner</h2>
//           <Table dataSource={bannerTextData} pagination={false}>
//             <Table.Column title="Key" dataIndex="key" key="key" />
//             <Table.Column
//               title="Value"
//               dataIndex="value"
//               key="value"
//               render={(text, record) => (
//                 <Input
//                   defaultValue={text}
//                   onChange={(e) => handleTextChange(record.key, e.target.value)}
//                 />
//               )}
//             />
//             <Table.Column
//               title="Color"
//               key="color"
//               render={(text, record) => (
//                 <ColorPicker
//                   value={record.color}
//                   onChange={(color) => handleColorChange(record.key, color.toHexString())}
//                 />
//               )}
//             />
//           </Table>
//         </div>
//       </div>

//       <div className="flex flex-col space-y-4">
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Màu Banner</h2>
//           <div className="flex space-x-4">
//             <div>
//               <p>Màu button</p>
//               <ColorPicker value={accentColor} onChange={(color) => setAccentColor(color.toHexString())} />
//             </div>
//           </div>
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold mb-2">Xem trước</h2>
//           {bannerImageUrls.length > 0 ? (
//             <Carousel autoplay>
//               {bannerImageUrls.map((url, index) => (
//                 <div key={index}>
//                   <div
//                     style={{
//                       backgroundColor: backgroundColor,
//                       padding: '10px',
//                       borderRadius: '8px',
//                       position: 'relative',
//                       overflow: 'hidden',
//                       height: '300px',
//                       width: '100%',
//                     }}
//                   >
//                     <img
//                       src={url}
//                       alt={`Banner preview ${index}`}
//                       style={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         width: '100%',
//                         height: '100%',
//                         objectFit: 'cover',
//                         zIndex: 0,
//                       }}
//                     />
//                     <div className="absolute top-[100px] left-16">
//                       <div className="mb-4">
//                         <p
//                           className="font-semibold text-sm mb-2"
//                           style={{ color: bannerTextData[0].color }}
//                         >
//                           {bannerTextData[0].value}
//                         </p>
//                         <p
//                           className="text-xl font-bold mb-2 tracking-[1px]"
//                           style={{ color: bannerTextData[1].color }}
//                         >
//                           {bannerTextData[1].value}
//                         </p>
//                         <p
//                           className="text-base font-medium uppercase"
//                           style={{ color: bannerTextData[2].color }}
//                         >
//                           {bannerTextData[2].value}
//                         </p>
//                       </div>
//                       <div>
//                         <button
//                           className="px-4 py-2 rounded-lg shadow-2xl shadow-slate-500/50 hover:bg-white hover:text-black font-medium"
//                           style={{ backgroundColor: accentColor, color: bannerTextData[3].color }}
//                         >
//                           {bannerTextData[3].value}
//                           <i className="fa-solid fa-arrow-right ml-2"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </Carousel>
//           ) : (
//             <div className="flex items-center justify-center h-full" style={{ marginTop: 40 }}>
//               <Empty description="Không có dữ liệu" />
//             </div>
//           )}
//         </div>
//       </div>

//       <Button className="col-span-2 mt-4">Lưu thay đổi</Button>
//     </div>
//   );
// };

// export default BannerManagement;
// import React, { useEffect, useState } from 'react';
// import instance from "@/configs/axios";

// const BannerComponent = () => {
//   const [banners, setBanners] = useState([]);

//   // Fetch dữ liệu từ API khi component được mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await instance.get('/admin/thong-tin-web');
        
//         // Kiểm tra nếu API trả về status là true
//         if (response.data.status) {
//           // Parse chuỗi JSON banner
//           const bannerData = JSON.parse(response.data.data.banner);
//           console.error(bannerData);

//           setBanners(bannerData);  // Lưu vào state
//         }
//       } catch (error) {
//         console.error('Lỗi khi lấy dữ liệu:', error);
//       }
//     };

//     fetchData();
//   }, []); // Mảng trống để đảm bảo chỉ chạy một lần khi component mount

//   return (
//     <div>
//       <h1>Banners</h1>
//       <div className="banner-list">
//         {banners.map((banner) => (
//           <div key={banner.id} className="banner-item" style={{ backgroundImage: `url(${banner.duong_dan})` }}>
//             <h2 style={{ color: banner.mau_tieu_de_chinh }}>{banner.tieu_de_chinh}</h2>
//             <p style={{ color: banner.mau_tieu_de_phu }}>{banner.tieu_de_phu}</p>
//             <p style={{ color: banner.mau_van_ban_quang_cao }}>{banner.van_ban_quang_cao}</p>
//             <button style={{ backgroundColor: banner.mau_nut }}>{banner.tieu_de_nut}</button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BannerComponent;
// import React, { useState, useEffect } from 'react';
// import { PlusOutlined } from '@ant-design/icons';
// import { Button, Input, Table, Upload, Image, ColorPicker, Carousel, Empty, message } from 'antd';
// import type { UploadFile, UploadProps } from 'antd';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import instance from "@/configs/axios";

// const getBase64 = (file: File): Promise<string> =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });

// interface BannerData {
//   noi_dung: {
//     mau_nut: string;
//     tieu_de_nut: string;
//     tieu_de_phu: string;
//     tieu_de_chinh: string;
//     mau_tieu_de_phu: string;
//     mau_tieu_de_chinh: string;
//     van_ban_quang_cao: string;
//     mau_van_ban_quang_cao: string;
//   };
//   duong_dan_anh: string[] | string;
// }

// const BannerManagement: React.FC = () => {
//   const queryClient = useQueryClient();

//   const { data: bannerDataResponse, isLoading, isError } = useQuery({
//     queryKey: ['bannerData'],
//     queryFn: async () => {
//       const response = await instance.get('/admin/thong-tin-web');
//       console.log('API response:', response.data);
//       return response.data;
//     },
//   });

//   const [bannerData, setBannerData] = useState<BannerData | null>(null);
//   const [bannerTextData, setBannerTextData] = useState([
//     { key: 'Tiêu đề chính', value: '', color: '' },
//     { key: 'tiêu đề phụ', value: '', color: '' },
//     { key: 'văn bản quảng cáo', value: '', color: '' },
//     { key: 'tiêu đề nút', value: '', color: '' },
//   ]);

//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');
//   const [fileList, setFileList] = useState<UploadFile[]>([]);
//   const [accentColor, setAccentColor] = useState('#000000');

//   useEffect(() => {
//     console.log("bannerDataResponse:", bannerDataResponse);
//     if (bannerDataResponse && bannerDataResponse.data && bannerDataResponse.data.banner) {
//       try {
//         const parsedBanner = JSON.parse(bannerDataResponse.data.banner);
//         if (Array.isArray(parsedBanner) && parsedBanner.length > 0) {
//           setBannerData(parsedBanner[0]);
//         }
//       } catch (error) {
//         console.error("Error parsing banner data:", error);
//         message.error("Error loading banner data");
//       }
//     }
//   }, [bannerDataResponse]);

//   useEffect(() => {
//     console.log("bannerData:", bannerData);
//     if (bannerData) {
//       setBannerTextData([
//         { key: 'Tiêu đề chính', value: bannerData.noi_dung?.tieu_de_chinh || '', color: bannerData.noi_dung?.mau_tieu_de_chinh || '' },
//         { key: 'tiêu đề phụ', value: bannerData.noi_dung?.tieu_de_phu || '', color: bannerData.noi_dung?.mau_tieu_de_phu || '' },
//         { key: 'văn bản quảng cáo', value: bannerData.noi_dung?.van_ban_quang_cao || '', color: bannerData.noi_dung?.mau_van_ban_quang_cao || '' },
//         { key: 'tiêu đề nút', value: bannerData.noi_dung?.tieu_de_nut || '', color: bannerData.noi_dung?.mau_nut || '' },
//       ]);
//       setAccentColor(bannerData.noi_dung?.mau_nut || '#000000');
      
//       if (Array.isArray(bannerData.duong_dan_anh)) {
//         setFileList(bannerData.duong_dan_anh.map((url, index) => ({
//           uid: `-${index}`,
//           name: `image-${index}`,
//           status: 'done',
//           url: url,
//         })));
//       } else if (typeof bannerData.duong_dan_anh === 'string') {
//         setFileList([{
//           uid: '-1',
//           name: 'image',
//           status: 'done',
//           url: bannerData.duong_dan_anh,
//         }]);
//       } else {
//         console.error("Invalid duong_dan_anh data:", bannerData.duong_dan_anh);
//         setFileList([]);
//       }
//     }
//   }, [bannerData]);

//   const handlePreview = async (file: UploadFile) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj as File);
//     }
//     setPreviewImage(file.url || (file.preview as string));
//     setPreviewOpen(true);
//   };

//   const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
//     setFileList(newFileList);

//   const handleTextChange = (key: string, newValue: string) => {
//     setBannerTextData(prevData =>
//       prevData.map(item =>
//         item.key === key ? { ...item, value: newValue } : item
//       )
//     );
//   };

//   const handleRemove = (file: UploadFile) => {
//     return fileList.length > 3;
//   };

//   const handleColorChange = (key: string, newColor: string) => {
//     setBannerTextData(prevData =>
//       prevData.map(item =>
//         item.key === key ? { ...item, color: newColor } : item
//       )
//     );
//   };

//   const mutation = useMutation({
//     mutationFn: (newBannerData: BannerData[]) => {
//       return instance.post('/admin/thong-tin-web', { 
//         banner: newBannerData
//       });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['bannerData'] });
//       message.success('Banner updated successfully');
//     },
//     onError: (error: any) => {
//       if (error.response && error.response.data && error.response.data.errors) {
//         const errorMessages = Object.values(error.response.data.errors).flat();
//         errorMessages.forEach((msg: string) => message.error(msg));
//       } else {
//         message.error('Failed to update banner');
//       }
//     },
//   });

//   const handleSave = () => {
//     if (!bannerData) return;

//     const newBannerData: BannerData = {
//       duong_dan_anh: fileList.map(file => file.url || ''),
//       noi_dung: {
//         mau_nut: accentColor,
//         tieu_de_nut: bannerTextData[3].value,
//         tieu_de_phu: bannerTextData[1].value,
//         tieu_de_chinh: bannerTextData[0].value,
//         mau_tieu_de_phu: bannerTextData[1].color,
//         mau_tieu_de_chinh: bannerTextData[0].color,
//         van_ban_quang_cao: bannerTextData[2].value,
//         mau_van_ban_quang_cao: bannerTextData[2].color,
//       },
//     };
//     mutation.mutate([newBannerData]);
//   };

//   if (isLoading || !bannerData) return <div>Loading...</div>;
//   if (isError) return <div>Error loading banner data</div>;

//   const uploadButton = (
//     <button style={{ border: 0, background: 'none' }} type="button">
//       <PlusOutlined />
//       <div style={{ marginTop: 8 }}>Upload</div>
//     </button>
//   );

//   return (
//     <div className="p-4 grid grid-cols-2 gap-4">
//       <div className="flex flex-col space-y-9">
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Ảnh Banner</h2>
//           <Upload
//             action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
//             listType="picture-card"
//             fileList={fileList}
//             onPreview={handlePreview}
//             onChange={handleChange}
//             onRemove={handleRemove}
//           >
//             {fileList.length >= 4 ? null : uploadButton}
//           </Upload>
//           {previewImage && (
//             <Image
//               wrapperStyle={{ display: 'none' }}
//               preview={{
//                 visible: previewOpen,
//                 onVisibleChange: (visible) => setPreviewOpen(visible),
//                 afterOpenChange: (visible) => !visible && setPreviewImage(''),
//               }}
//               src={previewImage}
//             />
//           )}
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold mb-2">Nội dung banner</h2>
//           <Table dataSource={bannerTextData} pagination={false}>
//             <Table.Column title="Key" dataIndex="key" key="key" />
//             <Table.Column
//               title="Value"
//               dataIndex="value"
//               key="value"
//               render={(text, record: any) => (
//                 <Input
//                   value={text}
//                   onChange={(e) => handleTextChange(record.key, e.target.value)}
//                 />
//               )}
//             />
//             <Table.Column
//               title="Color"
//               key="color"
//               render={(text, record: any) => (
//                 <ColorPicker
//                   value={record.color}
//                   onChange={(color) => handleColorChange(record.key, color.toHexString())}
//                 />
//               )}
//             />
//           </Table>
//         </div>
//       </div>

//       <div className="flex flex-col space-y-4">
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Màu Banner</h2>
//           <div className="flex space-x-4">
//             <div>
//               <p>Màu button</p>
//               <ColorPicker value={accentColor} onChange={(color) => setAccentColor(color.toHexString())} />
//             </div>
//           </div>
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold mb-2">Xem trước</h2>
//           {fileList.length > 0 ? (
//             <Carousel autoplay>
//               {fileList.map((file, index) => (
//                 <div key={index}>
//                   <div
//                     style={{
//                       padding: '10px',
//                       borderRadius: '8px',
//                       position: 'relative',
//                       overflow: 'hidden',
//                       height: '300px',
//                       width: '100%',
//                     }}
//                   >
//                     <img
//                       src={file.url || ''}
//                       alt={`Banner preview ${index}`}
//                       style={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         width: '100%',
//                         height: '100%',
//                         objectFit: 'cover',
//                         zIndex: 0,
//                       }}
//                     />
//                     <div className="absolute top-[100px] left-16">
//                       <div className="mb-4">
//                         <p
//                           className="font-semibold text-sm mb-2"
//                           style={{ color: bannerTextData[0].color }}
//                         >
//                           {bannerTextData[0].value}
//                         </p>
//                         <p
//                           className="text-xl font-bold mb-2 tracking-[1px]"
//                           style={{ color: bannerTextData[1].color }}
//                         >
//                           {bannerTextData[1].value}
//                         </p>
//                         <p
//                           className="text-base font-medium uppercase"
//                           style={{ color: bannerTextData[2].color }}
//                         >
//                           {bannerTextData[2].value}
//                         </p>
//                       </div>
//                       <div>
//                         <button
//                           className="px-4 py-2 rounded-lg shadow-2xl shadow-slate-500/50 hover:bg-white hover:text-black font-medium"
//                           style={{ backgroundColor: accentColor, color: bannerTextData[3].color }}
//                         >
//                           {bannerTextData[3].value}
//                           <i className="fa-solid fa-arrow-right ml-2"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </Carousel>
//           ) : (
//             <div className="flex items-center justify-center h-full" style={{ marginTop: 40 }}>
//               <Empty description="Không có dữ liệu" />
//             </div>
//           )}
//         </div>
//       </div>

//       <Button className="col-span-2 mt-4" onClick={handleSave}>Lưu thay đổi</Button>
//     </div>
//   );
// };

// export default BannerManagement;
// import React, { useState, useEffect } from 'react';
// import { PlusOutlined } from '@ant-design/icons';
// import { Button, Input, Table, Upload, Image, ColorPicker, Carousel, Empty, message } from 'antd';
// import type { UploadFile, UploadProps } from 'antd';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import instance from "@/configs/axios";

// const getBase64 = (file: File): Promise<string> =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });

// interface BannerData {
//   noi_dung: {
//     mau_nut: string;
//     tieu_de_nut: string;
//     tieu_de_phu: string;
//     tieu_de_chinh: string;
//     mau_tieu_de_phu: string;
//     mau_tieu_de_chinh: string;
//     van_ban_quang_cao: string;
//     mau_van_ban_quang_cao: string;
//   };
//   duong_dan_anh: string[] | string;
// }

// const BannerManagement: React.FC = () => {
//   const queryClient = useQueryClient();

//   const { data: bannerDataResponse, isLoading, isError } = useQuery({
//     queryKey: ['bannerData'],
//     queryFn: async () => {
//       const response = await instance.get('/admin/thong-tin-web');
//       console.log('API response:', response.data);
//       return response.data;
//     },
//   });

//   const [bannerData, setBannerData] = useState<BannerData | null>(null);
//   const [bannerTextData, setBannerTextData] = useState([
//     { key: 'Tiêu đề chính', value: '', color: '' },
//     { key: 'tiêu đề phụ', value: '', color: '' },
//     { key: 'văn bản quảng cáo', value: '', color: '' },
//     { key: 'tiêu đề nút', value: '', color: '' },
//   ]);

//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');
//   const [fileList, setFileList] = useState<UploadFile[]>([]);
//   const [accentColor, setAccentColor] = useState('#000000');

//   useEffect(() => {
//     console.log("bannerDataResponse:", bannerDataResponse);
//     if (bannerDataResponse && bannerDataResponse.data && bannerDataResponse.data.banner) {
//       try {
//         const parsedBanner = JSON.parse(bannerDataResponse.data.banner);
//         if (Array.isArray(parsedBanner) && parsedBanner.length > 0) {
//           setBannerData(parsedBanner[0]);
//         }
//       } catch (error) {
//         console.error("Error parsing banner data:", error);
//         message.error("Error loading banner data");
//       }
//     }
//   }, [bannerDataResponse]);

//   useEffect(() => {
//     console.log("bannerData:", bannerData);
//     if (bannerData) {
//       setBannerTextData([
//         { key: 'Tiêu đề chính', value: bannerData.noi_dung?.tieu_de_chinh || '', color: bannerData.noi_dung?.mau_tieu_de_chinh || '' },
//         { key: 'tiêu đề phụ', value: bannerData.noi_dung?.tieu_de_phu || '', color: bannerData.noi_dung?.mau_tieu_de_phu || '' },
//         { key: 'văn bản quảng cáo', value: bannerData.noi_dung?.van_ban_quang_cao || '', color: bannerData.noi_dung?.mau_van_ban_quang_cao || '' },
//         { key: 'tiêu đề nút', value: bannerData.noi_dung?.tieu_de_nut || '', color: bannerData.noi_dung?.mau_nut || '' },
//       ]);
//       setAccentColor(bannerData.noi_dung?.mau_nut || '#000000');
      
//       if (Array.isArray(bannerData.duong_dan_anh)) {
//         setFileList(bannerData.duong_dan_anh.map((url, index) => ({
//           uid: `-${index}`,
//           name: `image-${index}`,
//           status: 'done',
//           url: url,
//         })));
//       } else if (typeof bannerData.duong_dan_anh === 'string') {
//         setFileList([{
//           uid: '-1',
//           name: 'image',
//           status: 'done',
//           url: bannerData.duong_dan_anh,
//         }]);
//       } else {
//         console.error("Invalid duong_dan_anh data:", bannerData.duong_dan_anh);
//         setFileList([]);
//       }
//     }
//   }, [bannerData]);

//   const handlePreview = async (file: UploadFile) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj as File);
//     }
//     setPreviewImage(file.url || (file.preview as string));
//     setPreviewOpen(true);
//   };

//   const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
//     const updatedFileList = newFileList.map(file => {
//       if (file.originFileObj) {
//         return {
//           ...file,
//           url: URL.createObjectURL(file.originFileObj),
//         };
//       }
//       return file;
//     });
//     setFileList(updatedFileList);
//   };

//   const handleTextChange = (key: string, newValue: string) => {
//     setBannerTextData(prevData =>
//       prevData.map(item =>
//         item.key === key ? { ...item, value: newValue } : item
//       )
//     );
//   };

//   const handleRemove = (file: UploadFile) => {
//     return fileList.length > 3;
//   };

//   const handleColorChange = (key: string, newColor: string) => {
//     setBannerTextData(prevData =>
//       prevData.map(item =>
//         item.key === key ? { ...item, color: newColor } : item
//       )
//     );
//   };

//   const mutation = useMutation({
//     mutationFn: (newBannerData: BannerData[]) => {
//       return instance.post('/admin/thong-tin-web', { 
//         banner: newBannerData
//       });
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['bannerData'] });
//       message.success('Banner updated successfully');
//     },
//     onError: (error: any) => {
//       if (error.response && error.response.data && error.response.data.errors) {
//         const errorMessages = Object.values(error.response.data.errors).flat();
//         errorMessages.forEach((msg: string) => message.error(msg));
//       } else {
//         message.error('Failed to update banner');
//       }
//     },
//   });

//   const handleSave = () => {
//     if (!bannerData) return;

//     const newBannerData: BannerData = {
//       duong_dan_anh: fileList.map(file => file.url || ''),
//       noi_dung: {
//         mau_nut: accentColor,
//         tieu_de_nut: bannerTextData[3].value,
//         tieu_de_phu: bannerTextData[1].value,
//         tieu_de_chinh: bannerTextData[0].value,
//         mau_tieu_de_phu: bannerTextData[1].color,
//         mau_tieu_de_chinh: bannerTextData[0].color,
//         van_ban_quang_cao: bannerTextData[2].value,
//         mau_van_ban_quang_cao: bannerTextData[2].color,
//       },
//     };

//     const filePromises = fileList.map(file => {
//       if (file.originFileObj) {
//         return getBase64(file.originFileObj);
//       }
//       return Promise.resolve(file.url);
//     });

//     Promise.all(filePromises).then(base64Images => {
//       newBannerData.duong_dan_anh = base64Images;
//       mutation.mutate([newBannerData]);
//     });
//   };

//   if (isLoading || !bannerData) return <div>Loading...</div>;
//   if (isError) return <div>Error loading banner data</div>;

//   const uploadButton = (
//     <button style={{ border: 0, background: 'none' }} type="button">
//       <PlusOutlined />
//       <div style={{ marginTop: 8 }}>Upload</div>
//     </button>
//   );

//   return (
//     <div className="p-4 grid grid-cols-2 gap-4">
//       <div className="flex flex-col space-y-9">
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Ảnh Banner</h2>
//           <Upload
//             listType="picture-card"
//             fileList={fileList}
//             onPreview={handlePreview}
//             onChange={handleChange}
//             onRemove={handleRemove}
//             beforeUpload={() => false}
//           >
//             {fileList.length >= 4 ? null : uploadButton}
//           </Upload>
//           {previewImage && (
//             <Image
//               style={{ display: 'none' }}
//               src={previewImage}
//               preview={{
//                 visible: previewOpen,
//                 onVisibleChange: (visible) => setPreviewOpen(visible),
//               }}
//             />
//           )}
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold mb-2">Nội dung banner</h2>
//           <Table dataSource={bannerTextData} pagination={false}>
//             <Table.Column title="Key" dataIndex="key" key="key" />
//             <Table.Column
//               title="Value"
//               dataIndex="value"
//               key="value"
//               render={(text, record: any) => (
//                 <Input
//                   value={text}
//                   onChange={(e) => handleTextChange(record.key, e.target.value)}
//                 />
//               )}
//             />
//             <Table.Column
//               title="Color"
//               key="color"
//               render={(text, record: any) => (
//                 <ColorPicker
//                   value={record.color}
//                   onChange={(color) => handleColorChange(record.key, color.toHexString())}
//                 />
//               )}
//             />
//           </Table>
//         </div>
//       </div>

//       <div className="flex flex-col space-y-4">
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Màu Banner</h2>
//           <div className="flex space-x-4">
//             <div>
//               <p>Màu button</p>
//               <ColorPicker value={accentColor} onChange={(color) => setAccentColor(color.toHexString())} />
//             </div>
//           </div>
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold mb-2">Xem trước</h2>
//           {fileList.length > 0 ? (
//             <Carousel autoplay>
//               {fileList.map((file, index) => (
//                 <div key={index}>
//                   <div
//                     style={{
//                       padding: '10px',
//                       borderRadius: '8px',
//                       position: 'relative',
//                       overflow: 'hidden',
//                       height: '300px',
//                       width: '100%',
//                     }}
//                   >
//                     <img
//                       src={file.url || ''}
//                       alt={`Banner preview ${index}`}
//                       style={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         width: '100%',
//                         height: '100%',
//                         objectFit: 'cover',
//                         zIndex: 0,
//                       }}
//                     />
//                     <div className="absolute top-[100px] left-16">
//                       <div className="mb-4">
//                         <p
//                           className="font-semibold text-sm mb-2"
//                           style={{ color: bannerTextData[0].color }}
//                         >
//                           {bannerTextData[0].value}
//                         </p>
//                         <p
//                           className="text-xl font-bold mb-2 tracking-[1px]"
//                           style={{ color: bannerTextData[1].color }}
//                         >
//                           {bannerTextData[1].value}
//                         </p>
//                         <p
//                           className="text-base font-medium uppercase"
//                           style={{ color: bannerTextData[2].color }}
//                         >
//                           {bannerTextData[2].value}
//                         </p>
//                       </div>
//                       <div>
//                         <button
//                           className="px-4 py-2 rounded-lg shadow-2xl shadow-slate-500/50 hover:bg-white hover:text-black font-medium"
//                           style={{ backgroundColor: accentColor, color: bannerTextData[3].color }}
//                         >
//                           {bannerTextData[3].value}
//                           <i className="fa-solid fa-arrow-right ml-2"></i>
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </Carousel>
//           ) : (
//             <div className="flex items-center justify-center h-full" style={{ marginTop: 40 }}>
//               <Empty description="Không có dữ liệu" />
//             </div>
//           )}
//         </div>
//       </div>

//       <Button className="col-span-2 mt-4" onClick={handleSave}>Lưu thay đổi</Button>
//     </div>
//   );
// };

// export default BannerManagement;
import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Table, Upload, Image, ColorPicker, Carousel, Empty, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import instance from "@/configs/axios";
import { uploadToCloudinary } from '@/configs/cloudinary';

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
  };
  duong_dan_anh: string[] | string;
}

const BannerManagement: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: bannerDataResponse, isLoading, isError } = useQuery({
    queryKey: ['bannerData'],
    queryFn: async () => {
      const response = await instance.get('/admin/thong-tin-web');
      console.log('API response:', response.data);
      return response.data;
    },
  });

  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [bannerTextData, setBannerTextData] = useState([
    { key: 'Tiêu đề chính', value: '', color: '' },
    { key: 'tiêu đề phụ', value: '', color: '' },
    { key: 'văn bản quảng cáo', value: '', color: '' },
    { key: 'tiêu đề nút', value: '', color: '' },
  ]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [accentColor, setAccentColor] = useState('#000000');

  useEffect(() => {
    if (bannerDataResponse && bannerDataResponse.data && bannerDataResponse.data.banner) {
      try {
        const parsedBanner = JSON.parse(bannerDataResponse.data.banner);
        if (Array.isArray(parsedBanner) && parsedBanner.length > 0) {
          setBannerData(parsedBanner[0]);
        }
      } catch (error) {
        console.error("Error parsing banner data:", error);
        message.error("Error loading banner data");
      }
    }
  }, [bannerDataResponse]);

  useEffect(() => {
    if (bannerData) {
      setBannerTextData([
        { key: 'Tiêu đề chính', value: bannerData.noi_dung?.tieu_de_chinh || '', color: bannerData.noi_dung?.mau_tieu_de_chinh || '' },
        { key: 'tiêu đề phụ', value: bannerData.noi_dung?.tieu_de_phu || '', color: bannerData.noi_dung?.mau_tieu_de_phu || '' },
        { key: 'văn bản quảng cáo', value: bannerData.noi_dung?.van_ban_quang_cao || '', color: bannerData.noi_dung?.mau_van_ban_quang_cao || '' },
        { key: 'tiêu đề nút', value: bannerData.noi_dung?.tieu_de_nut || '', color: bannerData.noi_dung?.mau_nut || '' },
      ]);
      setAccentColor(bannerData.noi_dung?.mau_nut || '#000000');
      
      if (Array.isArray(bannerData.duong_dan_anh)) {
        setFileList(bannerData.duong_dan_anh.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done',
          url: url,
        })));
      } else if (typeof bannerData.duong_dan_anh === 'string') {
        setFileList([{
          uid: '-1',
          name: 'image',
          status: 'done',
          url: bannerData.duong_dan_anh,
        }]);
      } else {
        console.error("Invalid duong_dan_anh data:", bannerData.duong_dan_anh);
        setFileList([]);
      }
    }
  }, [bannerData]);

  const handlePreview = async (file: UploadFile) => {
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    const updatedFileList = await Promise.all(newFileList.map(async (file) => {
      if (file.originFileObj && !file.url) {
        try {
          const cloudinaryUrl = await uploadToCloudinary(file.originFileObj);
          return { ...file, status: 'done', url: cloudinaryUrl };
        } catch (error) {
          console.error("Error uploading to Cloudinary:", error);
          return { ...file, status: 'error' };
        }
      }
      return file;
    }));

    setFileList(updatedFileList);
  };

  const handleTextChange = (key: string, newValue: string) => {
    setBannerTextData(prevData =>
      prevData.map(item =>
        item.key === key ? { ...item, value: newValue } : item
      )
    );
  };

  const handleRemove = (file: UploadFile) => {
    return fileList.length > 3;
  };

  const handleColorChange = (key: string, newColor: string) => {
    setBannerTextData(prevData =>
      prevData.map(item =>
        item.key === key ? { ...item, color: newColor } : item
      )
    );
  };

  const mutation = useMutation({
    mutationFn: (newBannerData: BannerData[]) => {
      return instance.post('/admin/thong-tin-web', { 
        banner: newBannerData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bannerData'] });
      message.success('Banner updated successfully');
    },
    onError: (error: any) => {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        errorMessages.forEach((msg: string) => message.error(msg));
      } else {
        message.error('Failed to update banner');
      }
    },
  });

  const handleSave = () => {
    if (!bannerData) return;

    const newBannerData: BannerData = {
      duong_dan_anh: fileList.map(file => file.url || ''),
      noi_dung: {
        mau_nut: accentColor,
        tieu_de_nut: bannerTextData[3].value,
        tieu_de_phu: bannerTextData[1].value,
        tieu_de_chinh: bannerTextData[0].value,
        mau_tieu_de_phu: bannerTextData[1].color,
        mau_tieu_de_chinh: bannerTextData[0].color,
        van_ban_quang_cao: bannerTextData[2].value,
        mau_van_ban_quang_cao: bannerTextData[2].color,
      },
    };

    mutation.mutate([newBannerData]);
  };

  if (isLoading || !bannerData) return <div>Loading...</div>;
  if (isError) return <div>Error loading banner data</div>;

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      <div className="flex flex-col space-y-9">
        <div>
          <h2 className="text-xl font-semibold mb-2">Ảnh Banner</h2>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            onRemove={handleRemove}
            beforeUpload={() => false}
          >
            {fileList.length >= 4 ? null : uploadButton}
          </Upload>
          {previewImage && (
            <Image
              style={{ display: 'none' }}
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
              render={(text, record: any) => (
                <ColorPicker
                  value={record.color}
                  onChange={(color) => handleColorChange(record.key, color.toHexString())}
                />
              )}
            />
          </Table>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Màu Banner</h2>
          <div className="flex space-x-4">
            <div>
              <p>Màu button</p>
              <ColorPicker value={accentColor} onChange={(color) => setAccentColor(color.toHexString())} />
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
                      padding: '10px',
                      borderRadius: '8px',
                      position: 'relative',
                      overflow: 'hidden',
                      height: '300px',
                      width: '100%',
                    }}
                  >
                    <img
                      src={file.url || ''}
                      alt={`Banner preview ${index}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
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
                          style={{ backgroundColor: accentColor, color: bannerTextData[3].color }}
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
            <div className="flex items-center justify-center h-full" style={{ marginTop: 40 }}>
              <Empty description="Không có dữ liệu" />
            </div>
          )}
        </div>
      </div>

      <Button className="col-span-2 mt-4" onClick={handleSave}>Lưu thay đổi</Button>
    </div>
  );
};

export default BannerManagement;
