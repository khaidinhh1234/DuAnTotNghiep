import React, { useState } from 'react';
import { Layout, Row, Col, Input, Table, Typography, Button, Upload, Image } from 'antd';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined, TikTokOutlined, PlusOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';

const { Content } = Layout;
const { Title } = Typography;

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Contents = () => {
  const [contactData, setContactData] = useState([
    { key: 'website', value: '' },
    { key: 'Tên công ty', value: '' },
    { key: 'Địa chỉ', value: '' },
    { key: 'email', value: '' },
    { key: 'Điện thoại đặt hàng', value: '' },
    { key: 'điện thoại khiếu nại', value: '' },
  ]);

  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: ''
  });

  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handleInputChange = (key: string, value: string) => {
    setContactData(prev =>
      prev.map(item => (item.key === key ? { ...item, value } : item))
    );
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
  };

  const handleSave = () => {
    console.log('Đã lưu thông tin liên hệ:', contactData);
    console.log('Đã lưu liên kết mạng xã hội:', socialLinks);
    // Handle save operation here
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }: { fileList: any[] }) => setFileList(newFileList);

  const uploadButton = (
    <div style={{ border: 0, background: 'none', textAlign: 'center' }}>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Layout>
      <Content style={{ padding: '0 50px', marginTop: '20px' }}>
        <Title level={2}>Quản lý thông tin</Title>
        <Row gutter={16}>
          <Col span={8}>
            <div className="flex flex-col space-y-4">
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
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                  }}
                  src={previewImage}
                />
              )}
              <div style={{ marginTop: '10px' }}>
                <h2 className="text-xl font-semibold mb-2">Liên kết mạng xã hội</h2>
                <Table
                  dataSource={[
                    { platform: 'Facebook', icon: <FacebookOutlined />, value: socialLinks.facebook },
                    { platform: 'Instagram', icon: <InstagramOutlined />, value: socialLinks.instagram },
                    { platform: 'Twitter', icon: <TwitterOutlined />, value: socialLinks.twitter },
                    { platform: 'TikTok', icon: <TikTokOutlined />, value: socialLinks.tiktok }
                  ]}
                  pagination={false}
                  rowKey="platform"
                >
                  <Table.Column title="Mạng xã hội" dataIndex="platform" key="platform" />
                  <Table.Column
                    title="Liên kết"
                    dataIndex="value"
                    key="value"
                    render={(text: string, record: any) => (
                      <Input
                        prefix={record.icon}
                        value={text}
                        onChange={(e) => handleSocialLinkChange(record.platform.toLowerCase(), e.target.value)}
                        placeholder={`Nhập liên kết ${record.platform}`}
                      />
                    )}
                  />
                </Table>
              </div>
            </div>
          </Col>

          <Col span={16}>
            <div className="flex flex-col space-y-4">
              <h2 className="text-xl font-semibold mb-2">Thông tin liên hệ</h2>
              <Table
                dataSource={contactData}
                pagination={false}
                rowKey="key"
              >
                <Table.Column title="Chỉ số" dataIndex="key" key="key" />
                <Table.Column
                  title="Giá trị"
                  dataIndex="value"
                  key="value"
                  render={(text: string, record: any) => (
                    <Input
                      defaultValue={text}
                      onChange={(e) => handleInputChange(record.key, e.target.value)}
                      placeholder={`Nhập ${record.key}`}
                      
                    />
                  )}
                />
                
              </Table>
            </div>
          </Col>
        </Row>
        <Button
          onClick={handleSave}
          style={{ width: '100%', margin: '30px 0px' }}
        >
          Lưu thay đổi
        </Button>
      </Content>
    </Layout>
  );
};

export default Contents;
