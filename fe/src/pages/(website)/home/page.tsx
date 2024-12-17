import { useQuery } from "@tanstack/react-query";
import Banner from "./_components/Banner";
import Bestseller from "./_components/Bestseller";
import Categories from "./_components/Categories";
import Customer from "./_components/Customer";
import DealsOfTheMonth from "./_components/DealsOfTheMonth";
import InstagramStories from "./_components/InstagramStories";
import Method from "../_component/Method";
import instanceClient from "@/configs/client";

const HomePage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["PRODUCTS_KEY", "TRANGCHU"],
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
    staleTime: 1000 * 60,
  });
  const chuong_trinh_uu_dai = data?.chuong_trinh_uu_dai || [];
  console.log(chuong_trinh_uu_dai);
  const danhgia = data?.danh_gia_khach_hang || [];

  const banner = data?.banner?.banner || [];
  const products = data?.danh_sach_san_pham_moi || [];
  const bo_suu_tap = data?.bo_suu_tap_ua_chuongs || [];
  // console.log(products);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg
          className="w-24 h-24"
          width={240}
          height={240}
          viewBox="0 0 240 240"
        >
          <circle
            className="pl__ring pl__ring--a"
            cx={120}
            cy={120}
            r={105}
            fill="none"
            stroke="#f42f25"
            strokeWidth={20}
            strokeDasharray="0 660"
            strokeDashoffset={-330}
            strokeLinecap="round"
          />
          <circle
            className="pl__ring pl__ring--b"
            cx={120}
            cy={120}
            r={35}
            fill="none"
            stroke="#f49725"
            strokeWidth={20}
            strokeDasharray="0 220"
            strokeDashoffset={-110}
            strokeLinecap="round"
          />
          <circle
            className="pl__ring pl__ring--c"
            cx={85}
            cy={120}
            r={70}
            fill="none"
            stroke="#255ff4"
            strokeWidth={20}
            strokeDasharray="0 440"
            strokeLinecap="round"
          />
          <circle
            className="pl__ring pl__ring--d"
            cx={155}
            cy={120}
            r={70}
            fill="none"
            stroke="#f42582"
            strokeWidth={20}
            strokeDasharray="0 440"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  return (
    <div>
      <Banner banner={banner} />
      <Categories bo_suu_tap={bo_suu_tap} />
      {products.length > 0 && (
        <Bestseller
          products={products}
          sectionTitle={"Sản phẩm mới nhất"}
          isPromotional={false}
        />
      )}
      <DealsOfTheMonth chuong_trinh_uu_dai={chuong_trinh_uu_dai} />
      <Customer danhgia={danhgia} />
      {/* <InstagramStories /> */}
      <Method />{" "}
    </div>
  );
};

export default HomePage;
