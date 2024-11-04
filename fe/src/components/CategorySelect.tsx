
import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface Category {
  id: number;
  ten_danh_muc: string;
  cha_id: number | null;
  children?: Category[];
}

interface CategorySelectProps {
  categoriesData: {
    data: Category[];
  };
  onChange: (value: number) => void;
  value?: number;
}

const renderCategories = (categories: Category[], level = 0): JSX.Element[] => {
  const result: JSX.Element[] = [];

  categories.forEach(category => {
    // Add current category as an option
    result.push(
      <Option 
        key={category.id} 
        value={category.id}
        style={{ paddingLeft: `${level * 20}px` }}
      >
        {category.ten_danh_muc}
      </Option>
    );

    // Recursively add children if they exist
    if (category.children && category.children.length > 0) {
      result.push(...renderCategories(category.children, level + 1));
    }
  });

  return result;
};

const CategorySelect: React.FC<CategorySelectProps> = ({ categoriesData, onChange, value }) => {
  // Filter root categories
  const rootCategories = (categoriesData?.data || []).filter(cat => cat.cha_id === null);
  
  console.log('Root Categories:', rootCategories);

  return (
    <Select
      style={{ width: '100%' }}
      placeholder="Chọn danh mục"
      onChange={onChange}
      value={value}
      optionLabelProp="children"
    >
      {renderCategories(rootCategories)}
    </Select>
  );
};

export default CategorySelect;
