

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

const getCategoryDepth = (category: Category): number => {
  if (!category.children || category.children.length === 0) {
    return 1;
  }
  let maxDepth = 1;
  for (const child of category.children) {
    const childDepth = getCategoryDepth(child);
    maxDepth = Math.max(maxDepth, childDepth + 1);
  }
  return maxDepth;
};

const renderCategories = (categories: Category[], level = 0, parentDepth = 1): JSX.Element[] => {
  const result: JSX.Element[] = [];

  categories.forEach(category => {
    const currentBranchDepth = level === 0 ? getCategoryDepth(category) : parentDepth;
    
    const isSelectable = (
      (currentBranchDepth === 1) || // If only 1 level, it's selectable
      (currentBranchDepth === 2 && level === 1) || // If 2 levels, only level 2 is selectable
      (currentBranchDepth === 3 && level === 2) // If 3 levels, only level 3 is selectable
    );

    result.push(
      <Option 
        key={category.id} 
        value={category.id}
        style={{ 
          paddingLeft: `${level * 20}px`,
          color: isSelectable ? 'inherit' : '#999',
          cursor: isSelectable ? 'pointer' : 'not-allowed'
        }}
        disabled={!isSelectable}
      >
        {category.ten_danh_muc}
      </Option>
    );

    if (category.children && category.children.length > 0) {
      result.push(...renderCategories(category.children, level + 1, currentBranchDepth));
    }
  });

  return result;
};

const CategorySelect: React.FC<CategorySelectProps> = ({ categoriesData, onChange, value }) => {
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

export default CategorySelect;
