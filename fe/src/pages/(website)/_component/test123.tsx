import React, { useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useNavigate } from 'react-router-dom';

const Test123: React.FC = () => {
  const [activeKey, setActiveKey] = useState(''); // Trạng thái cho tab hiện nội dung khi hover
  const [isHovering, setIsHovering] = useState(false); // Trạng thái kiểm tra hover
  const navigate = useNavigate();

  // Hàm xử lý hover
  const handleHover = (key: string) => {
    setActiveKey(key);
    setIsHovering(true); // Bật trạng thái hover
  };

  // Hàm xử lý bỏ hover
  const handleMouseLeave = () => {
    setIsHovering(false); // Tắt trạng thái hover khi chuột rời khỏi
  };

  // Hàm xử lý click cho các tab chuyển trang
  const handleClick = (path: string) => {
    navigate(path);
  };

  // Dữ liệu chi tiết cho từng danh mục
  const content = {
    men: (
      <div>
        <h4>Đồ Nam</h4>
        <ul>
          <li>Áo sơ mi</li>
          <li>Quần jeans</li>
          <li>Giày thể thao</li>
          <li>Áo khoác</li>
        </ul>
      </div>
    ),
    women: (
      <div>
        <h4>Đồ Nữ</h4>
        <ul>
          <li>Đầm dạ hội</li>
          <li>Áo phông</li>
          <li>Giày cao gót</li>
          <li>Váy ngắn</li>
        </ul>
      </div>
    ),
    kids: (
      <div>
        <h4>Đồ Trẻ Em</h4>
        <ul>
          <li>Áo thun</li>
          <li>Quần short</li>
          <li>Giày dép trẻ em</li>
          <li>Mũ đội</li>
        </ul>
      </div>
    ),
  };

  // Cấu hình các tab
  const items: TabsProps['items'] = [
    {
      key: 'home',
      label: <span onClick={() => handleClick('/')}>Trang chủ</span>,
    },
    {
      key: 'about',
      label: <span onClick={() => handleClick('/about')}>Giới thiệu</span>,
    },
    {
      key: 'men',
      label: (
        <span
          onMouseEnter={() => handleHover('men')}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick('/category/nam')}
        >
          Nam
        </span>
      ),
    },
    {
      key: 'women',
      label: (
        <span
          onMouseEnter={() => handleHover('women')}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick('/category/nu')}
        >
          Nữ
        </span>
      ),
    },
    {
      key: 'kids',
      label: (
        <span
          onMouseEnter={() => handleHover('kids')}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick('/category/tre-em')}
        >
          Trẻ em
        </span>
      ),
    },
    {
      key: 'posts',
      label: <span onClick={() => handleClick('/posts')}>Bài viết</span>,
    },
    {
      key: 'promotions',
      label: <span onClick={() => handleClick('/promotions')}>Khuyến mãi</span>,
    },
  ];

  return (
    <div className="relative">
      <Tabs activeKey="none" items={items} />

      {/* Hiển thị nội dung tương ứng khi hover vào "Nam", "Nữ", hoặc "Trẻ em" */}
      <div
        className={`absolute top-16 left-0 w-full bg-white p-4 shadow-lg rounded-md transition-all duration-300 ease-in-out z-10 ${
          isHovering ? 'block' : 'hidden'
        }`} // Thêm điều kiện ẩn/hiện dựa trên trạng thái hover
        onMouseEnter={() => setIsHovering(true)} // Giữ nội dung hiển thị khi hover vào
        onMouseLeave={handleMouseLeave} // Đảm bảo bỏ hover khi chuột rời khỏi
      >
        {activeKey && (
          <div className="flex flex-col space-y-2">
            {activeKey === 'men' && content.men}
            {activeKey === 'women' && content.women}
            {activeKey === 'kids' && content.kids}
          </div>
        )}
      </div>
    </div>
  );
};

export default Test123;
