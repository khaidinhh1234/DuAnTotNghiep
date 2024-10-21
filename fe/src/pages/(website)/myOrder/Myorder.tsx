// import React from 'react'
import Sidebar from "./../_component/Slibar";

import ProductList from "./_components/product";
import SearchSection from "./_components/sheach";

const MyOrder = () => {
  return (
    <>
      <section className="container ">
        <div className="lg:mx-0 md:mx-6 lg:my-[80px] mt-[42px] ">
          <SearchSection />
          <div className="grid lg:grid-cols-12 grid-cols-8 lg:gap-8 gap-2 lg:my-12 my-6">
            <div className="lg:col-span-3 col-span-3 border border-hrblack xl:w-[262px] lg:w-[222px] w-[262px] lg:h-[524px] rounded-lg">
              <Sidebar />
            </div>{" "}
            <ProductList />
          </div>
        </div>
      </section>
    </>
  );
};
export default MyOrder;
