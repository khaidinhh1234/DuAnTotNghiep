import { story } from "@/assets/img";
import instanceClient from "@/configs/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const InstagramStories = () => {
  const { data } = useQuery({
    queryKey: ["newdetail"],
    queryFn: async () => {
      const res = await instanceClient.get("/danh-muc-tin-tuc");
      return res.data;
    },
  });

  return (
    <>
      <section>
        <div>
          <div className="mt-20">
            <div className="grid justify-center items-center bg-black text-white">
              <h1 className="text-4xl font-semibold pl-9 my-5 ">
                Glow Clothing tự hào thương hiệu Việt
              </h1>
            </div>
            <div className="container">
              <div className="grid grid-cols-12 gap-3 mb-24 mt-10">
                {data?.danhMucCha?.map((newsItem: any) => {
                  const anhtintuc = newsItem.tin_tuc[0]?.anh_tin_tuc;
                  return (
                    <div
                      key={newsItem.id}
                      className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12 relative w-[300px] h-[300px] product-card mx-auto overflow-hidden group"
                    >
                      <Link to={`/tin-tuc-theo-danh-muc/${newsItem.duong_dan}`}>
                        <img
                          src={anhtintuc}
                          alt={newsItem.ten_danh_muc_tin_tuc}
                          className="w-full h-full bg-center bg-cover bg-no-repeat transition-transform duration-300"
                        />
                      </Link>
                      <div className="absolute inset-0 flex flex-col justify-center items-center opacity-100 transition-opacity duration-300">
                        {/* Category name displayed on image */}
                        <h1 className="text-xl font-bold text-white text-center mb-2 drop-shadow-lg">
                          {newsItem.ten_danh_muc_tin_tuc}
                        </h1>
                        {/* Icon below category name */}
                        <button className="btn w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <i className="fa-solid fa-eye text-black text-lg"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InstagramStories;
