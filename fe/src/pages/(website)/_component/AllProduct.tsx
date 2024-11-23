
import { useState } from "react";

const AllProduct = () => {
  const [searchData] = useState(new URLSearchParams(window.location.search).get('query'));


  return (
    <>
      <section>
        <div className="container">
          <div className=" flex mt-[70px] mb-9">
            <p className="pr-2">Sản phẩm</p>
            --
            <p className="px-2">{searchData}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AllProduct;
