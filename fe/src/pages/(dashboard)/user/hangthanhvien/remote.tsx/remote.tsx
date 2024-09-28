// import React, { useRef, useState } from "react";
// import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
// import { Button, Input, message, Popconfirm, Space, Table, Tabs } from "antd";
// import type { InputRef, TableColumnsType } from "antd";
// import type { FilterDropdownProps } from "antd/es/table/interface";
// import Highlighter from "react-highlight-words";
// import { Link } from "react-router-dom";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import instance from "@/configs/axios";
// import { toast } from "react-toastify";

// interface ICategories {
//   id: string | number;
//   anh_san_pham?: string;
//   chi_tieu_toi_thieu: number;
//   chi_tieu_toi_da: number;
//   // Add other properties as needed
// }

// const Remoterank: React.FC = () => {
//   const [searchedColumn, setSearchedColumn] = useState<string>("");
//   const searchInput = useRef<InputRef>(null);
//   const [searchText, setSearchText] = useState<string>("");
//   const queryClient = useQueryClient();

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["rank"],
//     queryFn: async () => {
//       try {
//         const response = await instance.get("/admin/hangthanhvien/thung-rac");
//         return response.data;
//       } catch (error) {
//         console.error("Error fetching :", error);
//         throw new Error("Error fetching ");
//       }
//     },
//   });

//   const dataSource =
//     data?.data.map((record: any, index: number) => ({
//       key: record.id,
//       ...record,
//       index: index + 1,
//     })) || [];

//     const { mutate } = useMutation({
//         mutationFn: async (id: string | number) => {
//           try {
//             const response = await instance.post(`/admin/hangthanhvien/thung-rac/${id}`);
//             if (response.data.status) {
//               message.open({
//                 type: "success",
//                 content: "Khôi phục thành công",
//               });
//               return id;
//             } else {
//               throw new Error(response.data.message || "Failed to delete");
//             }
//           } catch (error) {
//             console.error("Error deleting category:", error);
//             throw error;
//           }
//         },
//         onSuccess: () => {
//           queryClient.invalidateQueries({ queryKey: ["rank"] });
//         },
//         onError: (error) => {
//           console.error("Error deleting category:", error);
//           message.open({
//             type: "error",
//             content: "Xóa danh mục thất bại",
//           });
//         },
//       });
      

//   const handleSearch = (
//     selectedKeys: string[],
//     confirm: FilterDropdownProps["confirm"],
//     dataIndex: string
//   ) => {
//     confirm();
//     setSearchText(selectedKeys[0]);
//     setSearchedColumn(dataIndex);
//   };

//   const handleReset = (clearFilters: () => void) => {
//     clearFilters();
//     setSearchText("");
//   };

//   const getColumnSearchProps = (dataIndex: string) => ({
//     filterDropdown: ({
//       setSelectedKeys,
//       selectedKeys,
//       confirm,
//       clearFilters,
//     }: FilterDropdownProps) => (
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
//     onFilter: (value: string | number | boolean, record: ICategories) =>
//       record[dataIndex]
//         .toString()
//         .toLowerCase()
//         .includes((value as string).toLowerCase()),
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

//   const columns: TableColumnsType<ICategories> = [
//     {
//       title: "STT",
//       width: "10%",
//       key: "index",
//       dataIndex: "index",
//     },
//     {
//       title: "Hạng thành viên",
//       render: (record: any) => (
//         <div className="flex items-center">
//           <img
//             src={record.anh_hang_thanh_vien || "https://via.placeholder.com/24"}
//             alt="member rank"
//             className="w-6 h-6 object-cover rounded-full mr-2"
//           />
//           <span className="text-sm font-medium capitalize">
//             {record.ten_hang_thanh_vien || "Chưa có hạng"}
//           </span>
//         </div>
//       ),
//       className: "pl-4",
//       width: "20%",
//       key: "hang_thanh_vien",
//     },
    
    
//     {
//       title: "Chi tiêu",
//       dataIndex: "",
//       key: "chi_tieu",
//       width: "30%",
//       ...getColumnSearchProps("chi_tieu"),
//       sorter: (a: ICategories, b: ICategories) =>
//         a.chi_tieu_toi_thieu - b.chi_tieu_toi_thieu || a.chi_tieu_toi_da - b.chi_tieu_toi_da,
//       render: (text: string, record: ICategories) => {
//         const formatCurrency = (value: number) => 
//           new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    
//         return `${formatCurrency(record.chi_tieu_toi_thieu)} - ${formatCurrency(record.chi_tieu_toi_da)}`;
//       },
//     },
//     {
//       title: "Quản trị",
//       key: "action",
//       render: (_, record) => (
//         <Space>
//           <Button
//             className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white"
//             onClick={() => mutate(record.id)}
//           >
//             Khôi phục
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>Error</div>;

//   return (
//     <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//       <div className="flex items-center">
//         <h1 className="md:text-base">
//           Quản trị / <span className="font-semibold px-px">Thùng rác</span>
//         </h1>
//       </div>
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="font-semibold md:text-3xl">Thùng rác</h1>
//         <div>
//           <Link to="/admin/users/rank">
//             <Button className="ml-auto bg-black text-white rounded-lg py-1">
//               Quay lại
//             </Button>
//           </Link>
//         </div>
//       </div>
//       <div className="max-w-4xl">
//         <Table columns={columns} dataSource={dataSource} />
//       </div>
//     </main>
//   );
// };

// export default Remoterank;
import React, { useRef, useState } from "react";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Popconfirm, Space, Table, Tabs } from "antd";
import type { InputRef, TableColumnsType } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import instance from "@/configs/axios";
import { toast } from "react-toastify";

interface IMemberRank {
  id: string | number;
  ten_hang_thanh_vien: string;
  anh_hang_thanh_vien: string;
  chi_tieu_toi_thieu: number;
  chi_tieu_toi_da: number;
}

const Remoterank: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState<string>("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["rank"],
    queryFn: async () => {
      try {
        const response = await instance.get("/admin/hangthanhvien/thung-rac");
        return response.data;
      } catch (error) {
        console.error("Error fetching :", error);
        throw new Error("Error fetching ");
      }
    },
  });

  const dataSource =
    data?.data.map((record: IMemberRank, index: number) => ({
      key: record.id,
      ...record,
      index: index + 1,
    })) || [];

  const { mutate } = useMutation({
    mutationFn: async (id: string | number) => {
      try {
        const response = await instance.post(`/admin/hangthanhvien/thung-rac/${id}`);
        if (response.data.status) {
          message.open({
            type: "success",
            content: "Khôi phục thành công",
          });
          return id;
        } else {
          throw new Error(response.data.message || "Failed to delete");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rank"] });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      message.open({
        type: "error",
        content: "Xóa danh mục thất bại",
      });
    },
  });

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: string
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
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
            Search
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
    onFilter: (value: string | number | boolean, record: IMemberRank) =>
      record[dataIndex as keyof IMemberRank]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
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

  const columns: TableColumnsType<IMemberRank> = [
    {
      title: "STT",
      width: "10%",
      key: "index",
      dataIndex: "index",
    },
    {
      title: "Hạng thành viên",
      render: (record: IMemberRank) => (
        <div className="flex items-center">
          <img
            src={record.anh_hang_thanh_vien || "https://via.placeholder.com/24"}
            alt="member rank"
            className="w-6 h-6 object-cover rounded-full mr-2"
          />
          <span className="text-sm font-medium capitalize">
            {record.ten_hang_thanh_vien || "Chưa có hạng"}
          </span>
        </div>
      ),
      className: "pl-4",
      width: "20%",
      key: "hang_thanh_vien",
    },
    {
      title: "Chi tiêu",
      dataIndex: "",
      key: "chi_tieu",
      width: "30%",
      ...getColumnSearchProps("chi_tieu_toi_thieu"),
      sorter: (a: IMemberRank, b: IMemberRank) =>
        a.chi_tieu_toi_thieu - b.chi_tieu_toi_thieu || a.chi_tieu_toi_da - b.chi_tieu_toi_da,
      render: (text: string, record: IMemberRank) => {
        const formatCurrency = (value: number) => 
          new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    
        return `${formatCurrency(record.chi_tieu_toi_thieu)} - ${formatCurrency(record.chi_tieu_toi_da)}`;
      },
    },
    {
      title: "Quản trị",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white"
            onClick={() => mutate(record.id)}
          >
            Khôi phục
          </Button>
        </Space>
      ),
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold px-px">Thùng rác</span>
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Thùng rác</h1>
        <div>
          <Link to="/admin/users/rank">
            <Button className="ml-auto bg-black text-white rounded-lg py-1">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      <div className="max-w-4xl">
        <Table columns={columns} dataSource={dataSource} />
      </div>
    </main>
  );
};

export default Remoterank;
