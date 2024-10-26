import React from 'react';
import { Select } from 'antd';

const { Option, OptGroup } = Select;

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

const transformCategories = (flatCategories: Category[]): Category[] => {
  const categoryMap = new Map();
  const rootCategories: Category[] = [];

  flatCategories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  flatCategories.forEach(cat => {
    const category = categoryMap.get(cat.id);
    if (cat.cha_id === null) {
      rootCategories.push(category);
    } else {
      const parentCategory = categoryMap.get(cat.cha_id);
      if (parentCategory) {
        parentCategory.children.push(category);
      }
    }
  });

  return rootCategories;
};

const renderCategories = (categories: Category[], level = 0): JSX.Element[] => {
  return categories.map(category => {
    if (category.children && category.children.length > 0) {
      return (
        <OptGroup 
          key={category.id} 
          label={
            <div style={{ fontWeight: 'bold', paddingLeft: `${level * 20}px` }}>
              {category.ten_danh_muc}
            </div>
          }
        >
          {renderCategories(category.children, level + 1)}
        </OptGroup>
      );
    }

    return (
      <Option 
        key={category.id} 
        value={category.id}
        style={{ paddingLeft: `${level * 20}px` }}
      >
        {category.ten_danh_muc}
      </Option>
    );
  });
};

const CategorySelect: React.FC<CategorySelectProps> = ({ categoriesData, onChange, value }) => {
  const transformedCategories = transformCategories(categoriesData?.data || []);

  return (
    <Select
      style={{ width: '100%' }}
      placeholder="Chọn danh mục"
      onChange={onChange}
      value={value}
      optionLabelProp="children"
    >
      {renderCategories(transformedCategories)}
    </Select>
  );
};

export default CategorySelect;
