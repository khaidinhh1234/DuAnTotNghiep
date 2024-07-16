import { banner2 } from '@/assets/img'
import React from 'react'

const DealsOfTheMonth = () => {
  return (
    <>
    <section className="bg-white">
        <div
          className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-6 mb-32"
        >
          <div className="order-2 md:order-1 w-full md:w-1/2 p-6">
            <h2 className="text-4xl font-bold mb-4">Deals of the Month</h2>
            <p className="text-gray-700 mb-7">
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters.
            </p>
            <div className="flex space-x-4 text-center mb-14">
              <div
                className="border border-black/10 px-4 py-1 shadow shadow-slate-600/10 rounded-lg"
              >
                <div className="text-3xl font-bold pt-1">120</div>
                <div className="mt-2 text-xl text-gray-500">Days</div>
              </div>
              <div
                className="border border-black/10 px-4 py-1 shadow shadow-slate-600/10 rounded-lg"
              >
                <div className="text-3xl font-bold pt-1">18</div>
                <div className="mt-2 text-xl text-gray-500">Hours</div>
              </div>
              <div
                className="border border-black/10 px-5 py-1 shadow shadow-slate-600/10 rounded-lg"
              >
                <div className="text-3xl font-bold pt-1">15</div>
                <div className="mt-2 text-xl text-gray-500">Mins</div>
              </div>
              <div
                className="border border-black/10 px-5 py-1 shadow shadow-slate-600/10 rounded-lg"
              >
                <div className="text-3xl font-bold pt-1">10</div>
                <div className="mt-2 text-xl text-gray-500">Secs</div>
              </div>
            </div>

            <button className="bg-black text-white py-4 px-9 rounded-lg">
              View All Products <i className="fa-solid fa-arrow-right pl-1"></i>
            </button>
          </div>
          <div className="order-1 md:order-2 w-full md:w-1/2 p-6">
            <img
              src={banner2}
              alt="Deal Image"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>
    </>
  )
}

export default DealsOfTheMonth