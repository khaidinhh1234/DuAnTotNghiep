// import React, { useEffect, useRef, useState } from "react";
// import { SearchOutlined } from "@ant-design/icons";
// import {
//   Button,
//   Input,
//   Space,
//   Table,
//   Form,
//   InputRef,
//   Popconfirm,
//   message,
//   Spin,
//   Select,
// } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import Highlighter from "react-highlight-words";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// import { Link } from "react-router-dom";
// import instance from "@/configs/admin";

// interface SizeDataType {
//   key: string;
//   id: number;
//   kich_thuoc: string;
//   loai_kich_thuoc: string;
//   uniqueSizeTypes: string[];
// }

// type SizeDataIndex = keyof SizeDataType;

// const SizeManagement: React.FC = () => {
//   const [searchedColumn, setSearchedColumn] = useState<string>("");
//   const [searchText, setSearchText] = useState<string>("");
//   const searchInput = useRef<InputRef>(null);
//   const [form] = Form.useForm();
//   const [sizeTypes, setSizeTypes] = useState<string[]>([]);

//   const queryClient = useQueryClient();

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["size"],
//     queryFn: async () => {
//       const res = await instance.get("/bienthekichthuoc");
//       return res.data;
//     },
//   });
//   useEffect(() => {
//     if (data && data.data) {
//       const uniqueSizeTypes: string[] = Array.from(new Set(data.data.map((item: any) => item.loai_kich_thuoc)));
//       setSizeTypes(uniqueSizeTypes);
//     }
//   }, [data]);
//   const sizes = data?.data.map((item: any, index: number) => ({
//     ...item,
//     key: item.id,
//     index,
//   }));

//   const deleteMutation = useMutation({
//     mutationFn: async (id: string | number) => {
//       const response = await instance.delete(`/bienthekichthuoc/${id}`);
//       if (response.data.status) {
//         return id;
//       } else {
//         throw new Error(response.data.message || "Failed to delete");
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["size"] });
//       message.success("Xóa kích thước thành công");
//     },
//     onError: (error) => {
//       console.error("Error deleting kích thước:", error);
//       message.error("Xóa kích thước thất bại");
//     },
//   });

//   const addSizeMutation = useMutation({
//     mutationFn: async (newSize: { kich_thuoc: string; loai_kich_thuoc: string }) => {
//       // Check if the size already exists
//       const existingSize = sizes.find(
//         (size: any) =>
//           size.kich_thuoc.toLowerCase() === newSize.kich_thuoc.toLowerCase() &&
//           size.loai_kich_thuoc === newSize.loai_kich_thuoc
//       );
//       if (existingSize) {
//         throw new Error("Kích thước đã tồn tại");
//       }

//       const response = await instance.post("/bienthekichthuoc", newSize);
//       if (response.data.status) {
//         return response.data;
//       } else {
//         throw new Error(response.data.message || "Failed to add size");
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["size"] });
//       message.success("Thêm kích thước thành công");
//       form.resetFields();
//     },
//     onError: (error: Error) => {
//       console.error("Error adding size:", error);
//       message.error(error.message || "Thêm kích thước thất bại");
//     },
//   });

//   const handleAddSize = (): void => {
//     form.validateFields().then((values) => {
//       addSizeMutation.mutate({
//         kich_thuoc: values.tensize,
//         loai_kich_thuoc: values.loai_kich_thuoc,
//       });
//     });
//   };

//   const handleSearch = (
//     selectedKeys: string[],
//     confirm: () => void,
//     dataIndex: SizeDataIndex
//   ) => {
//     confirm();
//     setSearchText(selectedKeys[0]);
//     setSearchedColumn(dataIndex);
//   };

//   const handleReset = (clearFilters: () => void) => {
//     clearFilters();
//     setSearchText("");
//   };

//   const getColumnSearchProps = (dataIndex: SizeDataIndex) => ({
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
//     onFilter: (value: string, record: SizeDataType) =>
//       record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
//     onFilterDropdownOpenChange: (visible: boolean) => {
//       if (visible) {
//         setTimeout(() => searchInput.current?.select(), 100);
//       }
//     },
//     render: (text: string) =>
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

//   const columns: ColumnsType<SizeDataType> = [
//     {
//       title: "STT",
//       key: "stt",
//       render: (_, __, index) => index + 1,
//       width: "10%",
//     },
//     {
//       title: "Tên Size",
//       dataIndex: "kich_thuoc",
//       key: "kich_thuoc",
//       width: "50%",
//       sorter: (a, b) => a.kich_thuoc.localeCompare(b.kich_thuoc),
//       ...getColumnSearchProps("kich_thuoc"),
//       onFilter: (value: boolean | React.Key, record: SizeDataType) =>
//         record.kich_thuoc
//           .toString()
//           .toLowerCase()
//           .includes(value.toString().toLowerCase()),
//     },
//     {
//       title: "Loại kích thước",
//       dataIndex: "loai_kich_thuoc",
//       key: "loai_kich_thuoc",
//       width: "50%",
//       sorter: (a, b) => a.kich_thuoc.localeCompare(b.kich_thuoc),
//       ...getColumnSearchProps("loai_kich_thuoc"),
//       onFilter: (value: boolean | React.Key, record: SizeDataType) =>
//         record.kich_thuoc
//           .toString()
//           .toLowerCase()
//           .includes(value.toString().toLowerCase()),
//     },
//     {
//       title: "Quản trị",
//       key: "action",
//       render: (_, item) => (
//         <Space>
//           <Popconfirm
//             title="chuyển vào thùng rác?"
//             description="Bạn có chắc chắn muốn xóa không?"
//             okText="Có"
//             cancelText="Không"
//             onConfirm={() => deleteMutation.mutate(item.id)}
//           >
//             {/* <Button className="bg-white text-red-500 border border-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 shadow-md transition-colors"> */}
//             <Button className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300">
//               Xóa
//             </Button>
//           </Popconfirm>
//           <Link to={`/admin/products/bienthesize/edit/${item.id}`}>
//             {/* <Button className="bg-white text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-50 hover:text-orange-600 shadow-md transition-colors"> */}
//             <Button className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold">
//               Cập nhật
//             </Button>
//           </Link>
//         </Space>
//       ),
//     },
//   ];

//   if (isError)
//     return (
//       <div>
//         <div className="flex items-center justify-center  mt-[250px]">
//           <div className=" ">
//             <Spin size="large" />
//           </div>
//         </div>
//       </div>
//     );

//   return (
//     <>
//       {" "}
//       <Form form={form} className="mt-4 flex space-x-2">
//         <Form.Item
//           className="flex-grow mb-0"
//           name="tensize"
//           rules={[
//             { required: true, message: "Vui lòng nhập tên kích thước" },
//             { max: 50, message: "Tên kích thước không được quá 50 ký tự" },
//             {
//               pattern: /^[^\s]+(\s+[^\s]+)*$/,
//               message: "Vui lòng nhập họ không chứa ký tự trắng!",
//             },
//           ]}
//         >
//           <Input placeholder="Tên kích thước" />
//         </Form.Item>
//         <Form.Item
//           className="flex-grow mb-0"
//           name="loai_kich_thuoc"
//           rules={[{ required: true, message: "Vui lòng chọn loại kích thước" }]}
//         >
//           <Select placeholder="Chọn loại kích thước" loading={isLoading}>
//             {sizeTypes.map((type) => (
//               <Select.Option key={type} value={type}>
//                 {type}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>
//         <Button
//           type="primary"
//           className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
//           onClick={handleAddSize}
//         >
//           Thêm size
//         </Button>
//       </Form>
//       <br />
//       <Table
//         columns={columns}
//         dataSource={sizes}
//         pagination={{ pageSize: 5, className: "my-5" }}
//         className="equal-width-table"
//         loading={isLoading}
//       />
//     </>
//   );
// };

// export default SizeManagement;
// import React, { useRef, useState } from "react";
// import { SearchOutlined } from "@ant-design/icons";
// import {
//   Button,
//   Input,
//   Space,
//   Table,
//   Form,
//   InputRef,
//   Popconfirm,
//   message,
//   Spin,
//   Select,
// } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import Highlighter from "react-highlight-words";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { Link } from "react-router-dom";
// import instance from "@/configs/admin";

// interface SizeDataType {
//   key: string;
//   id: number;
//   kich_thuoc: string;
//   loai_kich_thuoc: string;
// }

// type SizeDataIndex = keyof SizeDataType;

// const SizeManagement: React.FC = () => {
//   const [searchedColumn, setSearchedColumn] = useState<string>("");
//   const [searchText, setSearchText] = useState<string>("");
//   const searchInput = useRef<InputRef>(null);
//   const [form] = Form.useForm();

//   const queryClient = useQueryClient();

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["size"],
//     queryFn: async () => {
//       const res = await instance.get("/bienthekichthuoc");
//       return res.data;
//     },
//   });

//   const sizes = data?.data.map((item: any, index: number) => ({
//     ...item,
//     key: item.id,
//     index,
//   }));

//   const deleteMutation = useMutation({
//     mutationFn: async (id: string | number) => {
//       const response = await instance.delete(`/bienthekichthuoc/${id}`);
//       if (response.data.status) {
//         return id;
//       } else {
//         throw new Error(response.data.message || "Failed to delete");
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["size"] });
//       message.success("Xóa kích thước thành công");
//     },
//     onError: (error) => {
//       console.error("Error deleting kích thước:", error);
//       message.error("Xóa kích thước thất bại");
//     },
//   });

//   const addSizeMutation = useMutation({
//     mutationFn: async (newSize: { kich_thuoc: string; loai_kich_thuoc: string }) => {
//       const existingSize = sizes.find(
//         (size: any) =>
//           size.kich_thuoc.toLowerCase() === newSize.kich_thuoc.toLowerCase() &&
//           size.loai_kich_thuoc === newSize.loai_kich_thuoc
//       );
//       if (existingSize) {
//         throw new Error("Kích thước đã tồn tại");
//       }

//       const response = await instance.post("/bienthekichthuoc", newSize);
//       if (response.data.status) {
//         return response.data;
//       } else {
//         throw new Error(response.data.message || "Failed to add size");
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["size"] });
//       message.success("Thêm kích thước thành công");
//       form.resetFields();
//     },
//     onError: (error: Error) => {
//       console.error("Error adding size:", error);
//       message.error(error.message || "Thêm kích thước thất bại");
//     },
//   });

//   const handleAddSize = (): void => {
//     form.validateFields().then((values) => {
//       addSizeMutation.mutate({
//         kich_thuoc: values.tensize,
//         loai_kich_thuoc: values.loai_kich_thuoc,
//       });
//     });
//   };

//   const handleSearch = (
//     selectedKeys: string[],
//     confirm: () => void,
//     dataIndex: SizeDataIndex
//   ) => {
//     confirm();
//     setSearchText(selectedKeys[0]);
//     setSearchedColumn(dataIndex);
//   };

//   const handleReset = (clearFilters: () => void) => {
//     clearFilters();
//     setSearchText("");
//   };

//   const getColumnSearchProps = (dataIndex: SizeDataIndex) => ({
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
//     onFilter: (value: string, record: SizeDataType) =>
//       record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
//     onFilterDropdownOpenChange: (visible: boolean) => {
//       if (visible) {
//         setTimeout(() => searchInput.current?.select(), 100);
//       }
//     },
//     render: (text: string) =>
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

//   const columns: ColumnsType<SizeDataType> = [
//     {
//       title: "STT",
//       key: "stt",
//       render: (_, __, index) => index + 1,
//       width: "10%",
//     },
//     {
//       title: "Tên Size",
//       dataIndex: "kich_thuoc",
//       key: "kich_thuoc",
//       width: "50%",
//       sorter: (a, b) => a.kich_thuoc.localeCompare(b.kich_thuoc),
//       ...getColumnSearchProps("kich_thuoc"),
//     },
//     {
//       title: "Loại kích thước",
//       dataIndex: "loai_kich_thuoc",
//       key: "loai_kich_thuoc",
//       width: "50%",
//       sorter: (a, b) => a.loai_kich_thuoc.localeCompare(b.loai_kich_thuoc),
//       ...getColumnSearchProps("loai_kich_thuoc"),
//     },
//     {
//       title: "Quản trị",
//       key: "action",
//       render: (_, item) => (
//         <Space>
//           <Popconfirm
//             title="chuyển vào thùng rác?"
//             description="Bạn có chắc chắn muốn xóa không?"
//             okText="Có"
//             cancelText="Không"
//             onConfirm={() => deleteMutation.mutate(item.id)}
//           >
//             <Button className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300">
//               Xóa
//             </Button>
//           </Popconfirm>
//           <Link to={`/admin/products/bienthesize/edit/${item.id}`}>
//             <Button className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold">
//               Cập nhật
//             </Button>
//           </Link>
//         </Space>
//       ),
//     },
//   ];

//   if (isError)
//     return (
//       <div>
//         <div className="flex items-center justify-center  mt-[250px]">
//           <div className=" ">
//             <Spin size="large" />
//           </div>
//         </div>
//       </div>
//     );

//   return (
//     <>
//       <Form form={form} className="mt-4 flex space-x-2">
//         <Form.Item
//           className="flex-grow mb-0"
//           name="tensize"
//           rules={[
//             { required: true, message: "Vui lòng nhập tên kích thước" },
//             { max: 50, message: "Tên kích thước không được quá 50 ký tự" },
//             {
//               pattern: /^[^\s]+(\s+[^\s]+)*$/,
//               message: "Vui lòng nhập họ không chứa ký tự trắng!",
//             },
//           ]}
//         >
//           <Input placeholder="Tên kích thước" />
//         </Form.Item>
//         <Form.Item
//           className="flex-grow mb-0"
//           name="loai_kich_thuoc"
//           rules={[{ required: true, message: "Vui lòng chọn loại kích thước" }]}
//         >
//           <Select placeholder="Chọn loại kích thước">
//             <Select.Option value="nam">Nam</Select.Option>
//             <Select.Option value="nu">Nữ</Select.Option>
//             <Select.Option value="tre_em">Trẻ em</Select.Option>
//           </Select>
//         </Form.Item>
//         <Button
//           type="primary"
//           className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
//           onClick={handleAddSize}
//         >
//           Thêm size
//         </Button>
//       </Form>
//       <br />
//       <Table
//         columns={columns}
//         dataSource={sizes}
//         pagination={{ pageSize: 5, className: "my-5" }}
//         className="equal-width-table"
//         loading={isLoading}
//       />
//     </>
//   );
// };

// export default SizeManagement;
import React, { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Space,
  Table,
  Form,
  InputRef,
  Popconfirm,
  message,
  Spin,
  Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Highlighter from "react-highlight-words";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import instance from "@/configs/admin";

interface SizeDataType {
  key: string;
  id: number;
  kich_thuoc: string;
  loai_kich_thuoc: string;
}

type SizeDataIndex = keyof SizeDataType;

const SizeManagement: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["size"],
    queryFn: async () => {
      const res = await instance.get("/bienthekichthuoc");
      return res.data;
    },
  });

  const sizes = data?.data.map((item: any, index: number) => ({
    ...item,
    key: item.id,
    index,
  }));

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const response = await instance.delete(`/bienthekichthuoc/${id}`);
      if (response.data.status) {
        return id;
      } else {
        throw new Error(response.data.message || "Failed to delete");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["size"] });
      message.success("Xóa kích thước thành công");
    },
    onError: (error) => {
      console.error("Error deleting kích thước:", error);
      message.error("Xóa kích thước thất bại");
    },
  });

  const addSizeMutation = useMutation({
    mutationFn: async (newSize: { kich_thuoc: string; loai_kich_thuoc: string }) => {
      const existingSize = sizes.find(
        (size: any) =>
          size.kich_thuoc.toLowerCase() === newSize.kich_thuoc.toLowerCase() &&
          size.loai_kich_thuoc === newSize.loai_kich_thuoc
      );
      if (existingSize) {
        throw new Error("Kích thước đã tồn tại");
      }

      const response = await instance.post("/bienthekichthuoc", newSize);
      if (response.data.status) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to add size");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["size"] });
      message.success("Thêm kích thước thành công");
      form.resetFields();
    },
    onError: (error: any) => {
      console.error("Error adding size:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        errorMessages.map((msg) => message.error(msg as string));
      } else {
        message.error(error.message || "Thêm kích thước thất bại");
      }
    },
  });

  const handleAddSize = (): void => {
    form.validateFields().then((values) => {
      addSizeMutation.mutate({
        kich_thuoc: values.tensize,
        loai_kich_thuoc: values.loai_kich_thuoc,
      });
    });
  };

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: SizeDataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: SizeDataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value: string, record: SizeDataType) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: string) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<SizeDataType> = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => index + 1,
      width: "10%",
    },
    {
      title: "Tên Size",
      dataIndex: "kich_thuoc",
      key: "kich_thuoc",
      width: "50%",
      sorter: (a, b) => a.kich_thuoc.localeCompare(b.kich_thuoc),
      ...getColumnSearchProps("kich_thuoc"),
    },
    {
      title: "Loại kích thước",
      dataIndex: "loai_kich_thuoc",
      key: "loai_kich_thuoc",
      width: "50%",
      // sorter: (a, b) => a.loai_kich_thuoc.localeCompare(b.loai_kich_thuoc),
      // ...getColumnSearchProps("loai_kich_thuoc"),
      render: (text: string) => {
        switch (text) {
          case 'nam':
            return 'Nam';
          case 'nu':
            return 'Nữ';
          case 'tre_em':
            return 'Trẻ em';
          default:
            return text;
        }
      },
    },
    {
      title: "Quản trị",
      key: "action",
      render: (_, item) => (
        <Space>
          <Popconfirm
            title="chuyển vào thùng rác?"
            description="Bạn có chắc chắn muốn xóa không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => deleteMutation.mutate(item.id)}
          >
            <Button className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300">
              Xóa
            </Button>
          </Popconfirm>
          <Link to={`/admin/products/bienthesize/edit/${item.id}`}>
            <Button className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold">
              Cập nhật
            </Button>
          </Link>
        </Space>
      ),
    },
  ];

  if (isError)
    return (
      <div>
        <div className="flex items-center justify-center  mt-[250px]">
          <div className=" ">
            <Spin size="large" />
          </div>
        </div>
      </div>
    );

  // const validateSize = (_: any, value: string) => {
  //   const validSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  //   if (form.getFieldValue('loai_kich_thuoc') === 'nam' && !validSizes.includes(value.toUpperCase())) {
  //     return Promise.reject('Kích thước cho nam chỉ được phép từ S đến XXL.');
  //   }
  //   return Promise.resolve();
  // };

  return (
    <>
      <Form form={form} className="mt-4 flex space-x-2">
        <Form.Item
          className="flex-grow mb-0"
          name="tensize"
          rules={[
            { required: true, message: "Vui lòng nhập tên kích thước" },
            { max: 50, message: "Tên kích thước không được quá 50 ký tự" },
            {
              pattern: /^[^\s]+(\s+[^\s]+)*$/,
              message: "Vui lòng nhập họ không chứa ký tự trắng!",
            },
            // { validator: validateSize },
          ]}
        >
          <Input placeholder="Tên kích thước" />
        </Form.Item>
        <Form.Item
          className="flex-grow mb-0"
          name="loai_kich_thuoc"
          rules={[{ required: true, message: "Vui lòng chọn loại kích thước" }]}
        >
          <Select placeholder="Chọn loại kích thước">
            <Select.Option value="nam">Nam</Select.Option>
            <Select.Option value="nu">Nữ</Select.Option>
            <Select.Option value="tre_em">Trẻ em</Select.Option>
          </Select>
        </Form.Item>
        <Button
          type="primary"
          className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors"
          onClick={handleAddSize}
        >
          Thêm size
        </Button>
      </Form>
      <br />
      <Table
        columns={columns}
        dataSource={sizes}
        pagination={{ pageSize: 5, className: "my-5" }}
        className="equal-width-table"
        loading={isLoading}
      />
    </>
  );
};

export default SizeManagement;
