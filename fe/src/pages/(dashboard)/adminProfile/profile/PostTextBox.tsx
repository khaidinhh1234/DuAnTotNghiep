// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { Button, Input, Upload } from 'antd';
import { UploadOutlined, FileImageOutlined, FileTextOutlined } from '@ant-design/icons';

export const PostTextBox = () => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <Input.TextArea
        placeholder="Share your thoughts"
        rows={4}
        className="w-full mb-4"
      />
      <div className="flex items-center gap-4">
        <Upload>
          <Button
            icon={<FileImageOutlined />}
            className="flex items-center justify-center"
          >
            Photo / Video
          </Button>
        </Upload>

        <Upload>
          <Button
            icon={<FileTextOutlined />}
            className="flex items-center justify-center"
          >
            Article
          </Button>
        </Upload>

        <Button
          type="primary"
          className="ml-auto bg-blue-500 hover:bg-blue-600 text-white"
        >
          Post
        </Button>
      </div>
    </div>
  );
};
