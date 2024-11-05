import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface Category {
  id: number;
  ten_danh_muc: string;
  cha_id: number;
  children?: Category[];
}

interface CategorySelectProps {
  categoriesData: {
    data: Category[];
  } | undefined; // Allow undefined here
  onChange: (value: number) => void;
  value?: number;
}

const renderCategories = (categories: Category[], level = 0): JSX.Element[] => {
  const result: JSX.Element[] = [];
  categories.forEach((category) => {
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
  return (
    <Select
      style={{ width: '100%' }}
      placeholder="Chọn danh mục"
      onChange={onChange}
      value={value}
      optionLabelProp="children"
      allowClear
    >
      {categoriesData?.data ? renderCategories(categoriesData.data) : <Option disabled>Loading...</Option>}
    </Select>
  );
};

export default AddCategorySelect;
