import { useQuery } from "@tanstack/react-query";
import Banner from "./_components/Banner";
import Bestseller from "./_components/Bestseller";
import Categories from "./_components/Categories";
import Customer from "./_components/Customer";
import DealsOfTheMonth from "./_components/DealsOfTheMonth";
import InstagramStories from "./_components/InstagramStories";
import Method from "./_components/Method";
import instanceClient from "@/configs/client";

const HomePage = () => {
  const { data } = useQuery({
    queryKey: ["PRODUCTS_KEY"],
    queryFn: async () => {
      try {
        const response = await instanceClient.get("trangchu");
        if (response.data.status_code !== 200) {
          throw new Error("Lỗi khi lấy thông tin");
        }
        return response.data;
      } catch (error) {
        throw new Error("Lỗi khi lấy thông tin");
      }
    },
  });
  // console.log(data?.danh_gia_khach_hang);
  const banner = data?.banner?.banner || [];
  const products = data?.danh_sach_san_pham_moi || [];
  const bo_suu_tap = data?.bo_suu_tap_ua_chuongs || [];
  return (
    <div>
      <Banner banner={banner} />
      <Categories bo_suu_tap={bo_suu_tap} />
      <Bestseller products={products} />
      <DealsOfTheMonth />
      <Customer />
      <InstagramStories />
      <Method />{" "}
    </div>
  );
};

export default HomePage;
