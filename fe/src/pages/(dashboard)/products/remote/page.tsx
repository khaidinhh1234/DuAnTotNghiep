// import React, { useRef, useState } from "react";
// import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
// import type { InputRef, TableColumnsType, TableColumnType } from "antd";
// import { Button, Input, Popconfirm, Space, Table } from "antd";
// import type { FilterDropdownProps } from "antd/es/table/interface";
// import Highlighter from "react-highlight-words";
// import { Link } from "react-router-dom";

// interface DataType {
//   key: React.Key;
//   anh_san_pham: string;
//   ten_san_pham: string;
//   id_danh_muc: string;
//   luot_xem: number;
//   mo_ta_ngan: string;
//   noi_dung: string;
// }

// type DataIndex = keyof DataType;

// const ProductsRemote: React.FC = () => {
//   // const [searchText, setSearchText] = useState
//   const [searchedColumn, setSearchedColumn] = useState("");
//   const searchInput = useRef<InputRef>(null);

//   const handleSearch = (
//     selectedKeys: string[],
//     confirm: FilterDropdownProps["confirm"],
//     dataIndex: DataIndex
//   ) => {
//     confirm();
//     setSearchText(selectedKeys[0]);
//     setSearchedColumn(dataIndex);
//   };

//   const handleReset = (clearFilters: () => void) => {
//     clearFilters();
//     setSearchText("");
//   };

//   const getColumnSearchProps = (
//     dataIndex: DataIndex
//   ): TableColumnType<DataType> => ({
//     filterDropdown: ({
//       setSelectedKeys,
//       selectedKeys,
//       confirm,
//       clearFilters,
//       close,
//     }) => (
//       <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
//         <Input
//           ref={searchInput}
//           placeholder={`Search ${dataIndex}`}
//           value={selectedKeys[0]}
//           onChange={(e) =>
//             setSelectedKeys(e.target.value ? [e.target.value] : [])
//           }
//           onPressEnter={() =>
//             handleSearch(selectedKeys as string[], confirm, dataIndex)
//           }
//           style={{ marginBottom: 8, display: "block" }}
//         />
//         <Space>
//           <Button
//             type="primary"
//             onClick={() =>
//               handleSearch(selectedKeys as string[], confirm, dataIndex)
//             }
//             icon={<SearchOutlined />}
//             size="small"
//             style={{ width: 90 }}
//           >
//             Search
//           </Button>
//           <Button
//             onClick={() => clearFilters && handleReset(clearFilters)}
//             size="small"
//             style={{ width: 90 }}
//           >
//             Reset
//           </Button>
//         </Space>
//       </div>
//     ),
//     filterIcon: (filtered: boolean) => (
//       <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
//     ),
//     onFilter: (value, record) =>
//       record[dataIndex]
//         .toString()
//         .toLowerCase()
//         .includes((value as string).toLowerCase()),
//     onFilterDropdownOpenChange: (visible) => {
//       if (visible) {
//         setTimeout(() => searchInput.current?.select(), 100);
//       }
//     },
//     render: (text) =>
//       searchedColumn === dataIndex ? (
//         <Highlighter
//           highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
//           searchWords={[searchText]}
//           autoEscape
//           textToHighlight={text ? text.toString() : ""}
//         />
//       ) : (
//         text
//       ),
//   });

//   const columns: TableColumnsType<DataType> = [
//     {
//       title: "Ảnh sản phẩm",
//       render: (record) => (
//         <img
//           src={record.anh_san_pham}
//           alt=""
//           className="w-20 h-20 object-cover rounded-lg p-2 border "
//         />
//       ),
//       className: "pl-10",
//       width: "15%",
//       key: "anh_san_pham",
//     },
//     {
//       title: "Tên sản phẩm",
//       dataIndex: "ten_san_pham",
//       key: "ten_san_pham",
//       width: "15%",
//       ...getColumnSearchProps("ten_san_pham"),
//       sorter: (a: any, b: any) => a.ten_san_pham.length - b.ten_san_pham.length,
//     },
//     {
//       title: "Danh mục",
//       dataIndex: "id_danh_muc",
//       key: "id_danh_muc",
//       width: "15%",
//       ...getColumnSearchProps("id_danh_muc"),
//       sorter: (e: any, c: any) => e.id_danh_muc.length - c.id_danh_muc.length,
//     },
//     {
//       title: "Mô tả Ngắn",
//       dataIndex: "mo_ta_ngan",
//       width: "10%",
//       key: "mo_ta_ngan",
//     },
//     {
//       title: "Nội dung",
//       dataIndex: "noi_dung",
//       className: "w-96",

//       key: "noi_dung",
//     },
//     {
//       title: "Lượt xem",
//       dataIndex: "luot_xem",
//       width: "7%",

//       sorter: (a: any, b: any) => a.luot_xem - b.luot_xem,
//       sortDirections: ["descend", "ascend"],
//       key: "luot_xem",
//     },
//     {
//       title: "Quản trị",
//       key: "action",
//       render: (_, record) => (
//         <Space>
//           <Popconfirm
//             title="Chuyển vào thùng rác "
//             description="Bạn có chắc chắn muốn xóa không?"
//             okText="Có "
//             cancelText="Không"
//           >
//             <Button className="bg-white text-red-500 border border-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 shadow-md transition-colors">
//             Xóa
//             </Button>
//           </Popconfirm>
//           <Button className="bg-white text-red-500 border border-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 shadow-md transition-colors">
//           Khôi phục
//           </Button>
//         </Space>
//       ),
//     },
//   ];
//   const [searchText, setSearchText] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchText(e.target.value);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       console.log(searchText);
//       // Thực hiện hành động tìm kiếm tại đây
//     }
//   };
//   const products = [...data].reverse();

//   return (
//     <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//       <div className="flex items-center">
//         <h1 className=" md:text-base">
//           Quản trị / Sản phẩm /{" "}
//           <span className="font-semibold px-px=">Thùng rác </span>{" "}
//         </h1>
//       </div>
//       <div className="flex items-center justify-between">
//         <h1 className=" font-semibold md:text-3xl"> Thùng rác</h1>
//         <div>
//           {" "}
//           <Link to="/admin/products">
//             <Button className="ml-auto bg-black text-white rounded-lg  py-1">
//               Quay lại
//             </Button>
//           </Link>
//         </div>
//       </div>
//       <div className=" ">
//         <div className="max-w-xs my-2">
//           <Input
//             placeholder="Tìm kiếm..."
//             size="large"
//             value={searchText}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//           />
//         </div>
//         <Table columns={columns} dataSource={data} />;
//       </div>
//     </main>
//   );
// };

// export default ProductsRemote;
import React, { useState } from 'react';
import { Upload, message, Select, Table, Input, DatePicker } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Option } = Select;

const ProductVariants = () => {
  const [variants, setVariants] = useState([]);

  const addVariant = (type) => {
    if (!variants.find(v => v.type === type)) {
      setVariants([...variants, { type, values: [] }]);
    }
  };

  const updateVariantValues = (index, values) => {
    const newVariants = [...variants];
    newVariants[index].values = values;
    setVariants(newVariants);
  };

  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const columns = [
    {
      title: 'Kích thước',
      dataIndex: 'size',
      key: 'size',
      render: () => <Input className="w-full" />,
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      render: () => <Input className="w-full" />,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: () => <Input type="number" className="w-full" />,
    },
    {
      title: 'Giá khuyến mãi',
      dataIndex: 'salePrice',
      key: 'salePrice',
      render: () => <Input type="number" className="w-full" />,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: () => <Input type="number" className="w-full" />,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: () => <DatePicker className="w-full" />,
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: () => <DatePicker className="w-full" />,
    },
  ];

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Giá bán, Kho hàng và Biến thể</h2>
        <p className="text-sm text-gray-600 mb-4">
          Tạo biến thể nếu sản phẩm có hơn một tùy chọn, ví dụ như về kích thước hay màu sắc.
        </p>

        <Dragger {...props} className="mb-4">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
            band files
          </p>
        </Dragger>

        <div className="mb-6">
          <Select
            style={{ width: 120 }}
            onSelect={addVariant}
            placeholder="Chọn biến thể"
          >
            <Option value="color">Màu sắc</Option>
            <Option value="size">Kích thước</Option>
          </Select>
        </div>

        {variants.map((variant, index) => (
          <div key={index} className="mb-6 bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium mb-2 flex justify-between items-center">
              Biến thể {variant.type === 'color' ? 'Màu sắc' : 'Kích thước'}
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => removeVariant(index)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {variant.type === 'color' ? 'Chọn màu sắc' : 'Chọn kích thước'}
              </label>
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder={`Nhập ${variant.type === 'color' ? 'màu sắc' : 'kích thước'}`}
                onChange={(values) => updateVariantValues(index, values)}
              >
                {variant.values.map((value, i) => (
                  <Option key={i} value={value}>{value}</Option>
                ))}
              </Select>
            </div>
          </div>
        ))}

        <div>
          <h3 className="text-lg font-medium mb-4">Giá bán & Kho hàng</h3>
          <Table columns={columns} dataSource={[{}]} pagination={false} />
        </div>
      </div>
    </div>
  );
};

export default ProductVariants;
