
import { useParams } from "react-router-dom";

const AllProduct = () => {
  const { slug } = useParams();


  return (
    <>
      <section>
        <div className="container">
          <div className=" flex mt-[70px] mb-9">
            <p className="pr-2">Sản phẩm</p>
            --
            <p className="px-2">{slug}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AllProduct;
