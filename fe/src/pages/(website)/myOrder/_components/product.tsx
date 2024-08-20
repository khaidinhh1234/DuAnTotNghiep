import { sanPham2 } from '@/assets/img';
import React from 'react';

// Component hiển thị thông tin sản phẩm
const ProductItem = ({ status, price }) => {
  return (
    <div className="pb-6 flex justify-between border-b border-hrBlack">
      <div className="grid justify-between">
        <div className="flex gap-5 items-center">
          <img
            src={sanPham2}
            alt="Sản phẩm"
            className="w-12 h-12"
          />
          <div className="px-1">
            <h3 className="font-bold my-1">Váy In Họa Tiết Moana Hồng</h3>
            <p className={`font-bold md:hidden block ${status === 'Delivered' ? '' : 'hidden'}`}>
              Giá: ${price}
            </p>
            <p>Size: <span>S</span></p>
            <p>Số lượng: 1</p>
          </div>
        </div>
        <div className="mt-9 px-7">
          <a href="#" className={`text-xs px-2 py-1 rounded-sm ${status === 'Delivered' ? 'delivered' : 'inprocrass'}`}>
            {status === 'Delivered' ? 'Đã Giao' : 'Đang Xử Lý'}
          </a>
          <span>Sản phẩm của bạn đã {status === 'Delivered' ? 'được giao' : 'đang được xử lý'}</span>
        </div>
      </div>
      <div className={`text-center py-8 font-bold ${status === 'Delivered' ? 'md:block hidden' : ''}`}>
        <p>${price}</p>
      </div>
      <div className="hidden sm:block">
        <button className="hover:bg-blackL hover:text-white shadow font-medium shadow-black/50 text-sm py-3 px-6 mb-2 rounded-lg">
          Xem Đơn Hàng
        </button>
        <br />
        <button
          className={`${
            status === 'Delivered' ? 'bg-[#FF7262] hover:bg-[#e9b2ac]' : 'bg-[#FF7262] hover:bg-[#e9b2ac]'
          } shadow-lg shadow-slate-600/50 text-white px-5 text-sm py-3 rounded-lg`}
        >
          {status === 'Delivered' ? 'Hủy Đơn Hàng' : 'Hủy Đơn Hàng'}
        </button>
      </div>
    </div>
  );
};

// Component hiển thị danh sách sản phẩm
const ProductList = () => {
  return (
    <div className="lg:col-span-9 col-span-8 lg:pl-9">
      <ProductItem status="Delivered" price="80.00" />
      <ProductItem status="In Progress" price="80.00" />
      <ProductItem status="In Progress" price="80.00" />
    </div>
  );
};

export default ProductList;
