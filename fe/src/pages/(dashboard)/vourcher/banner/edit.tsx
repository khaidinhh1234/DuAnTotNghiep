import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Select, Upload, message, DatePicker, TreeSelect, Col, Row } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from 'moment';

import instance from "@/configs/admin";
import { uploadToCloudinary } from "@/configs/cloudinary";

// Types
interface IChuongTrinhUuDai {
  id?: number;
  ten_uu_dai: string;
  duong_dan_anh: string;
  ngay_hien_thi: string;
  mo_ta: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  gia_tri_uu_dai: number;
  loai: 'phan_tram' | 'tien';
  san_phams: number[];
}

interface ISanPham {
  id: number;
  ten_san_pham: string;
  danh_muc_id: number;
}

interface IDanhMuc {
  id: number;
  ten_danh_muc: string;
  children?: IDanhMuc[];
}

const { RangePicker } = DatePicker;

const ChuongTrinhUuDaiEdit: React.FC = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [allProducts, setAllProducts] = useState<ISanPham[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ISanPham[]>([]);

  const { data: chuongTrinhUuDaiData, isLoading: isLoadingChuongTrinh } = useQuery<{ data: IChuongTrinhUuDai }>({
    queryKey: ["chuongTrinhUuDai", id],
    queryFn: async () => {
      const response = await instance.get(`/chuongtrinhuudai/${id}`);
      return response.data;
    },
  });

  const { data: allProductsData, isLoading: isLoadingProducts } = useQuery<{ data: ISanPham[] }>({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const response = await instance.get("/sanpham");
      return response.data;
    },
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery<{ data: IDanhMuc[] }>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await instance.get("/danhmuc");
      return response.data;
    },
  });

  useEffect(() => {
    if (chuongTrinhUuDaiData?.data && !isLoadingChuongTrinh) {
      const data = chuongTrinhUuDaiData.data;
      form.setFieldsValue({
        ten_uu_dai: data.ten_uu_dai,
        ngay_hien_thi: moment(data.ngay_hien_thi),
        mo_ta: data.mo_ta,
        date_range: [moment(data.ngay_bat_dau), moment(data.ngay_ket_thuc)],
        gia_tri_uu_dai: data.gia_tri_uu_dai,
        loai: data.loai,
        san_pham: data.san_phams,
      });
      setSelectedProducts(data.san_phams);
    }
  }, [chuongTrinhUuDaiData, isLoadingChuongTrinh, form]);

  useEffect(() => {
    if (allProductsData?.data) {
      setAllProducts(allProductsData.data);
      setFilteredProducts(allProductsData.data);
    }
  }, [allProductsData]);

  const { mutate } = useMutation<IChuongTrinhUuDai, Error, IChuongTrinhUuDai>({
    mutationFn: async (chuongTrinhUuDai: IChuongTrinhUuDai) => {
      const response = await instance.put(`/chuongtrinhuudai/${id}`, chuongTrinhUuDai);
      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật chương trình ưu đãi thành công");
      nav("/admin/chuongtrinhuudai");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const onFinish = async (values: any) => {
    try {
      let imageUrl = chuongTrinhUuDaiData?.data.duong_dan_anh || '';
      if (values.imageFile && values.imageFile[0]) {
        imageUrl = await uploadToCloudinary(values.imageFile[0].originFileObj);
      }

      const [startDate, endDate] = values.date_range;

      const chuongTrinhUuDaiData: IChuongTrinhUuDai = {
        id: Number(id),
        ten_uu_dai: values.ten_uu_dai,
        duong_dan_anh: imageUrl,
        ngay_hien_thi: values.ngay_hien_thi.format('YYYY-MM-DD'),
        mo_ta: values.mo_ta,
        ngay_bat_dau: startDate.format('YYYY-MM-DD'),
        ngay_ket_thuc: endDate.format('YYYY-MM-DD'),
        gia_tri_uu_dai: values.gia_tri_uu_dai,
        loai: values.loai,
        san_phams: selectedProducts,
      };

      mutate(chuongTrinhUuDaiData);
    } catch (error) {
      message.error("Lỗi khi cập nhật chương trình ưu đãi");
    }
  };

  const handleProductChange = (selectedValues: number[]) => {
    setSelectedProducts(selectedValues);
  };

  const handleSelectAll = (selected: boolean) => {
    if (filteredProducts) {
      if (selected) {
        setSelectedProducts(filteredProducts.map(product => product.id));
      } else {
        setSelectedProducts([]);
      }
    }
  };

  const handleCategoryChange = (selectedCategories: string[]) => {
    if (selectedCategories.length === 0) {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product => 
        selectedCategories.includes(product.danh_muc_id.toString())
      );
      setFilteredProducts(filtered);
    }
    setSelectedProducts([]);
  };

  const renderTreeNodes = (data: IDanhMuc[]): any[] => 
    data.map((item) => ({
      title: item.ten_danh_muc,
      value: item.id.toString(),
      children: item.children ? renderTreeNodes(item.children) : [],
    }));

  if (isLoadingChuongTrinh || isLoadingProducts || isLoadingCategories) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Chương trình ưu đãi /
          <span className="font-semibold px-px"> Chỉnh sửa chương trình ưu đãi</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Chỉnh sửa chương trình ưu đãi</h1>
        <div>
          <Link to="/admin/chuongtrinhuudai" className="mr-1">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <div style={{ padding: 24, minHeight: 360 }}>
          <div className="bg-white px-4 rounded-xl py-5 shadow-lg max-w-7xl">
            <Form
              form={form}
              name="basic"
              layout="vertical"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 24 }}
              autoComplete="off"
              onFinish={onFinish}
            >
              <Form.Item
                label="Tên ưu đãi"
                name="ten_uu_dai"
                rules={[{ required: true, message: "Vui lòng nhập tên ưu đãi!" }]}
              >
                <Input placeholder="Nhập tên ưu đãi" />
              </Form.Item>

              <Form.Item
                label="Thêm ảnh"
                name="imageFile"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                label="Ngày hiển thị"
                name="ngay_hien_thi"
                rules={[{ required: true, message: "Vui lòng chọn ngày hiển thị!" }]}
              >
                <DatePicker />
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="mo_ta"
                rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
              >
                <Input.TextArea rows={4} placeholder="Nhập mô tả" />
              </Form.Item>

              <Form.Item
                label="Thời gian ưu đãi"
                name="date_range"
                rules={[{ required: true, message: "Vui lòng chọn thời gian ưu đãi!" }]}
              >
                <RangePicker />
              </Form.Item>

              <Form.Item label="Loại và giá trị ưu đãi">
                <Input.Group compact>
                  <Form.Item
                    name="loai"
                    rules={[{ required: true, message: "Vui lòng chọn loại ưu đãi!" }]}
                    style={{ marginBottom: 0, marginRight: 8 }}
                  >
                    <Select placeholder="Chọn loại ưu đãi" style={{ width: 610 }}>
                      <Select.Option value="phan_tram">Phần trăm</Select.Option>
                      <Select.Option value="tien">Tiền</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="gia_tri_uu_dai"
                    rules={[{ required: true, message: "Vui lòng nhập giá trị ưu đãi!" }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input type="number" placeholder="Nhập giá trị ưu đãi" style={{ width: 620 }} />
                  </Form.Item>
                </Input.Group>
              </Form.Item>

              <Row gutter={16}>
                <Col span={10}>
                  <Form.Item label="Danh mục sản phẩm">
                    <TreeSelect
                      treeData={renderTreeNodes(categoriesData?.data || [])}
                      onChange={handleCategoryChange}
                      treeCheckable
                      showCheckedStrategy={TreeSelect.SHOW_PARENT}
                      placeholder="Chọn danh mục sản phẩm"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={14}>
                  <Form.Item
                    label="Sản phẩm áp dụng"
                    name="san_pham"
                    rules={[{ required: true, message: "Vui lòng chọn sản phẩm áp dụng!" }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder="Chọn sản phẩm áp dụng"
                      value={selectedProducts}
                      onChange={handleProductChange}
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      options={[
                        ...(filteredProducts && selectedProducts
                          ? [{ 
                              label: selectedProducts.length === filteredProducts.length 
                                ? 'Bỏ chọn tất cả' 
                                : 'Chọn tất cả', 
                              value: -1 
                            }]
                          : []),
                        ...(filteredProducts
                          ? filteredProducts.map((product) => ({
                              label: product.ten_san_pham,
                              value: product.id,
                            }))
                          : []),
                      ]}
                      onSelect={(value) => {
                        if (value === -1) {
                          handleSelectAll(selectedProducts.length !== filteredProducts.length);
                        }
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
                >
                  Cập nhật chương trình ưu đãi
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChuongTrinhUuDaiEdit;
