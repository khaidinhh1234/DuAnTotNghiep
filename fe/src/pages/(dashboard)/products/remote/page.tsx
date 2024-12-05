// import instance from "@/configs/admin";
// import { SearchOutlined } from "@ant-design/icons";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import type { InputRef, TableColumnsType, TableColumnType } from "antd";
// import { Button, Input, message, Popconfirm, Space, Spin, Table } from "antd";
// import type { FilterDropdownProps } from "antd/es/table/interface";
// import React, { useRef, useState } from "react";
// import Highlighter from "react-highlight-words";
// import { Link, useNavigate } from "react-router-dom";

// interface DataType {
//   key: React.Key;
//   id: string;
//   anh_san_pham: string;
//   ten_san_pham: string;
//   id_danh_muc: string;
//   ten_danh_muc: string;
//   luot_xem: number;
//   mo_ta_ngan: string;
//   noi_dung: string;
// }

// type DataIndex = keyof DataType;

// const ProductsRemote: React.FC = () => {
//   const [searchedColumn, setSearchedColumn] = useState("");
//   const [searchText, setSearchText] = useState("");
//   const searchInput = useRef<InputRef>(null);
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["sanpham-remote"],
//     queryFn: async () => {
//       try {
//         const response = await instance.get("/sanpham/thung-rac");
//         console.log("Fetched data:", response.data); // In ra dữ liệu sau khi lấy được

//         return response.data;
//       } catch (error) {
//         console.error("Error fetching remote products:", error);
//         throw new Error("Error fetching remote products");
//       }
//     },
//   });

//   const sanpham = data?.data.map((item: any, index: number) => ({
//     ...item,
//     key: item.id,
//     index,
//     ten_danh_muc: item.danh_muc
//       ? item.danh_muc.ten_danh_muc
//       : "Không có danh mục",
//     trang_thai: item.trang_thai || 0,
//     tongSoLuong:
//       item.bien_the_san_pham?.reduce((total: number, variant: any) => {
//         return total + (variant.so_luong_bien_the || 0);
//       }, 0) || 0,
//   }));

//   const restoreMutation = useMutation({
//     mutationFn: async (id: string) => {
//       await instance.post(`/sanpham/thung-rac/${id}`);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["sanpham-remote"] });

//       message.open({
//         type: "success",
//         content: "Khôi phục sản phẩm thành công",
//       });
//       navigate("/admin/products");
//     },
//     onError: () => {
//       message.open({
//         type: "error",
//         content: "Khôi phục sản phẩm thất bại",
//       });
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: async (id: string) => {
//       await instance.delete(`/admin/sanpham/${id}`);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["sanpham-remote"] });
//       message.open({
//         type: "success",
//         content: "Xóa sản phẩm vĩnh viễn thành công",
//       });
//     },
//     onError: () => {
//       message.open({
//         type: "error",
//         content: "Xóa sản phẩm vĩnh viễn thất bại",
//       });
//     },
//   });

//   const handleRestore = (id: string) => {
//     restoreMutation.mutate(id);
//   };

//   const handleDelete = (id: string) => {
//     deleteMutation.mutate(id);
//   };

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
//       sorter: (a, b) => a.ten_san_pham.length - b.ten_san_pham.length,
//     },
//     {
//       title: "Danh mục",
//       dataIndex: "ten_danh_muc",
//       key: "ten_danh_muc",
//       width: "15%",
//       ...getColumnSearchProps("ten_danh_muc"),
//       sorter: (a, b) => a.ten_danh_muc.length - b.ten_danh_muc.length,
//     },
//     {
//       title: "Kho",
//       dataIndex: "tongSoLuong",
//       key: "tongSoLuong",
//       width: "15%",
//       render: (text) => {
//         return text ? (
//           `${text.toLocaleString()} `
//         ) : (
//           <span style={{ color: "#ff5555" }}>Hết hàng</span>
//         );
//       },
//     },

//     {
//       title: "Quản trị",
//       key: "action",
//       render: (_, record) => (
//         <Space>
//           <Popconfirm
//             title="Xóa vĩnh viễn sản phẩm"
//             description="Bạn có chắc chắn muốn xóa vĩnh viễn không?"
//             okText="Có"
//             cancelText="Không"
//             onConfirm={() => handleDelete(record.id)}
//           >
//             {/* <Button className="bg-white text-red-500 border border-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 shadow-md transition-colors">
//               Xóa vĩnh viễn
//             </Button> */}
//           </Popconfirm>
//           <Button
//             onClick={() => handleRestore(record.id)}
//             className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold"
//           >
//             Khôi phục
//           </Button>
//         </Space>
//       ),
//     },
//   ];

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchText(e.target.value);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       console.log(searchText);
//       // Perform search action here
//     }
//   };
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
//             <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
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
//         <Table
//           columns={columns}
//           dataSource={sanpham}
//           loading={isLoading}
//           rowKey="id"
//           pagination={{ pageSize: 10, className: "my-5" }}
//         />
//       </div>
//     </main>
//   );
// };

// export default ProductsRemote;
import instance from "@/configs/admin";
import { SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, message, Space, Spin, Table } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link, useNavigate } from "react-router-dom";

interface DataType {
  key: React.Key;
  id: string;
  anh_san_pham: string;
  ten_san_pham: string;
  id_danh_muc: string;
  ten_danh_muc: string;
  luot_xem: number;
  mo_ta_ngan: string;
  ma_san_pham: string;
  noi_dung: string;
  tongSoLuong: number;
}

type DataIndex = keyof DataType;

const ProductsRemote: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const searchInput = useRef<InputRef>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sanpham-remote"],
    queryFn: async () => {
      try {
        const response = await instance.get("sanpham/thung-rac");
        return response.data;
      } catch (error) {
        console.error("Error fetching remote products:", error);
        throw new Error("Error fetching remote products");
      }
    },
  });

  const sanpham = data?.data.map((item: any, index: number) => ({
    ...item,
    key: item.id,
    index,
    ten_danh_muc: item.danh_muc
      ? item.danh_muc.ten_danh_muc
      : "Không có danh mục",
    trang_thai: item.trang_thai || 0,
    tongSoLuong:
      item.bien_the_san_pham?.reduce((total: number, variant: any) => {
        return total + (variant.so_luong_bien_the || 0);
      }, 0) || 0,
  }));

  const restoreSingleProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await instance.post(`sanpham/thung-rac/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sanpham-remote"] });
      message.open({
        type: "success",
        content: "Cập nhật trạng thái sản phẩm thành công",
      });
      navigate("/admin/products");
    },
    onError: () => {
      message.open({
        type: "error",
        content: "Cập nhật trạng thái sản phẩm thất bại",
      });
    },
  });

  const restoreMultipleProductsMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await instance.patch("sanphams/khoi-phuc-xoa-mem-nhieu-san-pham", {
        san_phams: ids,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sanpham-remote"] });
      message.open({
        type: "success",
        content: "Cập nhật các trạng thái sản phẩm thành công",
      });
      setSelectedRowKeys([]);
      navigate("/admin/products");
    },
    onError: () => {
      message.open({
        type: "error",
        content: "Cập nhật các trạng thái sản phẩm thất bại",
      });
    },
  });

  // const deleteMutation = useMutation({
  //   mutationFn: async (id: string) => {
  //     await instance.delete(`/admin/sanpham/${id}`);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["sanpham-remote"] });
  //     message.open({
  //       type: "success",
  //       content: "Xóa sản phẩm vĩnh viễn thành công",
  //     });
  //   },
  //   onError: () => {
  //     message.open({
  //       type: "error",
  //       content: "Xóa sản phẩm vĩnh viễn thất bại",
  //     });
  //   },
  // });

  const handleRestoreSingle = (id: string) => {
    restoreSingleProductMutation.mutate(id);
  };

  const handleRestoreMultiple = () => {
    if (selectedRowKeys.length > 0) {
      restoreMultipleProductsMutation.mutate(selectedRowKeys as string[]);
    } else {
      message.warning("Vui lòng chọn ít nhất một sản phẩm để cập nhật");
    }
  };

  // const handleDelete = (id: string) => {
  //   deleteMutation.mutate(id);
  // };

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
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
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
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

  const columns: TableColumnsType<DataType> = [
    {
      title: "Thông tin sản phẩm",
      dataIndex: "ten_san_pham",
      key: "ten_san_pham",
      width: "30%",
      ...getColumnSearchProps("ten_san_pham"),
      sorter: (a, b) => a.ten_san_pham.length - b.ten_san_pham.length,
      render: (text, item) => (
        <div className="flex gap-5 p-2 bg-slate-100 shadow-md rounded-lg hover:bg-slate-300 hover:shadow-2xl transition duration-300 cursor-pointer">
          <div className="border rounded-lg overflow-hidden">
            <img
              src={item.anh_san_pham || "https://via.placeholder.com/150"}
              alt="product"
              className="w-20 h-20 object-cover"
            />
          </div>
          <div>
            {/* Text tên sản phẩm */}
            <p className="text-lg font-bold truncate w-40">
              {item.ten_san_pham}
            </p>
            {/* Mô tả ngắn */}
            <p className="text-xs text-gray-500 truncate w-40">
              {item.mo_ta_ngan}
            </p>
          </div>
        </div>
      ),
    },

    // {
    //   title: "Ảnh sản phẩm",
    //   render: (record) => (
    //     <img
    //       src={record.anh_san_pham}
    //       alt=""
    //       className="w-20 h-20 object-cover rounded-lg p-2 border "
    //     />
    //   ),
    //   className: "pl-10",
    //   width: "15%",
    //   key: "anh_san_pham",
    // },
    // {
    //   title: "Tên sản phẩm",
    //   dataIndex: "ten_san_pham",
    //   key: "ten_san_pham",
    //   width: "15%",
    //   ...getColumnSearchProps("ten_san_pham"),
    //   sorter: (a, b) => a.ten_san_pham.length - b.ten_san_pham.length,
    // },
    {
      title: "Mã sản phẩm",
      dataIndex: "ma_san_pham",
      key: "ma_san_pham",
      width: "15%",
      ...getColumnSearchProps("ma_san_pham"),
      sorter: (a, b) => a.ma_san_pham.length - b.ma_san_pham.length,
    },
    {
      title: "Danh mục",
      dataIndex: "ten_danh_muc",
      key: "ten_danh_muc",
      width: "15%",
      ...getColumnSearchProps("ten_danh_muc"),
      sorter: (a, b) => a.ten_danh_muc.length - b.ten_danh_muc.length,
    },
    {
      title: "Kho",
      dataIndex: "tongSoLuong",
      key: "tongSoLuong",
      width: "15%",
      sorter: (a, b) => a.tongSoLuong - b.tongSoLuong,
      render: (text) => {
        return text ? (
          `${text.toLocaleString()} `
        ) : (
          <span style={{ color: "#ff5555" }}>Hết hàng</span>
        );
      },
    },
    {
      title: "Quản trị",
      key: "action",
      render: (_, record) => (
        <Space>
          {/* <Popconfirm
            title="Xóa vĩnh viễn sản phẩm"
            description="Bạn có chắc chắn muốn xóa vĩnh viễn không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button className="bg-white text-red-500 border border-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 shadow-md transition-colors">
              Xóa vĩnh viễn
            </Button>
          </Popconfirm> */}
          <Button
            onClick={() => handleRestoreSingle(record.id)}
            className="bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold"
          >
            Hoạt động
          </Button>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(searchText);
      // Perform search action here
    }
  };

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

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className=" md:text-base">
          Quản trị / Sản phẩm /{" "}
          <span className="font-semibold px-px=">Thùng rác </span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className=" font-semibold md:text-3xl"> Thùng rác</h1>
        <div>
          <Link to="/admin/products">
            <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      <div className=" ">
        <div className="max-w-sm my-2">
          <div className="flex items-center">
            <Button
              type="primary"
              onClick={handleRestoreMultiple}
              disabled={selectedRowKeys.length === 0}
              className={`
    ${
      selectedRowKeys.length > 0
        ? "bg-gradient-to-l to-cyan-500 text-white  "
        : "bg-gray-200 text-gray-400 cursor-not-allowed"
    }
    transition-all duration-300 ease-in-out
    font-bold py-2 px-4 rounded h-8 mr-2
  `}
            >
              Hoạt động({selectedRowKeys.length})
            </Button>

            <Input
              placeholder="Tìm kiếm..."
              size="large"
              value={searchText}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="flex-grow max-w-[300px]" // Điều chỉnh max-width tùy theo ý muốn
            />
          </div>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={sanpham}
          loading={isLoading}
          rowKey="id"
          pagination={{ pageSize: 10, className: "my-5" }}
        />
      </div>
    </main>
  );
};

export default ProductsRemote;
