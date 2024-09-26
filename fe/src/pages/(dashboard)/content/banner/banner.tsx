
import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Table, Upload, Image, ColorPicker, Carousel, Empty } from 'antd';
import type { UploadFile, UploadProps } from 'antd';

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const BannerManagement = () => {
  const [bannerTextData, setBannerTextData] = useState([
    { key: 'mainHeadline', value: 'Beyond Builder', color: '#000000' },
    { key: 'subHeadline', value: 'FASHION SHOP.COM', color: '#000000' },
    { key: 'promotionalText', value: 'UPTO 40% OFF', color: '#000000' },
    { key: 'ctaText', value: 'Shop Now', color: '#FFFFFF' },
  ]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [backgroundColor, setBackgroundColor] = useState('#E6E6FA');
  const [accentColor, setAccentColor] = useState('#FFD700');
  const [bannerImageUrls, setBannerImageUrls] = useState<string[]>([]);


  useEffect(() => {
    const loadImages = async () => {
      const urls = await Promise.all(
        fileList.map(async (file) => {
          if (file.originFileObj) {
            return await getBase64(file.originFileObj);
          }
          return '';
        })
      );
      setBannerImageUrls(urls.filter((url) => url !== ''));
    };
    loadImages();
  }, [fileList]);
  
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleTextChange = (key: string, newValue: string) => {
    setBannerTextData(prevData =>
      prevData.map(item =>
        item.key === key ? { ...item, value: newValue } : item
      )
    );
  };
  const handleRemove = (file: UploadFile) => {
    if (fileList.length <= 3) {
      return false;
    }
    return true;
  };
  const handleColorChange = (key: string, newColor: string) => {
    setBannerTextData(prevData =>
      prevData.map(item =>
        item.key === key ? { ...item, color: newColor } : item
      )
    );
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
          <h2 className="text-xl font-semibold mb-2">Ảnh Banner</h2>
          <Upload
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            onRemove={handleRemove}
          >
            {fileList.length >= 4 ? null : uploadButton}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(''),
              }}
              src={previewImage}
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
              render={(text, record) => (
                <Input
                  defaultValue={text}
                  onChange={(e) => handleTextChange(record.key, e.target.value)}
                />
              )}
            />
            <Table.Column
              title="Color"
              key="color"
              render={(text, record) => (
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
          {bannerImageUrls.length > 0 ? (
            <Carousel autoplay>
              {bannerImageUrls.map((url, index) => (
                <div key={index}>
                  <div
                    style={{
                      backgroundColor: backgroundColor,
                      padding: '10px',
                      borderRadius: '8px',
                      position: 'relative',
                      overflow: 'hidden',
                      height: '300px',
                      width: '100%',
                    }}
                  >
                    <img
                      src={url}
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

      <Button className="col-span-2 mt-4">Lưu thay đổi</Button>
    </div>
  );
};

export default BannerManagement;
