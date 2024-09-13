

// import React, { useState } from 'react';
// import { PlusOutlined } from '@ant-design/icons';
// import { Button, Input, Table, Upload, Image } from 'antd';
// import type { UploadFile, UploadProps } from 'antd';

// const getBase64 = (file: File): Promise<string> =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result as string);
//     reader.onerror = (error) => reject(error);
//   });

// const Content = () => {
//   const contactData = [
//     { key: 'phone', value: '(704)555-0127' },
//     { key: 'email', value: 'kist@example.com' },
//     { key: 'address', value: '3891 Ranchview Dr. Richardson, California 626339' },
//   ];

//   const informationData = ['My Account', 'Login', 'My Cart', 'My Wishlist', 'Checkout'];
//   const serviceData = ['About Us', 'Careers', 'Delivery Information', 'Privacy Policy', 'Terms & Conditions'];

//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');
//   const [fileList, setFileList] = useState<UploadFile[]>([]);

//   const handlePreview = async (file: UploadFile) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj as File);
//     }

//     setPreviewImage(file.url || (file.preview as string));
//     setPreviewOpen(true);
//   };

//   const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
//     setFileList(newFileList);

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
//           <h2 className="text-xl font-semibold mb-2">Logo</h2>
//           <Upload
//             action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
//             listType="picture-card"
//             fileList={fileList}
//             onPreview={handlePreview}
//             onChange={handleChange}
//           >
//             {fileList.length >= 1 ? null : uploadButton}
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
//           <h2 className="text-xl font-semibold mb-2">Nội dung đăng ký</h2>
//           <Input.TextArea defaultValue="Enter your email below to be the first to know about new collections and product launches." />
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold mb-2">Thông tin</h2>
//           <Table dataSource={informationData.map((item, index) => ({ key: index, item }))} pagination={false}>
//             <Table.Column
//               title="Item"
//               dataIndex="item"
//               key="item"
//               render={(text) => <Input defaultValue={text} />}
//             />
//             <Table.Column
//               title="Action"
//               key="action"
//               render={() => (
//                 <Button danger size="small">
//                   Xóa
//                 </Button>
//               )}
//             />
//           </Table>
//           <Button className="mt-2">Thêm mục</Button>
//         </div>
//       </div>

//       <div className="flex flex-col space-y-4">
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Thông tin liên hệ</h2>
//           <Table dataSource={contactData} pagination={false}>
//             <Table.Column title="Key" dataIndex="key" key="key" />
//             <Table.Column
//               title="Value"
//               dataIndex="value"
//               key="value"
//               render={(text) => <Input defaultValue={text} />}
//             />
//           </Table>
//         </div>

//         <div>
//           <h2 className="text-xl font-semibold mb-2">Dịch vụ</h2>
//           <Table dataSource={serviceData.map((item, index) => ({ key: index, item }))} pagination={false}>
//             <Table.Column
//               title="Item"
//               dataIndex="item"
//               key="item"
//               render={(text) => <Input defaultValue={text} />}
//             />
//             <Table.Column
//               title="Action"
//               key="action"
//               render={() => (
//                 <Button danger size="small">
//                   Xóa
//                 </Button>
//               )}
//             />
//           </Table>
//           <Button className="mt-2">Thêm mục</Button>
//         </div>
//       </div>

//       <Button className="col-span-2 mt-4">Lưu thay đổi</Button>
//     </div>
//   );
// };

// export default Content;
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Table, Upload, Image, message } from 'antd';
import type { UploadFile, UploadProps } from 'antd';

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Content = () => {
  const [contactData, setContactData] = useState([
    { key: 'phone', value: '(704)555-0127' },
    { key: 'email', value: 'kist@example.com' },
    { key: 'address', value: '3891 Ranchview Dr. Richardson, California 626339' },
  ]);

  const [informationData, setInformationData] = useState([
    'My Account',
    'Login',
    'My Cart',
    'My Wishlist',
    'Checkout',
  ]);

  const [serviceData, setServiceData] = useState([
    'About Us',
    'Careers',
    'Delivery Information',
    'Privacy Policy',
    'Terms & Conditions',
  ]);

  const [newInfoItem, setNewInfoItem] = useState('');
  const [newServiceItem, setNewServiceItem] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleInputChange = (key: string, value: string) => {
    setContactData((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value } : item))
    );
  };

  const handleAddInfoItem = () => {
    if (newInfoItem.trim()) {
      setInformationData([...informationData, newInfoItem]);
      setNewInfoItem('');
    }
  };

  const handleDeleteInfoItem = (index: number) => {
    setInformationData(informationData.filter((_, i) => i !== index));
  };

  const handleAddServiceItem = () => {
    if (newServiceItem.trim()) {
      setServiceData([...serviceData, newServiceItem]);
      setNewServiceItem('');
    }
  };

  const handleDeleteServiceItem = (index: number) => {
    setServiceData(serviceData.filter((_, i) => i !== index));
  };

  const handleSaveChanges = () => {
    message.success('Changes saved successfully!');
    // API call to save the data could be made here.
  };

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
          <h2 className="text-xl font-semibold mb-2">Logo</h2>
          <Upload
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
              }}
              src={previewImage}
            />
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Nội dung đăng ký</h2>
          <Input.TextArea defaultValue="Enter your email below to be the first to know about new collections and product launches." />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Thông tin</h2>
          <Table dataSource={informationData.map((item, index) => ({ key: index, item }))} pagination={false}>
            <Table.Column
              title="Item"
              dataIndex="item"
              key="item"
              render={(text, record, index) => (
                <>
                  <Input
                    defaultValue={text}
                    onChange={(e) => {
                      const newInfo = [...informationData];
                      newInfo[index] = e.target.value;
                      setInformationData(newInfo);
                    }}
                  />
                </>
              )}
            />
            <Table.Column
              title="Action"
              key="action"
              render={(text, record, index) => (
                <Button danger size="small" onClick={() => handleDeleteInfoItem(index)}>
                  Xóa
                </Button>
              )}
            />
          </Table>
          <Input
            className="mt-2"
            value={newInfoItem}
            onChange={(e) => setNewInfoItem(e.target.value)}
            placeholder="Thêm mục mới"
          />
          <Button className="mt-2" onClick={handleAddInfoItem}>
            Thêm mục
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Thông tin liên hệ</h2>
          <Table dataSource={contactData} pagination={false}>
            <Table.Column title="Key" dataIndex="key" key="key" />
            <Table.Column
              title="Value"
              dataIndex="value"
              key="value"
              render={(text, record) => (
                <Input
                  defaultValue={text}
                  onChange={(e) => handleInputChange(record.key, e.target.value)}
                />
              )}
            />
          </Table>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Dịch vụ</h2>
          <Table dataSource={serviceData.map((item, index) => ({ key: index, item }))} pagination={false}>
            <Table.Column
              title="Item"
              dataIndex="item"
              key="item"
              render={(text, record, index) => (
                <>
                  <Input
                    defaultValue={text}
                    onChange={(e) => {
                      const newService = [...serviceData];
                      newService[index] = e.target.value;
                      setServiceData(newService);
                    }}
                  />
                </>
              )}
            />
            <Table.Column
              title="Action"
              key="action"
              render={(text, record, index) => (
                <Button danger size="small" onClick={() => handleDeleteServiceItem(index)}>
                  Xóa
                </Button>
              )}
            />
          </Table>
          <Input
            className="mt-2"
            value={newServiceItem}
            onChange={(e) => setNewServiceItem(e.target.value)}
            placeholder="Thêm mục mới"
          />
          <Button className="mt-2" onClick={handleAddServiceItem}>
            Thêm mục
          </Button>
        </div>
      </div>

      <Button className="col-span-2 mt-4" onClick={handleSaveChanges}>
        Lưu thay đổi
      </Button>
    </div>
  );
};

export default Content;

