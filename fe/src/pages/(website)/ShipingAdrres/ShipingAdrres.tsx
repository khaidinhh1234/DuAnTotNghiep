import { useForm } from "react-hook-form";
import AddressForm from "./_components/AddAdrres";
import ShippingAddress from "./_components/ShippingAddress";
import Subtotal from "./_components/subtotail";
import { useLocalStorage } from "@/components/hook/useStoratge";
import { useQuery } from "@tanstack/react-query";
import instanceClient from "@/configs/client";

const ShippingAddressPage = () => {
  // const [cartTotal] = useLocalStorage("cartTotal" as any, 0);
  // const products = cartTotal.details;
  const { data: checkout } = useQuery({
    queryKey: ["Checkout"],
    queryFn: async () => {
      try {
        const response = await instanceClient.get(`/gio-hang/chi-tiet`);
        return response.data;
      } catch (error) {
        throw new Error("Error fetching cart data");
      }
    },
  });
  const tong_tien = checkout?.chi_tiet_don_hang;
  const products = checkout?.chi_tiet_don_hang?.san_pham;

  const { register, handleSubmit } = useForm();
  const onsubmit = (data: any) => {
    console.log({ data });
  };
  return (
    <>
      <section className="container">
        <div className="lg:mx-12 mx-6 lg:my-[84px] my-[42px]">
          <h1 className="h1cart">Đặt hàng</h1>
          <form action="" onSubmit={handleSubmit(onsubmit)}>
            <div className="grid lg:grid-cols-12 lg:gap-20 px-0 justify-center">
              <div className="lg:col-span-6 xl:col-span-8 md:col-span-4 md:w-full w-[425px]">
                {/* <ShippingAddress /> */}
                <AddressForm
                  register={register}
                  products={products}
                  checkout={checkout}
                />
              </div>
              <Subtotal tong_tien={tong_tien} />
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default ShippingAddressPage;
