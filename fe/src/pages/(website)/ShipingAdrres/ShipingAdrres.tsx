import React from 'react';
import ShippingAddress from './_components/ShippingAddress';
import Subtotal from './_components/subtotail';
import AddressForm from './_components/AddAdrres';


const ShippingAddressPage = () => (
  <>
    <section className="container">
        <div className="lg:mx-12 mx-6 lg:my-[84px] my-[42px]">
          <h1 className="h1cart">Shipping Address</h1>
          <div className="grid lg:grid-cols-12 lg:gap-20 px-0 justify-center">
          <div
              className="lg:col-span-6 xl:col-span-8 md:col-span-4 md:w-full w-[425px]"
            >
      <ShippingAddress />
          <AddressForm />
        </div>
          <Subtotal />
        </div>
      </div>
      </section>
  </>
);

export default ShippingAddressPage;
