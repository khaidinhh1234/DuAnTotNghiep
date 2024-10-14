import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Select, Upload, message, DatePicker, TreeSelect, Col, Row } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from 'moment';

import { IChuongTrinhUuDai } from "@/common/types/chuongtrinhuudai";
import { ISanPham } from "@/common/types/sanpham";
import { IDanhMuc } from "@/common/types/danhmuc";
import instance from "@/configs/admin";
import { uploadToCloudinary } from "@/configs/cloudinary";

const { RangePicker } = DatePicker;

const ChuongTrinhUuDaiEdit: React.FC = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [availableProducts, setAvailableProducts] = useState<ISanPham[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [categories, setCategories] = useState<IDanhMuc[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ISanPham[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const { data: chuongTrinhUuDaiData, isLoading: isLoadingChuongTrinhUuDai } = useQuery({
    queryKey: ["chuongTrinhUuDai", id],
    queryFn: async () => {
      const response = await instance.get(`/chuongtrinhuudai/${id}`);
      return response.data.data.chuongTrinhUuDai;
    },
  });

  const { data: availableProductsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["availableProducts"],
    queryFn: async () => {
      const response = await instance.get("/chuongtrinhuudai/san-pham-chua-co-uu-dai");
      return response.data;
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await instance.get("/danhmuc");
      return response.data;
    },
  });

  const { data: selectedProductDetails  } = useQuery({
    queryKey: ["productDetails", selectedProducts],
    queryFn: async () => {
      const promises = selectedProducts.map(id => 
        instance.get(`/sanpham/${id}`).then(response => response.data)
      );
      return Promise.all(promises);
    },
    enabled: selectedProducts.length > 0,
  });

  useEffect(() => {
    if (availableProductsData) {
      setAvailableProducts(availableProductsData.data);
      setFilteredProducts(availableProductsData.data);
    }
    if (categoriesData) {
      setCategories(categoriesData.data);
    }
  }, [availableProductsData, categoriesData]);

  useEffect(() => {
    if (chuongTrinhUuDaiData) {
      form.setFieldsValue({
        ten_uu_dai: chuongTrinhUuDaiData.ten_uu_dai,
        mo_ta: chuongTrinhUuDaiData.mo_ta,
        ngay_hien_thi: moment(chuongTrinhUuDaiData.ngay_hien_thi),
        date_range: [
          moment(chuongTrinhUuDaiData.ngay_bat_dau),
          moment(chuongTrinhUuDaiData.ngay_ket_thuc),
        ],
        gia_tri_uu_dai: chuongTrinhUuDaiData.gia_tri_uu_dai,
        loai: chuongTrinhUuDaiData.loai,
      });
      setSelectedProducts(chuongTrinhUuDaiData.sanPhams);
      if (chuongTrinhUuDaiData.duong_dan_anh) {
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: chuongTrinhUuDaiData.duong_dan_anh,
          },
        ]);
      }
    }
  }, [chuongTrinhUuDaiData, form]);

  const handleImageChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };
  const validateDates = (_: any, value: any) => {
    const ngayHienThi = form.getFieldValue('ngay_hien_thi');
    const dateRange = form.getFieldValue('date_range');

    if (ngayHienThi && dateRange) {
      const [ngayBatDau, ngayKetThuc] = dateRange;

      if (moment(ngayHienThi).isAfter(ngayBatDau)) {
        return Promise.reject('Ngày hiển thị phải trước ngày bắt đầu');
      }

      if (moment(ngayBatDau).isAfter(ngayKetThuc)) {
        return Promise.reject('Ngày bắt đầu phải trước ngày kết thúc');
      }
    }

    return Promise.resolve();
  };

  const validateDiscountValue = (_: any, value: number) => {
    const loai = form.getFieldValue('loai');
    if (loai === 'phan_tram' && (value < 0 || value > 100)) {
      return Promise.reject('Giá trị phần trăm phải từ 0 đến 100');
    }
    if (loai === 'tien' && value < 1000) {
      return Promise.reject('Giá trị tiền mặt phải lớn hơn hoặc bằng 1000');
    }
    return Promise.resolve();
  };

  const handleProductChange = (selectedValues: number[]) => {
    if (!isAllSelected) {
      setSelectedProducts(selectedValues);
      form.setFieldsValue({ san_pham: selectedValues });
    }
  };

  const handleSelectAll = () => {
    const allProductIds = filteredProducts.map(product => product.id);
    setIsAllSelected(true);
    setSelectedProducts(allProductIds);
    form.setFieldsValue({ san_pham: allProductIds });
  };

  const handleDeselectAll = () => {
    setIsAllSelected(false);
    setSelectedProducts([]);
    form.setFieldsValue({ san_pham: [] });
  };

  const getAllChildCategories = (category: IDanhMuc): string[] => {
    let childCategories: string[] = [category.id.toString()];
    if (category.children) {
      category.children.forEach(child => {
        childCategories = [...childCategories, ...getAllChildCategories(child)];
      });
    }
    return childCategories;
  };

  const handleCategoryChange = (selectedCategories: string[]) => {
    if (selectedCategories.length === 0) {
      setFilteredProducts(availableProducts);
    } else {
      const allSelectedCategories = selectedCategories.flatMap(catId => {
        const category = categories.find(cat => cat.id.toString() === catId);
        return category ? getAllChildCategories(category) : [catId];
      });

      const filtered = availableProducts.filter(product => 
        allSelectedCategories.includes(product.danh_muc_id.toString())
      );
      setFilteredProducts(filtered);
    }
    setSelectedProducts([]);
    setIsAllSelected(false);
    form.setFieldsValue({ san_pham: [] });
  };

  const renderTreeNodes = (data: IDanhMuc[]) => 
    data.map((item) => ({
      title: item.ten_danh_muc,
      value: item.id.toString(),
      children: item.children ? renderTreeNodes(item.children) : [],
    }));

  const { mutate } = useMutation({
    mutationFn: async (chuongTrinhUuDai: IChuongTrinhUuDai) => {
      const response = await instance.put(`/chuongtrinhuudai/${id}`, chuongTrinhUuDai);
      console.log(response.data);
      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật chương trình ưu đãi thành công");
      nav("/admin/chuongtrinhuudai");
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      message.error(error.message);
    },
  });
const onFinish = async (values: any) => {
  try {
    let imageUrl = chuongTrinhUuDaiData?.duong_dan_anh || '';
    if (fileList.length > 0 && fileList[0].originFileObj) {
      imageUrl = await uploadToCloudinary(fileList[0].originFileObj);
    }

    const [startDate, endDate] = values.date_range;

    const chuongTrinhUuDai: IChuongTrinhUuDai = {
      id: parseInt(id!),
      ten_uu_dai: values.ten_uu_dai,
      duong_dan_anh: imageUrl,
      ngay_hien_thi: values.ngay_hien_thi.format('YYYY-MM-DD'),
      mo_ta: values.mo_ta,
      ngay_bat_dau: startDate.format('YYYY-MM-DD'),
      ngay_ket_thuc: endDate.format('YYYY-MM-DD'),
      gia_tri_uu_dai: values.gia_tri_uu_dai,
      loai: values.loai,
      san_pham: selectedProducts,
    };

    console.log("Prepared data:", chuongTrinhUuDai);

    mutate(chuongTrinhUuDai);
  } catch (error) {
    console.error("Error in onFinish:", error);
    message.error("Lỗi khi cập nhật chương trình ưu đãi");
  }
};

  if (isLoadingChuongTrinhUuDai) {
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
          label="Ảnh ưu đãi"
          name="imageFile"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleImageChange}
            beforeUpload={() => false}
            maxCount={1}
          >
            {fileList.length < 1 && <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>}
          </Upload>
        </Form.Item>

              <Form.Item
                label="Ngày hiển thị"
                name="ngay_hien_thi"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày hiển thị!" },
                  { validator: validateDates }
                ]}
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
                rules={[
                  { required: true, message: "Vui lòng chọn thời gian ưu đãi!" },
                  { validator: validateDates }
                ]}
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
                    rules={[
                      { required: true, message: "Vui lòng nhập giá trị ưu đãi!" },
                      { validator: validateDiscountValue }
                    ]}
                    style={{ marginBottom: 0 }}
                  >
                    <Input type="number" placeholder="Nhập giá trị ưu đãi" style={{ width: 615 }} />
                  </Form.Item>
                </Input.Group>
              </Form.Item>

              <Row gutter={16}>
                <Col span={10}>
                  <Form.Item label="Lọc theo danh mục">
                    <TreeSelect
                      treeData={renderTreeNodes(categories)}
                      onChange={handleCategoryChange}
                      treeCheckable
                      showCheckedStrategy={TreeSelect.SHOW_PARENT}
                      placeholder="Chọn danh mục"
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
                    <div>
                      <Select
                        mode="multiple"
                        placeholder="Chọn sản phẩm áp dụng"
                        value={selectedProducts}
                        onChange={handleProductChange}
                        showSearch
                        loading={isLoadingProducts }
                        filterOption={(input, option) =>
                          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={filteredProducts.map((product) => ({
                          label: product.ten_san_pham,
                          value: product.id,
                        }))}
                        style={{ width: '100%', marginBottom: '10px' }}
                        disabled={isAllSelected}
                      />
                      
                      <Button 
                        onClick={isAllSelected ? handleDeselectAll : handleSelectAll}
                        style={{ marginRight: '10px' }}
                      >
                        {isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                      </Button>
                    </div>
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
