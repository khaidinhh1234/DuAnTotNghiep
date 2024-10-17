// import { Select } from 'antd';
// import React from 'react';

// interface Category {
//     id: number;
//     cha_id: number | null;
//     ten_danh_muc: string;
// }

// interface CategoriesData {
//     data: Category[];
// }

// const CategorySelect: React.FC<{ categoriesData: CategoriesData }> = ({ categoriesData }) => {
//     // Hàm render để hiển thị các danh mục
//     const renderCategories = (parentId: number | null, level: number = 0) => {
//         const children = categoriesData.data.filter((category: any) => category.cha_id === parentId);

//         return children.map((category: any) => {
//             // Kiểm tra xem danh mục có con không
//             const hasChildren = categoriesData.data.some(child => child.cha_id === category.id);
//             console.log(category);
//             return (
//                 <React.Fragment key={category.id}>
//                     {/* Chỉ hiển thị danh mục cuối cùng không có danh mục con */}
//                     {!hasChildren ? (
//                         <Select.Option key={category.id} value={category.id}>
//                             <span style={{ marginLeft: level * 20, color: '#666' }}>
//                                 {category.ten_danh_muc}
//                             </span>
//                         </Select.Option>
//                     ) : (
//                         // Gọi đệ quy cho danh mục con
//                         <React.Fragment>
//                             {/* Hiển thị danh mục cha nhưng không cho chọn */}
//                             <Select.Option disabled key={category.id} value={category.id}>
//                                 <span style={{ marginLeft: level * 20, color: '#000', fontWeight: 'bold' }}>
//                                     {category.ten_danh_muc}
//                                 </span>
//                             </Select.Option>
//                             {/* Gọi đệ quy để hiển thị danh mục con */}
//                             {renderCategories(category.id, level + 1)}
//                         </React.Fragment>
//                     )}
//                 </React.Fragment>
//             );
//         });
//     };

//     return (
//         <Select placeholder="Vui lòng chọn danh mục" className="w-full">
//             {categoriesData && categoriesData.data
//                 .filter((category: any) => category.cha_id === null) // Lọc danh mục cha
//                 .map((parentCategory: any) => (
//                     <Select.OptGroup key={parentCategory.id} label={<span className="font-bold">{parentCategory.ten_danh_muc}</span>}>
//                         {renderCategories(parentCategory.id)} {/* Render danh mục con */}
//                     </Select.OptGroup>
//                 ))}
//         </Select>
//     );
// };

// export default CategorySelect;
// import React from 'react';
// import { Select } from 'antd';

// const { Option } = Select;

// interface Category {
//   id: number;
//   ten_danh_muc: string;
//   cha_id: number | null;
//   children: Category[];
// }

// interface CategorySelectProps {
//   categories: Category[];
//   onChange: (value: number) => void;
//   value?: number;
// }

// const renderOptions = (categories: Category[], level = 0) => {
//   return categories.map(category => (
//     <React.Fragment key={category.id}>
//       <Option value={category.id} style={{ paddingLeft: `${level * 20}px` }}>
//         {category.ten_danh_muc}
//       </Option>
//       {category.children && renderOptions(category.children, level + 1)}
//     </React.Fragment>
//   ));
// };

// const CategorySelect: React.FC<CategorySelectProps> = ({ categories, onChange, value }) => {
//   return (
//     <Select
//       style={{ width: '100%' }}
//       placeholder="Chọn danh mục"
//       onChange={onChange}
//       value={value}
//     >
//       {renderOptions(categories)}
//     </Select>
//   );
// };

// export default CategorySelect;
import React from 'react';
import { Select, Image } from 'antd';

const { Option } = Select;

interface Category {
  id: number;
  ten_danh_muc: string;
  cha_id: number | null;
  anh_danh_muc: string;
  children: Category[];
}

interface CategorySelectProps {
  categories: Category[];
  onChange: (value: number) => void;
  value?: number;
}

const renderOptions = (categories: Category[], level = 0): JSX.Element[] => {
  return categories.flatMap(category => {
    const optionContent = (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Image
          src={category.anh_danh_muc}
          alt={category.ten_danh_muc}
          width={30}
          height={30}
          style={{ marginRight: 8, objectFit: 'cover', borderRadius: '50%',padding: '6px',}}
          preview={false}
        />
        <span>{category.ten_danh_muc}</span>
      </div>
    );

    if (category.children && category.children.length > 0) {
      // For parent categories, render an unselectable option and its children
      return [
        <Option key={category.id} value={category.id} disabled style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5', paddingLeft: `${level * 20}px` }}>
          {optionContent}
        </Option>,
        ...renderOptions(category.children, level + 1)
      ];
    } else {
      // For leaf categories, render a selectable option
      return [
        <Option key={category.id} value={category.id} style={{ paddingLeft: `${level * 20}px` }}>
          {optionContent}
        </Option>
      ];
    }
  });
};

const CategorySelect: React.FC<CategorySelectProps> = ({ categories, onChange, value }) => {
  return (
    <Select
      style={{ width: '100%' }}
      placeholder="Chọn danh mục"
      onChange={onChange}
      value={value}
      optionLabelProp="children"
    >
      {renderOptions(categories)}
    </Select>
  );
};

export default CategorySelect;
