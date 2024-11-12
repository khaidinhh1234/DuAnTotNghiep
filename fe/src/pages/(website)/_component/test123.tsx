import React from 'react';
import { Button, Popover } from 'antd';
import './dropdown.css'; // Import file CSS tùy chỉnh

const content = (
  <div className="w-[100vw]"> {/* Thêm class cho content */}
    <p>Content</p>
    <p>Content</p>
  </div>
);

const Test123: React.FC = () => (
  <Popover content={content} title="Title" placement="bottom" overlayClassName="full-width-popover">
    <Button type="primary">Hover me</Button>
  </Popover>
);

export default Test123;
