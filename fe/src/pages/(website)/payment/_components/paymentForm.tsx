import React from 'react';

const PaymentForm = () => {
  return (
    <div className="lg:col-span-6 xl:col-span-8 md:col-span-4 md:w-full w-[425px]">
      <div className="mb-7">
        <div className="flex items-center space-x-0">
          <div className="pl-1">
            <i
              className="fa-regular fa-house bg-blackL w-11 h-11 rounded-lg px-[10px] py-3 text-xl mb-2"
              style={{ color: '#ffffff' }}
            ></i>
          </div>
          <hr className="m-0 dashed-black" />
          <div className="text-center">
            <i
              className="fa-light fa-credit-card bg-blackL text-white w-11 h-11 rounded-lg px-[10px] py-3 text-xl mb-2"
            ></i>
          </div>
          <hr className="m-0 dashed-line" />
          <div className="pr-1 text-center">
            <i
              className="fa-light fa-file-invoice bg-stone-100 w-11 h-11 rounded-lg px-[10px] py-3 text-xl mb-2"
            ></i>
          </div>
        </div>
        <div className="flex justify-between space-x-0">
          <div className="text-center">
            <span>Địa chỉ</span>
          </div>
          <div className="text-center">
            <span>Phương thức thanh toán</span>
          </div>
          <div className="text-center">
            <span>Đánh giá</span>
          </div>
        </div>
      </div>

      <div className="mt-[30px]">
        <h3 className="title-h3">Chọn phương thức thanh toán</h3>

        <form className="my-7 mb-8">
          <div className="my-5 flex items-center custom-radio">
            <input
              type="radio"
              id="creditCard"
              name="paymentMethod"
              className="bg-blackL"
            />
            <label htmlFor="creditCard" className="title-h3 px-3">Thẻ ghi nợ/Thẻ tín dụng</label>
          </div>

          <div className="my-5">
            <label htmlFor="cardNumber" className="text-md px-1">Số thẻ</label><br />
            <input
              type="text"
              id="cardNumber"
              value="3897 22XX XXXX 3890"
              placeholder="Nhập số thẻ"
              className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] lg:w-[460px] md:w-[720px] xl:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
            />
          </div>
          <div className="my-5">
            <label htmlFor="cardName" className="text-md px-1">Tên chủ thẻ</label><br />
            <input
              type="text"
              id="cardName"
              value="John Doe"
              placeholder="Nhập tên chủ thẻ"
              className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] lg:w-[460px] md:w-[720px] xl:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
            />
          </div>
          <div className="flex justify-between xl:w-[720px] md:w-[720px] lg:w-[460px] w-[400px] mb-7">
            <div>
              <label htmlFor="expiryDate" className="text-md px-3">Ngày hết hạn</label><br />
              <input
                type="text"
                id="expiryDate"
                value="09/26"
                className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[190px] lg:w-[210px] xl:w-[350px] md:w-[350px] focus:ring-1 focus:ring-slate-500 rounded-xl"
              />
            </div>
            <div>
              <label htmlFor="cvv" className="text-md px-3">CVV</label><br />
              <input
                type="text"
                id="cvv"
                value="***"
                className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[190px] lg:w-[210px] xl:w-[350px] md:w-[350px] focus:ring-1 focus:ring-slate-500 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            className="hidden lg:block btn-black px-10 w-[320px] py-4 rounded-lg text-md font-medium"
          >
            Thêm thẻ
          </button>
        </form>

        <form>
          <div className="border-t border-hrBlack pt-7 mb-5 flex items-center custom-radio">
            <input
              type="radio"
              id="googlePay"
              name="paymentMethod"
              className="bg-blackL"
            />
            <label htmlFor="googlePay" className="title-h3 px-3">Google Pay</label>
          </div>
          <div className="border-t border-hrBlack pt-4 mb-5 flex items-center custom-radio">
            <input
              type="radio"
              id="paypal"
              name="paymentMethod"
              className="bg-blackL"
            />
            <label htmlFor="paypal" className="title-h3 px-3">Paypal</label>
          </div>
          <div className="border-t border-hrBlack pt-4 mb-7 flex items-center custom-radio">
            <input
              type="radio"
              id="cashOnDelivery"
              name="paymentMethod"
              className="bg-blackL"
            />
            <label htmlFor="cashOnDelivery" className="title-h3 px-3">Thanh toán khi nhận hàng</label>
          </div>
          <a href="ordersummary.html">
            <button
              className="btn-black px-10 w-[320px] py-4 rounded-lg mb-5 text-md font-medium"
            >
              Tiếp tục
            </button>
          </a>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
{/* <div className="flex justify-around gap-3 my-4">
  <button className="bg-slate-200 hover:bg-blackL hover:text-white border border-slate-300 hover:border-transparent rounded-md px-4 py-1 text-sm max-w-[120px]">
    <i className="fa-regular fa-pen-to-square lowercase"></i> Edit
  </button>
  <button className="bg-rose-100 text-red-400 hover:bg-[#FF7262] hover:text-white border border-rose-200 hover:border-transparent rounded-md px-4 py-1 text-sm max-w-[120px]">
    <i className="fa-regular fa-trash-can"></i> Delete
  </button>
</div> */}
//<div className="flex justify-around gap-3 my-4">
{/* <button className="bg-slate-200 hover:bg-blackL hover:text-white border border-slate-300 hover:border-transparent rounded-md px-2 py-1 text-sm">
<i className="fa-regular fa-pen-to-square lowercase"></i> Edit
</button>
<button className="bg-rose-100 text-red-400 hover:bg-[#FF7262] hover:text-white border border-rose-200 hover:border-transparent rounded-md px-2 py-1 text-sm">
<i className="fa-regular fa-trash-can"></i> Delete
</button>
</div> */}
