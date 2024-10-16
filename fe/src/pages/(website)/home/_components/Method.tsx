// import React from 'react'

const Method = () => {
  return (
    <>
    <section>
        {/* <!-- End Main --> */}
        <div className="container">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mt-12 mb-24"
          >
            <div className="mx-auto">
              <i className="fa-regular fa-box text-3xl"></i>
              <h3 className="font-bold text-xl mt-3 mb-2">Free Shipping</h3>
              <p>Free shipping for order above $150</p>
            </div>
            <div className="mx-auto">
              <i className="fa-regular fa-circle-dollar text-3xl"></i>
              <h3 className="font-bold text-xl mt-3 mb-2">Money Guarantee</h3>
              <p>Within 30 days for an exchange</p>
            </div>
            <div className="mx-auto">
              <i className="fa-regular fa-headphones text-3xl"></i>
              <h3 className="font-bold text-xl mt-3 mb-2">Online Support</h3>
              <p>24 hours a day, 7 days a week</p>
            </div>
            <div className="mx-auto">
              <i className="fa-light fa-credit-card text-3xl"></i>
              <h3 className="font-bold text-xl mt-3 mb-2">Flexible Payment</h3>
              <p>Pay with multiple credit cards</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Method