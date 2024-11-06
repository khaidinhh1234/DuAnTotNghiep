// HoverMenu.js
import React, { useState, useEffect } from 'react';
import instanceClient from '@/configs/client';

interface MenuItem {
    id: number;
    name: string;
    path: string;
    con?: MenuItem[]; // Danh mục con
    ten_danh_muc?: string;
    duong_dan?: string;
}

interface HoverMenuProps {
    parentId: number;
    onClose: () => void;
}

const HoverMenu: React.FC<HoverMenuProps> = ({ parentId, onClose }) => {
    const [subCategories, setSubCategories] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const response = await instanceClient.get(`/load-danh-muc-con-chau/${parentId}`);
                console.log(response.data); // In ra dữ liệu nhận được
                if (response.data.status) {
                    const fetchedCategories = response.data.data.map((sub: any) => ({
                        id: sub.id,
                        name: sub.ten_danh_muc,
                        path: `/${sub.duong_dan}`,
                        con: sub.con || [],
                    }));
                    setSubCategories(fetchedCategories);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh mục con:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubCategories();
    }, [parentId]);

    return (
        <div
            className="absolute left-0 top-full mt-2 bg-gray-100 border border-gray-200 rounded shadow-lg p-4 z-50"
            onMouseLeave={onClose}
            style={{ minWidth: '300px', height: '300px' }}
        >
            <div className="flex">
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    subCategories.map((subCategory) => (
                        <div key={subCategory.id} className="relative group" style={{ marginRight: '100px' }}>
                            <a
                                href={`/sanpham/danhmuc/${subCategory.name}`} 
                                className="pl-4 pr-10 py-4 block whitespace-nowrap text-lg text-left"
                            >
                                {subCategory.name}
                            </a>
                            {subCategory.con && subCategory.con.length > 0 ? (
                                <ul className="absolute left-0 mt-1 hidden group-hover:flex flex-col ">
                                    {subCategory.con.map((conConCategory) => (
                                        <li key={conConCategory.id} className="relative whitespace-nowrap">
                                            <a
                                                href={`/sanpham/danhmuc/${subCategory.name}/${conConCategory.ten_danh_muc}`}
                                                className="px-4 py-1 block text-left text-gray-600 hover:bg-gray-200"
                                            >
                                                {conConCategory.ten_danh_muc}
                                            </a>
                                            {/* Kiểm tra và hiển thị danh mục con của danh mục con */}
                                            {conConCategory.con && conConCategory.con.length > 0 && (
                                                <ul className="absolute left-full top-0 mt-1 flex flex-col shadow-lg">
                                                    {conConCategory.con.map((grandChildCategory) => (
                                                        <li key={grandChildCategory.id} className="whitespace-nowrap">
                                                            <a
                                                                href={`/sanpham/danhmuc/${subCategory.name}/${conConCategory.ten_danh_muc}/${grandChildCategory.ten_danh_muc}`}
                                                                className="px-4 py-1 block text-left text-gray-600 hover:bg-white"
                                                            >
                                                                {grandChildCategory.ten_danh_muc}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <span className="pl-4 pr-8 py-1 block text-left text-gray-400">
                                    Chưa có danh mục
                                </span>
                            )}
                            {/* <div className="absolute right-0 top-0 h-full w-px bg-gray-200" /> */}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HoverMenu;
