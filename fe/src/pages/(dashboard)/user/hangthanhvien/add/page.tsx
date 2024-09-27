// // import React from 'react';
// // import { Form, Input, InputNumber, Upload, Button, Typography, message } from 'antd';
// // import { UploadOutlined } from '@ant-design/icons';
// // import { Link } from 'react-router-dom';

// // const { Title } = Typography;

// // const MemberRankForm = () => {
// //     const [form] = Form.useForm();

// //     const onFinish = (values) => {
// //         console.log('Form values:', values);
// //     };

// //     const validateUpload = (file) => {
// //         const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
// //         if (!isJpgOrPng) {
// //             message.error('Chỉ chấp nhận file JPG/PNG!');
// //         }
// //         const isLt1MB = file.size / 1024 / 1024 < 1;
// //         if (!isLt1MB) {
// //             message.error('Dung lượng phải nhỏ hơn 1MB!');
// //         }
// //         return isJpgOrPng && isLt1MB;
// //     };

// //     return (
// //         <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
// //             <div className="flex items-center">
// //                 <h1 className="md:text-base">
// //                     Quản trị / Danh mục /
// //                     <span className="font-semibold px-px"> Hạng thành viên</span>
// //                 </h1>
// //             </div>

// //             <div className="flex items-center justify-between">
// //                 <h1 className="font-semibold md:text-3xl">Thêm hạng thành viên</h1>
// //                 <div>
// //                     <Link to="/admin/users/rank" className="mr-1">
// //                         <Button className="ml-auto bg-black text-white rounded-lg py-1">
// //                             Quay lại
// //                         </Button>
// //                     </Link>
// //                 </div>
// //             </div>

// //             {/* Form Thêm hạng thành viên */}
// //             <div className="max-w-2xl ml-5 mt-6 p-6 bg-white shadow-md rounded-lg">
// //                 <Title level={3} className="mb-4">Tạo hạng thành viên mới</Title>
// //                 <hr />
// //                 <br />
// //                 <Form
// //                     form={form}
// //                     layout="vertical"
// //                     onFinish={onFinish}
// //                     className="space-y-4"
// //                 >
// //                     <Form.Item
// //                         name="rankName"
// //                         label="Tên hạng thành viên"
// //                         rules={[{ required: true, message: 'Vui lòng nhập tên hạng thành viên' }]}
// //                     >
// //                         <Input placeholder="Diamond" />
// //                     </Form.Item>

// //                     <Form.Item
// //                         name="rankImage"
// //                         label="Hình cho hạng thành viên"
// //                         valuePropName="fileList"
// //                         getValueFromEvent={(e) => e && e.fileList}
// //                     >
// //                         <Upload
// //                             accept="image/png,image/jpeg"
// //                             listType="picture"
// //                             maxCount={1}
// //                             beforeUpload={validateUpload}
// //                         >
// //                             <Button icon={<UploadOutlined />} size="middle" className="w-full">Tải lên</Button>
// //                         </Upload>
// //                     </Form.Item>
// //                     <p className="text-xs text-gray-500 mt-1">
// //                         Dung lượng &lt; 1MB. Kích thước 500x500 pixels. Định dạng: png, jpeg.
// //                     </p>

// //                     <div className="flex space-x-4">
// //                         <Form.Item
// //                             name="totalSpend"
// //                             label="chi tiêu tối thiểu (VND)"
// //                             rules={[{ required: true, message: 'Vui lòng nhập tổng chi tiêu' }]}
// //                             className="flex-1"
// //                         >
// //                             <InputNumber
// //                                 formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
// //                                 parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
// //                                 addonAfter="VND"
// //                                 className="w-full"
// //                             />
// //                         </Form.Item>

// //                         <Form.Item
// //                             name="totalSpend"
// //                             label="Chi tiêu tối đa (VND)"
// //                             rules={[{ required: true, message: 'Vui lòng nhập tổng chi tiêu' }]}
// //                             className="flex-1"
// //                         >
// //                             <InputNumber
// //                                 formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
// //                                 parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
// //                                 addonAfter="VND"
// //                                 className="w-full"
// //                             />
// //                         </Form.Item>
// //                     </div>
// //                     <div className="flex justify-start space-x-1 mt-6">
// //                         <Button type="primary" size="middle" htmlType="submit"
// //                             className="px-8 py-3 bg-black text-white rounded-lg"
// //                         >
// //                             Thêm
// //                         </Button>
// //                     </div>

// //                 </Form>
// //             </div>
// //         </main>
// //     );
// // };

// // export default MemberRankForm;
// import React, { useState } from 'react';
// import { Form, Input, InputNumber, Upload, Button, Typography, message } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import { Link } from 'react-router-dom';

// const { Title } = Typography;

// const MemberRankForm = () => {
//     const [form] = Form.useForm();
//     const [imageUrl, setImageUrl] = useState('');

//     const onFinish = (values) => {
//         console.log('Form values:', values);
//         // Here, imageUrl will contain the Base64 string of the image
//         console.log('Image Base64:', imageUrl);
//     };

//     const validateUpload = (file) => {
//         const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//         if (!isJpgOrPng) {
//             message.error('Chỉ chấp nhận file JPG/PNG!');
//         }
//         const isLt1MB = file.size / 1024 / 1024 < 1;
//         if (!isLt1MB) {
//             message.error('Dung lượng phải nhỏ hơn 1MB!');
//         }
//         return isJpgOrPng && isLt1MB;
//     };

//     const handleChange = (info) => {
//         if (info.file.status === 'done') {
//             getBase64(info.file.originFileObj, (url) => {
//                 setImageUrl(url);
//             });
//         }
//     };

//     const getBase64 = (img, callback) => {
//         const reader = new FileReader();
//         reader.addEventListener('load', () => callback(reader.result));
//         reader.readAsDataURL(img);
//     };

//     const customRequest = ({ file, onSuccess }) => {
//         setTimeout(() => {
//             onSuccess("ok");
//         }, 0);
//     };

//     return (
//         <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//             <div className="flex items-center">
//                 <h1 className="md:text-base">
//                     Quản trị / Danh mục /
//                     <span className="font-semibold px-px"> Hạng thành viên</span>
//                 </h1>
//             </div>

//             <div className="flex items-center justify-between">
//                 <h1 className="font-semibold md:text-3xl">Thêm hạng thành viên</h1>
//                 <div>
//                     <Link to="/admin/users/rank" className="mr-1">
//                         <Button className="ml-auto bg-black text-white rounded-lg py-1">
//                             Quay lại
//                         </Button>
//                     </Link>
//                 </div>
//             </div>

//             <div className="max-w-2xl ml-5 mt-6 p-6 bg-white shadow-md rounded-lg">
//                 <Title level={3} className="mb-4">Tạo hạng thành viên mới</Title>
//                 <hr />
//                 <br />
//                 <Form
//                     form={form}
//                     layout="vertical"
//                     onFinish={onFinish}
//                     className="space-y-4"
//                 >
//                     <Form.Item
//                         name="rankName"
//                         label="Tên hạng thành viên"
//                         rules={[{ required: true, message: 'Vui lòng nhập tên hạng thành viên' }]}
//                     >
//                         <Input placeholder="Diamond" />
//                     </Form.Item>

//                     <Form.Item
//                         name="rankImage"
//                         label="Hình cho hạng thành viên"
//                         valuePropName="file"
//                     >
//                         <Upload
//                             accept="image/png,image/jpeg"
//                             listType="picture-card"
//                             className="avatar-uploader"
//                             showUploadList={false}
//                             beforeUpload={validateUpload}
//                             onChange={handleChange}
//                             customRequest={customRequest}
//                         >
//                             {imageUrl ? (
//                                 <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
//                             ) : (
//                                 <div>
//                                     <UploadOutlined />
//                                     <div style={{ marginTop: 8 }}>Tải lên</div>
//                                 </div>
//                             )}
//                         </Upload>
//                     </Form.Item>
//                     <p className="text-xs text-gray-500 mt-1">
//                         Dung lượng &lt; 1MB. Kích thước 500x500 pixels. Định dạng: png, jpeg.
//                     </p>

//                     <div className="flex space-x-4">
//                         <Form.Item
//                             name="minSpend"
//                             label="Chi tiêu tối thiểu (VND)"
//                             rules={[{ required: true, message: 'Vui lòng nhập chi tiêu tối thiểu' }]}
//                             className="flex-1"
//                         >
//                             <InputNumber
//                                 formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                                 parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
//                                 addonAfter="VND"
//                                 className="w-full"
//                             />
//                         </Form.Item>

//                         <Form.Item
//                             name="maxSpend"
//                             label="Chi tiêu tối đa (VND)"
//                             rules={[{ required: true, message: 'Vui lòng nhập chi tiêu tối đa' }]}
//                             className="flex-1"
//                         >
//                             <InputNumber
//                                 formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//                                 parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
//                                 addonAfter="VND"
//                                 className="w-full"
//                             />
//                         </Form.Item>
//                     </div>
//                     <div className="flex justify-start space-x-1 mt-6">
//                         <Button type="primary" size="middle" htmlType="submit"
//                             className="px-8 py-3 bg-black text-white rounded-lg"
//                         >
//                             Thêm
//                         </Button>
//                     </div>
//                 </Form>
//             </div>
//         </main>
//     );
// };

// export default MemberRankForm;
import React, { useState } from 'react';
import { Form, Input, InputNumber, Upload, Button, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title } = Typography;

const MemberRankForm = () => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState('');

    const onFinish = (values) => {
        console.log('Form values:', values);
        // Here, imageUrl will contain the Base64 string of the image
        console.log('Image Base64:', imageUrl);
    };

    const validateUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Chỉ chấp nhận file JPG/PNG!');
        }
        const isLt1MB = file.size / 1024 / 1024 < 1;
        if (!isLt1MB) {
            message.error('Dung lượng phải nhỏ hơn 1MB!');
        }
        return isJpgOrPng && isLt1MB;
    };

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => {
                setImageUrl(url);
            });
        }
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const customRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="md:text-base">
                    Quản trị / Danh mục /
                    <span className="font-semibold px-px"> Hạng thành viên</span>
                </h1>
            </div>

            <div className="flex items-center justify-between">
                <h1 className="font-semibold md:text-3xl">Thêm hạng thành viên</h1>
                <div>
                    <Link to="/admin/users/rank" className="mr-1">
                        <Button className="ml-auto bg-black text-white rounded-lg py-1">
                            Quay lại
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="max-w-2xl ml-5 mt-6 p-6 bg-white shadow-md rounded-lg">
                <Title level={3} className="mb-4">Tạo hạng thành viên mới</Title>
                <hr />
                <br />
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="space-y-4"
                >
                    <Form.Item
                        name="rankName"
                        label="Tên hạng thành viên"
                        rules={[{ required: true, message: 'Vui lòng nhập tên hạng thành viên' }]}
                    >
                        <Input placeholder="Diamond" />
                    </Form.Item>

                    <Form.Item
                        name="rankImage"
                        label="Hình cho hạng thành viên"
                        valuePropName="file"
                    >
                        <Upload
                            accept="image/png,image/jpeg"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={validateUpload}
                            onChange={handleChange}
                            customRequest={customRequest}
                        >
                            {imageUrl ? (
                                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                            ) : (
                                <div>
                                    <UploadOutlined />
                                    <div style={{ marginTop: 8 }}>Tải lên</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                    <p className="text-xs text-gray-500 mt-1">
                        Dung lượng &lt; 1MB. Kích thước 500x500 pixels. Định dạng: png, jpeg.
                    </p>

                    <div className="flex space-x-4">
                        <Form.Item
                            name="minSpend"
                            label="Chi tiêu tối thiểu (VND)"
                            rules={[{ required: true, message: 'Vui lòng nhập chi tiêu tối thiểu' }]}
                            className="flex-1"
                        >
                            <InputNumber
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                addonAfter="VND"
                                className="w-full"
                            />
                        </Form.Item>

                        <Form.Item
                            name="maxSpend"
                            label="Chi tiêu tối đa (VND)"
                            rules={[{ required: true, message: 'Vui lòng nhập chi tiêu tối đa' }]}
                            className="flex-1"
                        >
                            <InputNumber
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                addonAfter="VND"
                                className="w-full"
                            />
                        </Form.Item>
                    </div>
                    <div className="flex justify-start space-x-1 mt-6">
                        <Button type="primary" size="middle" htmlType="submit"
                            className="px-8 py-3 bg-black text-white rounded-lg"
                        >
                            Thêm
                        </Button>
                    </div>
                </Form>
            </div>
        </main>
    );
};

export default MemberRankForm;
