
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import instanceClient from "@/configs/client";

const AllProduct = () => {
  const { slug } = useParams();

  const { data: promotions } = useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const response = await instanceClient.get("/chuong-trinh-uu-dai");
      return response.data.data;
    },
  });

  const currentPromotion = promotions?.find(
    (promo : any) => promo.duong_dan === slug
  );

  return (
    <>
      <section>
        <div className="container">
          <div className="flex mt-[70px] mb-9">
            <p className="pr-2">Chương trình</p>
            --
            <p className="px-2">{currentPromotion?.ten_uu_dai || "Khuyến mãi"}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AllProduct;
