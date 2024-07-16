import { our1, our2 } from '@/assets/img'
import React from 'react'

const OurMission = () => {
  return (
    <>
    <section id="OurMission" className="mb-16 bg-neutral-200 pt-10 pb-20">
        <div className="container">
          <h2 className="lg:text-4xl text-2xl font-semibold mb-10 text-center">
            Our Mission
          </h2>
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-6">
              <h3 className="lg:text-[40px] text-2xl font-semibold py-3">
                Fashion and Comfort
              </h3>
              <p className="lg:text-lg lg:max-w-lg my-3 font-medium">
                We are dedicated to offering stylish and comfortable clothing to
                our customers. Our goal is to blend fashion trends with everyday
                comfort, ensuring that our apparel enhances both style and ease.
              </p>
              <img
                src={our1}
                alt=""
                className="lg:w-[560px] lg:h-[648px] w-[260px] h-[348px] py-3"
              />
            </div>
            <div className="col-span-6">
              <img
                src={our2}
                alt=""
                className="lg:w-[560px] lg:h-[648px] w-[260px] h-[348px] py-3"
              />
              <h3 className="lg:text-[40px] text-2xl font-semibold py-3">
                Quality and Confidence
              </h3>
              <p className="lg:text-lg lg:max-w-lg my-3 font-medium">
                We strive to deliver garments of exceptional quality that
                inspire confidence. Each piece is crafted with meticulous
                attention to detail, ensuring not only aesthetic appeal but also
                durability and satisfaction for our customers
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default OurMission