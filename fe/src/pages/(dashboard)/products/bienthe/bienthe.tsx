
// import React, { useRef, useState } from "react";
// import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
// import { Button, Input, Popconfirm, Space, Table, Switch, Form, Modal, InputRef } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import Highlighter from "react-highlight-words";
// import { Link } from "react-router-dom";

// // Define types for your data
// interface DataType {
//   key: string;
//   ten_san_pham: string;
//   ten_danh_muc: string;
// }

// interface SizeDataType {
//   key: string;
//   ten_size: string;
//   trang_thai: number;
// }

// type DataIndex = keyof DataType;
// type SizeDataIndex = keyof SizeDataType;

// const Bienthe: React.FC = () => {
//   const [searchedColumn, setSearchedColumn] = useState<string>("");
//   const [searchText, setSearchText] = useState<string>("");
//   const searchInput = useRef<InputRef>(null);
//   const [form] = Form.useForm();

//   const [tenMau, setTenMau] = useState<string>("");
//   const [maMau, setMaMau] = useState<string>("");
//   const [tenSize, setTenSize] = useState<string>("");

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

//   const getColumnSearchProps = (dataIndex: DataIndex) => ({
//     filterDropdown: ({
//       setSelectedKeys,
//       selectedKeys,
//       confirm,
//       clearFilters,
//     }: any) => (
//       <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
//         <Input
//           ref={searchInput}
//           placeholder={`Tìm ${dataIndex}`}
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
//             Tìm kiếm
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
//     onFilter: (value: any, record: any) =>
//       record[dataIndex]
//         ?.toString()
//         .toLowerCase()
//         .includes((value as string).toLowerCase()),
//     onFilterDropdownOpenChange: (visible: any) => {
//       if (visible) {
//         setTimeout(() => searchInput.current?.select(), 100);
//       }
//     },
//     render: (text: any) =>
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



//   const columnsLeft: ColumnsType<DataType> = [
//     {
//       title: "STT",
//       key: "stt",
//       render: (text, item, index) => index + 1,
//       width: "10%",
//     },
//     {
//       title: "Tên màu",
//       dataIndex: "ten_san_pham",
//       key: "ten_san_pham",
//       width: "30%",
//       ...getColumnSearchProps("ten_san_pham"),
//       sorter: (a: DataType, b: DataType) => a.ten_san_pham.localeCompare(b.ten_san_pham),
//     },
//     {
//       title: "Mã màu",
//       dataIndex: "ten_danh_muc",
//       key: "ten_danh_muc",
//       width: "30%",
//       ...getColumnSearchProps("ten_danh_muc"),
//       sorter: (a: DataType, b: DataType) => a.ten_danh_muc.localeCompare(b.ten_danh_muc),
//     },
//     {
//       title: "Quản trị",
//       key: "action",
//       render: (item: DataType) => (
//         <Space>
//           <Popconfirm title="Xóa sản phẩm" okText="Có" cancelText="Không">
//             <Button className="bg-white text-red-500 border border-red-500 rounded-lg">Xóa</Button>
//           </Popconfirm>
//           <Button onClick={showModal} className="bg-white text-orange-500 border border-orange-500 rounded-lg">Cập nhật</Button>
//         </Space>
//       ),
//     },
//   ];

//   const columnsRight: ColumnsType<SizeDataType> = [
//     {
//       title: "STT",
//       key: "stt",
//       render: (text, item, index) => index + 1,
//       width: "10%",
//     },
//     {
//       title: "Tên Size",
//       dataIndex: "ten_size",
//       key: "ten_size",
//       width: "50%",
//       ...getColumnSearchProps("ten_size"),
//     },
//     {
//       title: "Trạng Thái",
//       dataIndex: "trang_thai",
//       key: "trang_thai",
//       render: (trang_thai: number) => (
//         <Switch checked={trang_thai === 1} />
//       ),
//     },
//   ];

//   const handleAddColor = (): void => {
//     console.log("Adding color:", { tenMau, maMau });
//     // Add logic to add color
//     setTenMau("");
//     setMaMau("");
//   };

//   const handleAddSize = (): void => {
//     console.log("Adding size:", tenSize);
//     // Add logic to add size
//     setTenSize("");
//   };

//   return (
//     <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//       <div className="flex items-center">
//         <h1>Quản trị / Sản phẩm</h1>
//       </div>
//       <div className="flex items-center justify-between">
//         <h1 className="font-semibold md:text-3xl">Sản phẩm</h1>
//         <div className="flex gap-2">
//           <Link to="/admin/products/remote">
//             <Button className="bg-red-500 text-white rounded-lg">Thùng rác</Button>
//           </Link>
//         </div>
//       </div>
//       <div className="max-w-xs my-2">
//         <Input placeholder="Tìm kiếm..." size="large" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
//       </div>
//       <div className="flex space-x-4">
//         <div className="w-1/2">
//           <Table columns={columnsLeft} dataSource={[]} pagination={{ pageSize: 5 }} className="equal-width-table" />
//           <div className="mt-4 flex space-x-2">
//             <Form.Item className="flex-2 mb-0">
//               <Input 
//                 placeholder="Tên màu" 
//                 value={tenMau}
//                 onChange={(e) => setTenMau(e.target.value)}
//               />
//             </Form.Item>
//             <Form.Item className="flex-2 mb-0">
//               <Input 
//                 placeholder="Mã màu" 
//                 value={maMau}
//                 onChange={(e) => setMaMau(e.target.value)}
//               />
//             </Form.Item>
//             <Button type="primary" className="flex-1" onClick={handleAddColor}>Thêm màu</Button>
//           </div>
//         </div>
//         <div className="w-1/2">
//           <Table columns={columnsRight} dataSource={[]} pagination={{ pageSize: 5 }} className="equal-width-table" />
//           <div className="mt-4 flex space-x-2">
//             <Form.Item className="flex-grow mb-0">
//               <Input 
//                 placeholder="Tên size" 
//                 value={tenSize}
//                 onChange={(e) => setTenSize(e.target.value)}
//               />
//             </Form.Item>
//             <Button type="primary" onClick={handleAddSize}>Thêm size</Button>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Bienthe;
import React, { useState } from "react";
import { Button, Input } from "antd";
import { Link } from "react-router-dom";
import SizeManagement from "./SizeTable ";
import ColorTable from "./ColorTable ";
import { DeleteOutlined } from "@ant-design/icons";

const Bienthe: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1>Quản trị / Sản phẩm</h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Sản phẩm</h1>
        <div className="flex gap-2">
          <Link to="/admin/products/bienthe/remote">
            <Button className="bg-red-500 text-white rounded-lg"><DeleteOutlined />màu</Button>
          </Link>
          <Link to="/admin/products/bienthe/remotesize">
            <Button className="bg-red-500 text-white rounded-lg"><DeleteOutlined />kích thước</Button>
          </Link>
        </div>
      </div>
      <div className="max-w-xs my-2">
        <Input 
          placeholder="Tìm kiếm..." 
          size="large" 
          value={searchText} 
          onChange={(e) => setSearchText(e.target.value)} 
        />
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <ColorTable />
        </div>
        <div className="w-1/2">
          <SizeManagement />
        </div>
      </div>
    </main>
  );
};

export default Bienthe;
