
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

  const fakeApiCall = async () => {
    return [
      {
        uid: '-1',
        name: 'image1.png',
        status: 'done',
        url: 'data:image/jpeg;base64,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',
      },
      {
        uid: '-2',
        name: 'image2.png',
        status: 'done',
        url: 'data:image/jpeg;base64,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',
      },
      {
        uid: '-3',
        name: 'image3.png',
        status: 'done',
        url: 'data:image/jpeg;base64,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',
      },
    ];
  };

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
