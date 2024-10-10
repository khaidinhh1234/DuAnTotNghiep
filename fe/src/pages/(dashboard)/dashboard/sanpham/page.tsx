import Chart5 from "./chart5/chart5";
import Chart6 from "./chart6/chart6";

// const { RangePicker } = DatePicker;
const SanPham = () => {
  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6"> Thống kê Sản Phẩm</h2>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-1 px-6">
          <Chart5 />
          <Chart6 />
        </div>
      </div>
    </>
  );
};

export default SanPham;
