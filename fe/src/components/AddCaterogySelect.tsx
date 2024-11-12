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
    onChange: (value: string[]) => void;
    value?: string[];
  }
const renderCategories = (categories: Category[], level = 0): JSX.Element[] => {
  const result: JSX.Element[] = [];

  categories.forEach(category => {
    result.push(
      <Option 
        key={category.id} 
        value={category.id}
        style={{ paddingLeft: `${level * 20}px` }} 
      >
        {category.ten_danh_muc}
      </Option>
    );

    if (category.children && category.children.length > 0) {
      result.push(...renderCategories(category.children, level + 1));
    }
  });

  return result;
};

const AddCategorySelect: React.FC<CategorySelectProps> = ({ categoriesData, onChange, value }) => {
  const rootCategories = (categoriesData?.data || []).filter(cat => cat.cha_id === null);

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

export default AddCategorySelect;
