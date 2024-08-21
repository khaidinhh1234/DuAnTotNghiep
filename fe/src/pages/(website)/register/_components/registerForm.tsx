import { IUser } from "@/common/types/user";
import { registerSchema } from "@/common/validations/auth";
import instance from "@/configs/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
const SignupForm = () => {
  const nav = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>({
    resolver: zodResolver(registerSchema)
  })
  const { mutate} = useMutation({
    mutationFn: async (user: IUser) => {
      try {
        const {data} = await instance.post("/register", user)
        nav("/login")
        return data
      } catch (error: any) {
        throw new Error(error.response.data.message);
      }
    },
    onSuccess:() => {},
    onError: (error) => {
      console.error(error.message)
    }
  })
  const onSubmit = (data : any) => {
    mutate(data)
  }
  return (
    <section className="flex-1 flex items-center justify-center p-4 md:p-0">
      <div className="w-full max-w-md p-6 md:p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold mb-2">Create New Account</h2>
        <p className="text-gray-600 mb-6">Please enter details</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Robert"
              {...register("first_name", {required: true})}
            />
            {errors.first_name && <p className="text-red-600">{errors.first_name.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="Fox"
              {...register("last_name", {required: true})}
            />
            {errors.last_name && <p className="text-red-600">{errors.last_name.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="robertfox@example.com"
              {...register("email", {required: true})}
            />
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="••••••••••••••••"
              {...register("password",)}
            />
            {errors.password && <p className="text-red-600">{errors.password.message}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Comfirm Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-md"
              placeholder="••••••••••••••••"
              {...register("confirmPassword", {required: true})}
            />
            {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword.message}</p>}
          </div>
          <div className="flex items-center mb-6">
            <input type="checkbox" className="mr-2" />
            <span className="text-sm text-gray-600">
              I agree to the <span className="font-semibold">Terms & Conditions</span>
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-md hover:bg-gray-800 text-sm font-bold"
          >
            Signup
          </button>
        </form>
      </div>
    </section>
  );
};

export default SignupForm;
