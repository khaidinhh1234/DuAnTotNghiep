
import React from 'react'
import Sidebar from './_components/sliber'
import ProductList from './_components/product'
import SearchSection from './_components/sheach'

const MyOrder = () => {
  return (
    <>
   <section className="container ">
   <div className="lg:mx-14 md:mx-6 lg:my-[80px] mt-[42px] ">
    <SearchSection/>
        <div className="grid lg:grid-cols-12 grid-cols-8 lg:gap-8 gap-2 lg:my-12 my-6">
    <Sidebar/>
    <ProductList/>
    </div>
    </div>
    </section>
    </>
  )
}
export default MyOrder