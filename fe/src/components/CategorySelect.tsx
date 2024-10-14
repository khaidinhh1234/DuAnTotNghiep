import { Select } from 'antd';
import React from 'react';

interface Category {
    id: number;
    cha_id: number | null;
    ten_danh_muc: string;
}

interface CategoriesData {
    data: Category[];
}

const CategorySelect: React.FC<{ categoriesData: CategoriesData }> = ({ categoriesData }) => {
    // Hàm render để hiển thị các danh mục
    const renderCategories = (parentId: number | null, level: number = 0) => {
        const children = categoriesData.data.filter((category: any) => category.cha_id === parentId);

        return children.map((category: any) => {
            // Kiểm tra xem danh mục có con không
            const hasChildren = categoriesData.data.some(child => child.cha_id === category.id);

            return (
                <React.Fragment key={category.id}>
                    {/* Chỉ hiển thị danh mục cuối cùng không có danh mục con */}
                    {!hasChildren ? (
                        <Select.Option key={category.id} value={category.id}>
                            <span style={{ marginLeft: level * 20, color: '#666' }}>
                                {category.ten_danh_muc}
                            </span>
                        </Select.Option>
                    ) : (
                        // Gọi đệ quy cho danh mục con
                        <React.Fragment>
                            {/* Hiển thị danh mục cha nhưng không cho chọn */}
                            <Select.Option disabled key={category.id} value={category.id}>
                                <span style={{ marginLeft: level * 20, color: '#000', fontWeight: 'bold' }}>
                                    {category.ten_danh_muc}
                                </span>
                            </Select.Option>
                            {/* Gọi đệ quy để hiển thị danh mục con */}
                            {renderCategories(category.id, level + 1)}
                        </React.Fragment>
                    )}
                </React.Fragment>
            );
        });
    };

    return (
        <Select placeholder="Vui lòng chọn danh mục" className="w-full">
            {categoriesData && categoriesData.data
                .filter((category: any) => category.cha_id === null) // Lọc danh mục cha
                .map((parentCategory: any) => (
                    <Select.OptGroup key={parentCategory.id} label={<span className="font-bold">{parentCategory.ten_danh_muc}</span>}>
                        {renderCategories(parentCategory.id)} {/* Render danh mục con */}
                    </Select.OptGroup>
                ))}
        </Select>
    );
};

export default CategorySelect;
