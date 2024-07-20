
import React from 'react'
import Sidebar from './_components/sliber'
import ProductList from './_components/product'

const MyOrder = () => {
  return (
    <>
    <div className="h-screen overflow-hidden bg-gray-100 md:bg-white">
    <div className="flex flex-col md:flex-row min-h-screen">
    <Sidebar/>
    <ProductList/>
    </div>
    </div>
    </>
  )
}
export default MyOrder