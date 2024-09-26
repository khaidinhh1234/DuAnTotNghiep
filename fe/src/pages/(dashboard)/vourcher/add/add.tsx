import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Tabs,
  Button,
  Divider,
  Radio,
} from "antd";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import type { GetProps, SelectProps } from "antd";
const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";
const weekFormat = "MM/DD";
const monthFormat = "YYYY/MM";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/axios";
const { Option } = Select;
const options: SelectProps["options"] = [] as {
  label: string;
  value: string;
}[];
const AddVoucher = () => {
  const [form] = Form.useForm();
  // const [voucherCode, setVoucherCode] = useState(""); // Duplicate declaration removed
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [isAllSelected2, setIsAllSelected2] = useState(false);

  const [tabKey, setTabKey] = useState(true);
  const [max, setMax] = useState(479000);
  const [voucher, setVoucher] = useState(26010);
  const [phantram, setphantram] = useState(30);
  const [voucherCode, setVoucherCode] = useState("");
  const [value, setValue] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedValues2, setSelectedValues2] = useState<string[]>([]);

  const [isAllSelected1, setIsAllSelected1] = useState(false);
  const [rank, setrank] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  // const productList = [
  //   { value: "Áo Thun Nam", label: "Áo Thun Nam" },
  //   { value: "Áo Sơ Mi Nam", label: "Áo Sơ Mi Nam" },
  //   { value: "Áo Thun Nữ", label: "Áo Thun Nữ" },
  //   { value: "Áo Sơ Mi Nữ", label: "Áo Sơ Mi Nữ" },
  //   { value: "Điện thoại", label: "Điện thoại" },
  //   { value: "Laptop", label: "Laptop" },
  // ];
  //mã khuyến mãi
  const generateRandomCode = () => {
    const length = 8; // Độ dài mã khuyến mãi
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomCode = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomCode += characters.charAt(randomIndex);
    }

    setVoucherCode(randomCode); // Cập nhật voucherCode
  };
  //call api
  const { data: sanpham } = useQuery({
    queryKey: ["sanpham"],
    queryFn: async () => {
      const response = await instance.get("/admin/sanpham");
      return response.data;
    },
  });
  // console.log("sanpham", sanpham);
  const sp = sanpham?.data?.map((item: any) => ({
    value: item.ten_san_pham || item.id,
    label: item.ten_san_pham || item.id,
  }));
  // console.log("sp", sp);
  const {
    data: hang,
    isLoading: hangLoading,
    isError: hangError,
  } = useQuery({
    queryKey: ["hang"],
    queryFn: async () => {
      const response = await instance.get("admin/hangthanhvien");
      return response.data;
    },
  });

  const data = hang?.data?.map((item: any) => ({
    value: item.ten_hang_thanh_vien,
    label: item.ten_hang_thanh_vien,
  }));
  // check date
  const handleSubmit = (values: any) => {
    const formattedEndDate = values.endDate
      ? DateTime.fromJSDate(values.endDate.toDate()).toFormat("dd/MM/yyyy")
      : null;

    const formValues = { ...values, endDate: formattedEndDate };
    console.log("Form Values: ", formValues);
  };

  // Removed duplicate declaration of generateRandomCode
  // sảm phẩm
  const handleDeselectAll = () => {
    setSelectedValues([]);
    setIsAllSelected(false);
  };

  const handleProductChange = (value: any) => {
    if (isAllSelected) {
      if (value.length > 0) {
        setIsAllSelected(false);
        setSelectedProducts(value);
      }
    } else {
      if (value.length === sp.length) {
        setIsAllSelected(true);
      }
      setSelectedProducts(value);
    }

    // if (value.length > 0) {
    //   setSearchTerm("");
    // }
  };
  const handleSelectAll = () => {
    const allValues = sp.map((option: any) => option.label);
    setSelectedValues(allValues as any);
    setIsAllSelected(true);
  };
  const handleChange = (value: string[]) => {
    setSelectedValues(value);
    setIsAllSelected(value.length === sp.length); // Cập nhật trạng thái chọn tất cả
    // console.log(`Selected: ${value}`);
  };
  const handleChange2 = (value: string[]) => {
    setSelectedValues2(value);
    setIsAllSelected2(value.length === data.length); // Cập nhật trạng thái chọn tất cả
    // console.log(`Selected: ${value}`);
  };
  type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
  //danhmuc

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

  useEffect(() => {
    generateRandomCode();
  }, []);

  if (hangLoading) return <p>Loading...</p>;
  if (hangError) return <p>error...</p>;
  return (
    <main className="relative flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="md:text-base">
          <span className="font-semibold">Thêm mới mã khuyến mãi</span>
        </h1>
        <div className="flex gap-2 ml-auto">
          <Link to="/admin/vouchers">
            <Button className="bg-[rgb(37,150,190)] text-white rounded-lg py-1 hover:bg-[rgb(37,150,190,0.8)] flex items-center gap-2">
              <ArrowLeftOutlined className="text-white" />
              Quay lại
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:gap-6 ">
        <div className=" w-full lg:w-[calc(100%+300px)] max-w-7xl">
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            autoComplete="off"
          >
            <div className="my-3 w-[50%]">
              <Form.Item
                name="code"
                initialValue={voucherCode}
                // rules={[
                //   { required: true, message: "Vui lòng nhập mã khuyến mãi!" },
                // ]}
              >
                <div className="flex items-center ">
                  <Input
                    value={voucherCode}
                    readOnly
                    className="rounded-md flex-1 shadow-lg"
                  />
                  <Button
                    onClick={generateRandomCode}
                    className="ml-4 bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Đổi mã
                  </Button>
                </div>
              </Form.Item>
            </div>

            <div className="bg-white p-8 shadow-lg rounded-lg">
              <div className="flex">
                <div className=" w-[80%]">
                  <div className="flex flex-col-3 gap-6">
                    <Form.Item
                      label="Tên khuyến mãi"
                      name="mo_ta"
                      initialValue="Mã giảm giá khuyến mãi đặc biệt "
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng chọn Nhập tên khuyễn mãi!",
                        },
                      ]}
                      className="mb-0 w-[50%]"
                    >
                      <Input placeholder="Nhập tên khuyến mãi" />
                    </Form.Item>
                  </div>
                  <div className="flex items-center my-2">
                    {" "}
                    <Form.Item
                      className="w-[50%] mb-4"
                      label="Ngày bắt đầu"
                      name="ngay_ket_thuc"
                      rules={[
                        {
                          required: true,
                          message: "Bắt buộc phải điền!",
                        },
                        {
                          validator: (_, value) =>
                            value && value.isBefore(dayjs(), "day")
                              ? Promise.reject(
                                  new Error(
                                    "Ngày bắt đầu không thấp hơn ngày hiện tại!"
                                  )
                                )
                              : Promise.resolve(),
                        },
                      ]}
                    >
                      <DatePicker
                        className="w-[60%] "
                        disabledDate={(current) =>
                          current && current < dayjs().startOf("day")
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      label="Ngày kết thúc"
                      name="ngay_bat_dau"
                      className="w-[100%] mb-4"
                      rules={[
                        {
                          required: true,
                          message: "Bắt buộc phải điền!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const startDate = getFieldValue(
                              "ngay_khuyen_mai_bat_dau"
                            );
                            if (!value || !startDate) {
                              return Promise.resolve();
                            }
                            if (value.isBefore(startDate, "day")) {
                              return Promise.reject(
                                new Error(
                                  "Ngày kết thúc không thấp hơn ngày bắt đầu!"
                                )
                              );
                            }
                            if (value.diff(startDate, "day") > 365) {
                              return Promise.reject(
                                new Error(" không quá 365 ngày!")
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <DatePicker className="w-[40%]" />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      label="Ngày bắt đầu sưu tầm"
                      name="ngay_suu_tam"
                      className="w-[100%] mb-4"
                      rules={[
                        {
                          required: true,
                          message: "Bắt buộc phải điền!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const startDate = getFieldValue(
                              "ngay_khuyen_mai_bat_dau"
                            );
                            const endDate = getFieldValue("endDate");
                            if (!value || !startDate || !endDate) {
                              return Promise.resolve();
                            }
                            if (
                              value.isBefore(startDate, "day") ||
                              value.isAfter(endDate, "day")
                            ) {
                              return Promise.reject(
                                new Error(
                                  "Ngày bắt đầu sưu tầm phải nằm trong khoảng ngày khuyến mãi!"
                                )
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <DatePicker
                        className="w-[40%]"
                        disabledDate={(current) =>
                          current && current < dayjs().startOf("day")
                        }
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      label="Mã giảm giá áp dụng cho"
                      className="w-[100%] mb-4"
                      name="khuyen_mai_san_pham"
                    >
                      <Radio.Group
                        className="flex "
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                      >
                        <Radio
                          value=""
                          className="flex flex-row items-end flex-nowrap"
                        >
                          Toàn gian hàng
                        </Radio>
                        <Radio
                          value="2"
                          className="flex flex-row items-end flex-nowrap "
                        >
                          Danh mục sản phẩm
                        </Radio>
                        <Radio
                          value="1"
                          className="flex flex-row items-end flex-nowrap "
                        >
                          Sản phẩm được chọn (danh sách sản phẩm sẽ được cập
                          nhật sau khi thiết lập điều kiện giảm giá)
                        </Radio>
                      </Radio.Group>
                      {Number(value) === 1 ? (
                        <div className="flex items-center my-4">
                          <label className="w-1/4 font-semibold">
                            Chọn sản phẩm
                          </label>
                          <div
                            // rules={[
                            //   {
                            //     required: selectedValues.length === 0,
                            //     message: "Vui lòng chọn sản phẩm!",
                            //   },
                            // ]}
                            className="mb-0 w-[200px]"
                          >
                            <Select
                              mode="multiple"
                              allowClear
                              style={{ width: "100%" }}
                              placeholder="Please select"
                              value={selectedValues}
                              onChange={handleChange}
                              // onSearch={handleSearch}
                              options={sp}
                              dropdownRender={(menu) => (
                                <div>
                                  <Button
                                    type="link"
                                    onClick={
                                      isAllSelected
                                        ? handleDeselectAll
                                        : handleSelectAll
                                    }
                                  >
                                    {isAllSelected
                                      ? "Bỏ chọn tất cả"
                                      : "Chọn tất cả"}
                                  </Button>
                                  <Divider style={{ margin: "4px 0" }} />
                                  {menu}
                                </div>
                              )}
                            />{" "}
                          </div>
                        </div>
                      ) : Number(value) === 2 ? (
                        <div className="flex items-center my-4">
                          <label className="w-1/4 font-semibold">
                            Chọn danh mục
                          </label>
                          <div
                            // name="productDiscount"
                            // rules={[
                            //   {
                            //     required: selectedValues1.length === 0,
                            //     message: "Vui lòng chọn danh mục!",
                            //   },
                            // ]}
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
                                    onClick={
                                      isAllSelected1
                                        ? handleDeselectAll1
                                        : handleSelectAll1
                                    }
                                  >
                                    {isAllSelected1
                                      ? "Bỏ chọn tất cả"
                                      : "Chọn tất cả"}
                                  </Button>
                                  <Divider style={{ margin: "4px 0" }} />
                                  {menu}
                                </div>
                              )}
                            />{" "}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}{" "}
                    </Form.Item>
                  </div>{" "}
                </div>
              </div>
            </div>
            <div className="bg-white p-8 shadow-lg rounded-lg w-full my-5">
              <h1>Voucher Thông Minh</h1>{" "}
              <Form.Item className="flex items-center whitespace-nowrap">
                <Button
                  type="primary"
                  disabled={tabKey}
                  className={`mr-2 whitespace-nowrap ${tabKey ? "text-slate-400" : "text-white"}`}
                  onClick={() => setTabKey(true)}
                >
                  <span className="text-sm">Áp dụng voucher thông minh</span>
                </Button>
                <p className="flex items-center whitespace-nowrap">
                  Thông số được tạo bởi Smart AI. Mức độ hiệu quả hiện tại:{" "}
                  <span
                    className={`ml-1  font-semibold ${tabKey ? "text-green-500" : "text-red-500"}`}
                  >
                    {tabKey ? "Cao" : "Thấp"}
                  </span>
                </p>
              </Form.Item>
              <div className="flex gap-5 my-5">
                <div
                  className={`relative  border p-3 rounded-lg + ${tabKey ? "border-blue-600" : ""}`}
                  onClick={() => setTabKey(true)}
                >
                  {tabKey && (
                    <div className="absolute top-0 right-0">
                      <div className="w-6 h-10 overflow-hidden">
                        <div className="w-12 h-16 bg-blue-500 transform rotate-45 origin-bottom-left relative right-2 -top-[69px]">
                          <span className="absolute bottom-[1px] right-[17px] -rotate-45 text-white text-xs font-bold">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <h3>Mã giảm giá cố định</h3>
                  <div
                    className={`grid grid-cols-5  px-3 py-5  rounded-lg 
                     ${tabKey ? "bg-blue-100 text-slate-900" : "bg-slate-200 text-slate-500"}`}
                  >
                    <div className=" col-span-2 mx-auto pt-3">
                      <img src="" alt="" className="w-10 h-10 " />
                      <p>khaidinh</p>
                    </div>
                    <div className="col-span-3 leading-[15px]">
                      <p className="font-bold text-2xl">
                        {voucher ? voucher.toLocaleString() : 0} ₫
                      </p>
                      <p>
                        Số tiền tối thiểu {max ? max?.toLocaleString() : 0} ₫{" "}
                      </p>
                      <span>Th09 23 24 - Th03 22 25</span>
                    </div>
                  </div>
                </div>{" "}
                <div
                  className={`relative  border p-3 rounded-lg + ${tabKey == false ? "border-blue-600" : ""}`}
                  onClick={() => setTabKey(false)}
                >
                  {tabKey == false && (
                    <div className="absolute top-0 right-0">
                      <div className="w-6 h-10 overflow-hidden">
                        <div className="w-12 h-16 bg-blue-500 transform rotate-45 origin-bottom-left relative right-2 -top-[69px]">
                          <span className="absolute bottom-[1px] right-[17px] -rotate-45 text-white text-xs font-bold">
                            <i className="fa-solid fa-check"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <h3>Giảm giá theo phần trăm</h3>
                  <div
                    className={`grid grid-cols-5  px-3 py-5 text-slate-900 rounded-lg  ${tabKey == false ? "bg-blue-100 text-slate-900" : "bg-slate-200 text-slate-500"}`}
                  >
                    <div className=" col-span-2 mx-auto pt-3">
                      <img src="" alt="" className="w-10 h-10 " />
                      <p>khaidinh</p>
                    </div>
                    <div className="col-span-3 leading-[15px]">
                      <p className="font-bold text-2xl">
                        {phantram ? phantram : 0}% tắt
                      </p>
                      <p>
                        Số tiền tối thiểu {max ? max?.toLocaleString() : 0} ₫ ₫{" "}
                      </p>
                      <span>Th09 23 24 - Th03 22 25</span>
                    </div>
                  </div>
                </div>{" "}
              </div>
              <div className="">
                <label className="w-1/4 font-semibold">
                  Thiết lập khuyến mãi:
                </label>
                <div className="grid grid-cols-2 w-[70%] gap-5">
                  <Form.Item
                    label="Nếu giá trị đơn hàng đạt tới
"
                    name="tong_giam_gia_toi_da"
                    initialValue="479000"
                    rules={[
                      {
                        required: true,
                        message: " Bắt buộc phải điền!",
                      },
                    ]}
                    className="mb-0 w-[150%]"
                  >
                    <InputNumber
                      className="w-[60%] rounded-md"
                      min={0}
                      max={9999999999}
                      onChange={(value) => setMax(value as any)}
                      placeholder="Nhập giá trị đơn hàng đạt tớ"
                    />
                  </Form.Item>{" "}
                  {tabKey && (
                    <Form.Item
                      label="Giảm giá"
                      name="chi_tieu_toi_thieu"
                      initialValue="26010"
                      rules={[
                        { required: true, message: "Bắt buộc phải điền!" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const chi_tieu_toi_thieu =
                              getFieldValue("chi_tieu_toi_thieu");
                            if (
                              value >= 0.1 * chi_tieu_toi_thieu &&
                              value <= 0.5 * chi_tieu_toi_thieu
                            ) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(
                                "Giá trị phải nhỏ hơn 50% và không nhỏ hơn 10%"
                              )
                            );
                          },
                        }),
                      ]}
                      className="mb-0 w-[150%]"
                    >
                      <InputNumber
                        addonAfter="đ"
                        defaultValue={26010}
                        min={1}
                        onChange={(value) => setVoucher(value as any)}
                      />
                    </Form.Item>
                  )}{" "}
                  {tabKey == false && (
                    <Form.Item
                      label="Giảm giá"
                      name="giam_gia"
                      initialValue="30"
                      rules={[
                        { required: true, message: "Bắt buộc phải điền!" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const chi_tieu_toi_thieu =
                              getFieldValue("chi_tieu_toi_thieu");
                            if (value <= 0.5 * chi_tieu_toi_thieu) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Giá trị phải nhỏ hơn 50% ")
                            );
                          },
                        }),
                      ]}
                      className="mb-0 w-[150%]"
                    >
                      <InputNumber
                        addonAfter="%"
                        defaultValue={30}
                        min={0}
                        max={50}
                        onChange={(value) => setphantram(value as any)}
                      />
                    </Form.Item>
                  )}
                  <Form.Item
                    label="Số lượng mã giảm giá
"
                    name="so_luong"
                    initialValue=""
                    rules={[{ required: true, message: "Bắt buộc phải điền!" }]}
                    className="mb-0 w-[150%]"
                  >
                    <InputNumber
                      className="w-[60%] rounded-md"
                      placeholder="Nhập số lượng"
                      max={50}
                      min={1}
                    />
                  </Form.Item>{" "}
                  <Form.Item
                    label="Hạng thành viên  (áp dụng )
"
                    name="hang_thanh_vien"
                    initialValue={data[0]}
                    rules={[{ required: true, message: "Bắt buộc phải điền!" }]}
                    className="mb-0 w-[150%]"
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: "40%" }}
                      placeholder="Please select"
                      // defaultValue={data[0]}

                      onChange={handleChange2}
                      options={data}
                    />
                  </Form.Item>{" "}
                  <div className="flex gap-2 ">
                    <Form.Item className=" flex whitespace-nowrap">
                      <Button htmlType="submit">
                        <span className="text-sm">Hủy</span>
                      </Button>
                    </Form.Item>
                    <Form.Item className=" flex whitespace-nowrap">
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="w-[240px] bg-blue-500 text-white hover:bg-blue-600 py-2 rounded-md border-0 flex items-center gap-2"
                      >
                        <CheckOutlined className="text-white text-lg" />
                        <span className="text-sm">
                          Hoàn tất & Đăng khuyến mãi
                        </span>
                      </Button>
                    </Form.Item>{" "}
                  </div>
                </div>{" "}
              </div>
            </div>
            {/* <Tabs defaultActiveKey="1" items={tabItems} className="mb-6" /> */}
          </Form>
        </div>
      </div>
    </main>
  );
};

export default AddVoucher;
