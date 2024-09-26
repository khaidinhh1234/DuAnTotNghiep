import instance from "@/configs/axios";
import { useQuery } from "@tanstack/react-query";
import type { SelectProps } from "antd";
import { Button, Divider, Form, Select } from "antd";
import { useState } from "react";
const options: SelectProps["options"] = [] as {
  label: string;
  value: string;
}[];
export default function App() {
  // const [voucherCode, setVoucherCode] = useState(""); // Duplicate declaration removed
  const [isAllSelected1, setIsAllSelected1] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const { data: danhmuc } = useQuery({
    queryKey: ["danhmuc"],
    queryFn: async () => {
      const response = await instance.get("/admin/danhmuc");
      return response.data;
    },
  });
  // console.log("danhmuc", danhmuc);
  const dm = danhmuc?.data?.map((item: any) => ({
    value: item.ten_danh_muc || item.id,
    label: item.ten_danh_muc || item.id,
  }));

  const [selectedValues1, setSelectedValues1] = useState<string[]>([]);

  const handleDeselectAll1 = () => {
    setSelectedValues1([]);
    setIsAllSelected1(false);
  };
  const handleSearch1 = (value: any) => {
    setSearchTerm(value);
  };
  const handleSelectAll1 = () => {
    const allValues = dm.map((option: any) => option.label);
    setSelectedValues1(allValues as any);
    setIsAllSelected1(true);
  };
  const handleChange1 = (value: string[]) => {
    setSelectedValues1(value);
    setIsAllSelected1(value.length === dm.length); // Cập nhật trạng thái chọn tất cả
    // console.log(`Selected: ${value}`);
  };

  // Gọi hàm tạo mã ngẫu nhiên khi component được load

  return (
    <div className="flex items-center mb-4">
      <label className="w-1/4 font-semibold">Chọn danh mục</label>
      <Form.Item
        name="productDiscount"
        rules={[
          {
            required: selectedValues1.length === 0,
            message: "Vui lòng chọn sản phẩm!",
          },
        ]}
        className="mb-0 w-[200px]"
      >
        <Select
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Please select"
          value={selectedValues1}
          onChange={handleChange1}
          onSearch={handleSearch1}
          options={dm}
          dropdownRender={(menu) => (
            <div>
              <Button
                type="link"
                onClick={isAllSelected1 ? handleDeselectAll1 : handleSelectAll1}
              >
                {isAllSelected1 ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </Button>
              <Divider style={{ margin: "4px 0" }} />
              {menu}
            </div>
          )}
        />{" "}
      </Form.Item>
    </div>
  );
}
