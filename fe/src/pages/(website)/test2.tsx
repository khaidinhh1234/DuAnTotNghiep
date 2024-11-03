import React, { useState } from "react";
import type { PaginationProps } from "antd";
import { Pagination, List } from "antd";

interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = Array.from({ length: 500 }, (_, index) => ({
  id: index + 1,
  name: `Sản phẩm ${index + 1}`,
  price: Math.floor(Math.random() * 100) + 1, // Giá ngẫu nhiên từ 1 đến 100
}));

const Test2: React.FC = () => {
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const total = products.length; // Tổng số sản phẩm

  const onChange: PaginationProps["onChange"] = (page) => {
    setCurrent(page);
  };

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    size
  ) => {
    setCurrent(current);
    setPageSize(size);
  };

  // Tính toán các sản phẩm hiển thị dựa trên trang hiện tại và kích thước trang
  const startIndex = (current - 1) * pageSize;
  const currentProducts = products.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <List
        bordered
        dataSource={currentProducts}
        renderItem={(item) => (
          <List.Item>
            ID: {item.id}, Tên: {item.name}, Giá: {item.price} VNĐ
          </List.Item>
        )}
      />
      <Pagination
        current={current}
        pageSize={pageSize}
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
        onChange={onChange}
        total={total}
      />
    </>
  );
};

export default Test2;
