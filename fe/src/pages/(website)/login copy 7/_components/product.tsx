import React from 'react';

const ProductItem = ({ status, price }) => {
  return (
    <div className="pb-6 flex justify-between border-b border-hrBlack">
      <div className="grid justify-between">
        <div className="flex gap-5 items-center">
          <img
            src="../assets/images/checkout/sanpham1.png"
            alt="Product"
            className="w-12 h-12"
          />
          <div className="px-1">
            <h3 className="font-bold my-1">Grils Pink Moana Printed Dress</h3>
            <p className={`font-bold md:hidden block ${status === 'Delivered' ? '' : 'hidden'}`}>
              Price: ${price}
            </p>
            <p>Size: <span>S</span></p>
            <p>Qyt: 1</p>
          </div>
        </div>
        <div className="mt-9 px-7">
          <a href="#" className={`text-xs px-2 py-1 rounded-sm ${status === 'Delivered' ? 'delivered' : 'inprocrass'}`}>
            {status}
          </a>
          <span>Your product has been {status}</span>
        </div>
      </div>
      <div className={`text-center py-8 font-bold ${status === 'Delivered' ? 'md:block hidden' : ''}`}>
        <p>${price}</p>
      </div>
      <div className="hidden sm:block">
        <button className="hover:bg-blackL hover:text-white shadow font-medium shadow-black/50 text-sm py-3 px-6 mb-2 rounded-lg">
          View Order
        </button>
        <br />
        <button
          className={`${
            status === 'Delivered' ? 'bg-[#FF7262] hover:bg-[#e9b2ac]' : 'bg-[#FF7262] hover:bg-[#e9b2ac]'
          } shadow-lg shadow-slate-600/50 text-white px-5 text-sm py-3 rounded-lg`}
        >
          {status === 'Delivered' ? 'Cancel Order' : 'Cancel Order'}
        </button>
      </div>
    </div>
  );
};

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
