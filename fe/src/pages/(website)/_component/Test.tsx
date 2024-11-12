import React from "react";

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

const Test: React.FC = () => {
  return (
    <div className="flex items-start p-6 bg-white border border-gray-300 rounded-lg">
      {/* Product categories */}
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

      {/* Image section */}
      <div className="ml-8">
        <img
          src="link_to_image.jpg" // Replace "link_to_image.jpg" with your actual image link
          alt="Thời trang nam"
          className="w-60 h-auto rounded-lg object-cover"
        />
      </div>
    </div>
  );
};

export default Test;
