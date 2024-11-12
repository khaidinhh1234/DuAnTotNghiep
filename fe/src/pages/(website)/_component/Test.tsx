import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

// Define types for the category structure
type Category = {
  title: string;
  items: string[];
};

const categories: Category[] = [
  {
    title: "Áo nam",
    items: [
      "Áo khoác nam",
      "Áo phao nam",
      "Áo gió nam",
      "Áo Hoodie - Áo nỉ nam",
      "Áo len nam",
      "Áo thun nam",
      "Áo sơ mi nam",
      "Áo polo nam",
    ],
  },
  {
    title: "Quần nam",
    items: ["Quần dài nam", "Quần kaki nam", "Quần short nam", "Quần jeans nam", "Quần âu nam"],
  },
  {
    title: "Đồ bộ nam",
    items: ["Đồ bộ dài tay nam", "Đồ bộ ngắn tay nam"],
  },
  {
    title: "Đồ mặc trong nam",
    items: ["Quần lót nam", "Áo ba lỗ nam", "Áo giữ nhiệt nam"],
  },
  {
    title: "Đồ thể thao nam",
    items: ["Quần thể thao nam", "Áo polo thể thao nam", "Áo thun thể thao nam", "Bộ thể thao nam"],
  },
  {
    title: "Phụ kiện nam",
    items: ["Tất nam", "Phụ kiện khác nam", "Túi xách nam", "Mũ nam", "Thắt lưng nam", "Giày nam"],
  },
];

const mainMenuItems = [
  { id: 1, label: "Nam", slug: "nam" },
  { id: 2, label: "Nữ", slug: "nu" },
  { id: 3, label: "Trẻ em", slug: "tre-em" },
];

const Test: React.FC = () => {
  const [isHovered, setIsHovered] = useState<number | null>(null);

  const handleMouseEnter = (id: number) => {
    setIsHovered(id);
  };

  const handleMouseLeave = () => {
    setIsHovered(null);
  };

  return (
    <nav className="flex space-x-6 text-gray-700 font-bold pt-1 relative">
      <NavLink to="/" className="text-lg font-bold">
        Trang chủ
      </NavLink>
      <NavLink to="/ourstory" className="text-lg">
        Giới thiệu
      </NavLink>
      {mainMenuItems.map((item) => (
        <div
          key={item.id}
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
          className="relative text-lg"
        >
          <Link to={`/shop/${item.slug}`} className="text-black">
            {item.label}
          </Link>

          {/* Hiển thị phần danh mục khi hover vào */}
          {isHovered === item.id && (
            <div className="absolute top-[100px] left-0 w-screen h-screen bg-white p-6 border-t-4 border-gray-300 z-50">
              <div className="flex items-start">
                <div className="flex flex-1 gap-8">
                  {categories.map((category, index) => (
                    <div key={index} className="flex flex-col space-y-2">
                      <h3 className="font-semibold text-lg">{category.title}</h3>
                      {category.items.map((item, idx) => (
                        <p key={idx} className="text-gray-700">
                          {item}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="ml-8">
                  <img
                    src="link_to_image.jpg" // Thay đổi link ảnh phù hợp
                    alt="Thời trang nam"
                    className="w-60 h-auto rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <NavLink to="/blog" className="text-lg">
        Bài viết
      </NavLink>
      <NavLink to="/voucher" className="text-lg">
        Khuyến mại
      </NavLink>
      <NavLink to="/contact" className="text-lg">
        Liên hệ
      </NavLink>
    </nav>
  );
};

export default Test;
