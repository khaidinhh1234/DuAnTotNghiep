import { useEffect } from "react";

const AddAddressForm = ({
  register,
  handleSubmit,
  watch,
  onAddAddress,
  errors,
}: any) => {
  // const name = watch("name");
  // const mobileNumber = watch("mobileNumber");
  // const addressLine1 = watch("addressLine1");
  // const note = watch("note");
  // useEffect(() => {
  //   // Check if all 4 fields have data
  //   if (name && mobileNumber && addressLine1 && note) {
  //     const formData = { name, mobileNumber, addressLine1, note };
  //     onAddAddress(formData);
  //     console.log(formData);
  //   }
  // }, [name, mobileNumber, addressLine1, note]);

  return (
    <div>
      <h3 className="title-h3">Thêm địa chỉ mới</h3>
      <form
        className="my-7"
        onSubmit={handleSubmit((data) => onAddAddress(data))}
      >
        <div className="my-5">
          <label htmlFor="name" className="text-md px-1">
            Họ và Tên
          </label>
          <input
            type="text"
            {...register("name", { required: true })}
            placeholder="Nhập họ và tên"
            className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="my-5">
          <label htmlFor="mobileNumber" className="text-md px-1">
            Số điện thoại
          </label>
          <input
            type="text"
            {...register("mobileNumber", {
              required: true,
            })} // Add maxLength and minLength
            placeholder="Nhập số điện thoại"
            className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
          />
          {errors.mobileNumber && (
            <p className="text-red-500">{errors.mobileNumber.message}</p>
          )}
        </div>

        <div className="my-5">
          <label htmlFor="addressLine1" className="text-md px-3">
            Địa chỉ nhận hàng
          </label>
          <input
            type="text"
            {...register("addressLine1", {
              required: true,
            })}
            placeholder="Nhập địa chỉ nhận hàng"
            className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
          />
          {errors.addressLine1 && (
            <p className="text-red-500">{errors.addressLine1.message}</p>
          )}
        </div>

        <div className="my-5">
          <label htmlFor="note" className="text-md px-3">
            Ghi chú
          </label>
          <textarea
            rows={4}
            cols={50}
            {...register("note")}
            placeholder="Ghi chú"
            className="border border-t-2 border-l-2 border-blackL px-5 py-3 w-[400px] sm:w-[460px] md:w-[720px] focus:ring-1 focus:ring-slate-500 rounded-xl"
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn-black px-10 w-[320px] my-4 mx-auto py-3 rounded-lg text-md font-medium flex items-center justify-center"
        >
          Thêm địa chỉ <i className="fa-solid fa-arrow-right ml-2 text-xl"></i>
        </button>
      </form>
    </div>
  );
};

export default AddAddressForm;
