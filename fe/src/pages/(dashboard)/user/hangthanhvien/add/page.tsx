

import React, { useState } from 'react';
import { Form, Input, InputNumber, Upload, Button, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import instance from "@/configs/axios";
import { RcFile, UploadFile, UploadProps } from 'antd/es/upload';
import { uploadToCloudinary } from '@/configs/cloudinary';

const { Title } = Typography;

interface MemberRank {
  anh_hang_thanh_vien: string;
  ten_hang_thanh_vien: string;
  chi_tieu_toi_thieu: number;
  chi_tieu_toi_da: number;
}

const MemberRankForm: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Query để lấy danh sách hạng thành viên hiện có
  const { data: existingRanks = [] } = useQuery<MemberRank[]>({
    queryKey: ['memberRanks'],
    queryFn: () => instance.get('admin/hangthanhvien').then(res => res.data),
  });

  const addMemberRankMutation = useMutation({
    mutationFn: async (newRank: MemberRank) => {
      // // Kiểm tra tên trùng
      // const isNameExist = existingRanks.some(
      //   (rank: MemberRank) => rank.ten_hang_thanh_vien.toLowerCase() === newRank.ten_hang_thanh_vien.toLowerCase()
      // );

      // if (isNameExist) {
      //   throw new Error('Tên hạng thành viên đã tồn tại');
      // }

      if (fileList.length > 0 && fileList[0].originFileObj) {
        const cloudinaryUrl = await uploadToCloudinary(fileList[0].originFileObj);
        newRank.anh_hang_thanh_vien = cloudinaryUrl;
      }
      return instance.post('admin/hangthanhvien', newRank);
    },
    onSuccess: () => {
      message.success('Thêm hạng thành viên thành công');
      queryClient.invalidateQueries({ queryKey: ['memberRanks'] });
      navigate('/admin/users/rank');
    },
    onError: (error: Error) => {
      message.error('Có lỗi xảy ra khi thêm hạng thành viên: ' + error.message);
    },
  });

  const onFinish = (values: any) => {
    const newRank: MemberRank = {
      anh_hang_thanh_vien: '',
      ten_hang_thanh_vien: values.rankName,
      chi_tieu_toi_thieu: values.minSpend,
      chi_tieu_toi_da: values.maxSpend,
    };
    addMemberRankMutation.mutate(newRank);
  };

  const validateUpload = (file: RcFile): boolean => {
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

  const handleChange: UploadProps['onChange'] = (info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1);
    newFileList = newFileList.map(file => {
      if (file.response) {
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(newFileList);
  };

  const uploadProps: UploadProps = {
    beforeUpload: validateUpload,
    onChange: handleChange,
    fileList: fileList,
    maxCount: 1,
    listType: "picture-card",
    accept: "image/png,image/jpeg",
    customRequest: ({ file, onSuccess }) => {
      setTimeout(() => {
        if (onSuccess) {
          onSuccess("ok");
        }
      }, 0);
    },
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
            rules={[
              { required: true, message: 'Vui lòng nhập tên hạng thành viên' },
            ]}
          >
            <Input placeholder="Diamond" />
          </Form.Item>

          <Form.Item
            name="rankImage"
            label="Hình cho hạng thành viên"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }}
          >
            <Upload {...uploadProps}>
              {fileList.length === 0 && (
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
  rules={[
    { required: true, message: 'Vui lòng nhập chi tiêu tối thiểu' },
    () => ({
      validator(_, value) {
        if (value === 0 || value > 1000) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Giá trị phải là 0 hoặc lớn hơn 1.000'));
      },
    }),
  ]}
  className="flex-1"
>
  <InputNumber
    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
    addonAfter="VND"
    className="w-full"
  />
</Form.Item>


            <Form.Item
              name="maxSpend"
              label="Chi tiêu tối đa (VND)"
              dependencies={['minSpend']}
              rules={[
                { required: true, message: 'Vui lòng nhập chi tiêu tối đa' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('minSpend') < value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Chi tiêu tối đa phải lớn hơn chi tiêu tối thiểu'));
                  },
                }),
              ]}
              className="flex-1"
            >
              <InputNumber
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                addonAfter="VND"
                className="w-full"
              />
            </Form.Item>
          </div>
          <div className="flex justify-start space-x-1 mt-6">
            <Button 
              type="primary" 
              size="middle" 
              htmlType="submit"
              className="px-8 py-3 bg-black text-white rounded-lg"
              loading={addMemberRankMutation.isPending}
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
