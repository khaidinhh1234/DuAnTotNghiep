import PaymentForm from "./_components/paymentForm";
import Subtotal from "./_components/subtotail";

const Payment = () => {
  return (
    <>
      <section className="container">
        <div className="lg:mx-12 mx-6 lg:my-[84px] my-[42px]">
          <h1 className="h1cart">Phương thước thanh toán</h1>
          <div className="grid lg:grid-cols-12 lg:gap-20 px-0 justify-center">
            <PaymentForm />
            <Subtotal />
          </div>
        </div>
      </section>
    </>
  );
};
export default Payment;
