// import { ICategories } from "@/common/types/category";
// import instance from "@/configs/admin";
// import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import type { InputRef, TableColumnsType } from "antd";
// import { Button, Input, message, Popconfirm, Space, Spin, Table } from "antd";
// import type { FilterDropdownProps } from "antd/es/table/interface";
// import React, { useRef, useState } from "react";
// import Highlighter from "react-highlight-words";
// import { Link } from "react-router-dom";

// const TagsAdmin: React.FC = () => {
//   const [searchedColumn, setSearchedColumn] = useState<string>("");
//   const searchInput = useRef<InputRef>(null);
//   const [searchText, setSearchText] = useState("");

//   const queryClient = useQueryClient();

//   const {
//     data: tags,
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["tag"],
//     queryFn: async () => {
//       try {
//         const response = await instance.get("bosuutap");
//         const tag = response.data;

//         return tag;
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         throw new Error("Error fetching categories");
//       }
//     },
//   });

//   const dataSource = tags?.data?.map((tag: any, index: number) => ({
//     key: tag.id,
//     ...tag,
//     index: index + 1,
//   }));
//   // console.log(tags);
//   const { mutate } = useMutation({
//     mutationFn: async (id: string | number) => {
//       try {
//         const response = await instance.delete(`/bosuutap/${id}`);
//         if (response.data.status) {
//           return id;
//         } else {
//           throw new Error(response.data.message || "Failed to delete");
//         }
//       } catch (error) {
//         console.error("Error deleting category:", error);
//         throw error;
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["tag"] });
//       message.open({
//         type: "success",
//         content: "Xóa thẻ thành công",
//       });
//     },
//     onError: (error) => {
//       console.error("Error deleting category:", error);
//       message.open({
//         type: "error",
//         content: "Xóa thẻ  thất bại",
//       });
//     },
//   });

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
//     }: any) => (
//       <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
//         <Input
//           ref={searchInput}
//           placeholder={`Search ${dataIndex}`}
//           value={selectedKeys[0] as string}
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
//     onFilter: (value: string | number | boolean, record: any) =>
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
//       title: "Tên Bô Sưu Tập",
//       width: "40%",
//       key: "ten",
//       dataIndex: "ten",
//       sorter: (a: any, b: any) => a.ten.localeCompare(b.ten),
//       ...getColumnSearchProps("ten_the"),
//       onFilter: (value: boolean | React.Key, record: ICategories) =>
//         record.ten
//           .toString()
//           .toLowerCase()
//           .includes(value.toString().toLowerCase()),
//       render: (text) => (text ? text : "Chưa có dữ liệu"),
//     },
//     {
//       title: "Ảnh bộ sưu tập",
//       width: "15%",
//       key: "duong_dan_anh",
//       dataIndex: "duong_dan_anh",
//       render: (duong_dan_anh: string) =>
//         duong_dan_anh ? (
//           <img
//             src={duong_dan_anh}
//             alt="Ảnh danh mục"
//             style={{ width: "50px", height: "50px", objectFit: "cover" }}
//           />
//         ) : (
//           <span>Ảnh không có</span>
//         ),
//     },
//     {
//       title: "Quản trị",
//       key: "action",
//       render: (_, tag) => (
//         <Space>
//           <Popconfirm
//             title="Chuyển vào thùng rác"
//             description="Bạn có chắc chắn muốn xóa không?"
//             onConfirm={() => mutate(tag.id!)}
//             okText="Có"
//             cancelText="Không"
//           >
//             <Button className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300">
//               Xóa
//             </Button>
//           </Popconfirm>
//           <Link to={`/admin/products/tags/edit/${tag.id}`}>
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
//     <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//       <div className="flex items-center">
//         <h1 className="md:text-base">
//           Quản trị / <span className="font-semibold px-px">Bộ sưu tập</span>
//         </h1>
//       </div>
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="font-semibold md:text-3xl">Bộ sưu tập</h1>
//         <div className="flex">
//           <Link to="/admin/products/tags/add" className="mr-1">
//             <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
//               <i className="fa-sharp fa-solid fa-plus text-2xl"></i>
//               Thêm
//             </Button>
//           </Link>
//           <Link to="/admin/products/tags/remote">
//             <Button className="bg-gradient-to-r  from-red-500 to-orange-500 text-white rounded-lg py-1 hover:bg-red-600 shadow-md transition-colors flex items-center">
//               <DeleteOutlined className="mr-1" />
//               Thùng rác
//             </Button>
//           </Link>
//         </div>
//       </div>
//       <div className="max-w-4xl">
//         <Table
//           columns={columns}
//           dataSource={dataSource ? dataSource : []}
//           loading={isLoading}
//           pagination={{ pageSize: 10, className: "my-5" }}
//         />
//       </div>
//     </main>
//   );
// };

// export default TagsAdmin;
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Input, message, Popconfirm, Space, Spin, Table, Modal, Image, Typography } from 'antd';
import type { InputRef, TableColumnsType } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import instance from '@/configs/admin';
import { ICategories } from '@/common/types/category';
import Detail from "@/pages/(dashboard)/products/detail/page";

const { Title, Text } = Typography;

interface Product {
  id: number;
  ten_san_pham: string;
  anh_san_pham: string;
}

interface CollectionData extends ICategories {
  san_phams: Product[];
  duong_dan_anh?: string;
}

const TagsAdmin: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<CollectionData | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);

  const showProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalVisible(true);
  };
  const queryClient = useQueryClient();

  const {
    data: tags,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tag"],
    queryFn: async () => {
      try {
        const response = await instance.get("bosuutap");
        return response.data;
      } catch (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Error fetching categories");
      }
    },
  });

  const dataSource = tags?.data?.map((tag: any, index: number) => ({
    key: tag.id,
    ...tag,
    index: index + 1,
  }));

  const { mutate } = useMutation({
    mutationFn: async (id: string | number) => {
      try {
        const response = await instance.delete(`/bosuutap/${id}`);
        if (response.data.status) {
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
      queryClient.invalidateQueries({ queryKey: ["tag"] });
      message.success("Xóa thẻ thành công");
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      message.error("Xóa thẻ thất bại");
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
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
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
    onFilter: (value: string | number | boolean, record: any) =>
      record[dataIndex]
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

  const showCollectionDetails = async (id: number) => {
    try {
      const response = await instance.get(`/bosuutap/${id}`);
      setSelectedCollection(response.data.data);
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching collection details:", error);
      message.error("Failed to load collection details");
    }
  };

  const columns: TableColumnsType<CollectionData> = [
    {
      title: "STT",
      width: "10%",
      key: "index",
      dataIndex: "index",
    },
    {
      title: "Tên Bộ Sưu Tập",
      width: "40%",
      key: "ten",
      dataIndex: "ten",
      sorter: (a: any, b: any) => a.ten.localeCompare(b.ten),
      ...getColumnSearchProps("ten"),
      onFilter: (value: boolean | React.Key, record: CollectionData) =>
        record.ten
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase()),
          render: (text, record) => (
            <a       className="text-black"
            onClick={() => showCollectionDetails(Number(record.id))}>{text || "Chưa có dữ liệu"}</a>
          ),
    },
    {
      title: "Ảnh bộ sưu tập",
      width: "15%",
      key: "duong_dan_anh",
      dataIndex: "duong_dan_anh",
      render: (duong_dan_anh: string) =>
        duong_dan_anh ? (
          <img
            src={duong_dan_anh}
            alt="Ảnh danh mục"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          <span>Ảnh không có</span>
        ),
    },
    {
      title: "Quản trị",
      key: "action",
      render: (_, tag) => (
        <Space>
          <Popconfirm
            title="Chuyển vào thùng rác"
            description="Bạn có chắc chắn muốn xóa không?"
            onConfirm={() => mutate(tag.id!)}
            okText="Có"
            cancelText="Không"
          >
            <Button className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300">
              Xóa
            </Button>
          </Popconfirm>
          <Link to={`/admin/products/tags/edit/${tag.id}`}>
            <Button className="bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold">
              Cập nhật
            </Button>
          </Link>
          {/* <Button
            className="bg-gradient-to-l from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 border border-blue-300 font-bold"
            onClick={() => showCollectionDetails(Number(tag.id))}
          >
            <EyeOutlined /> Chi tiết
          </Button> */}
        </Space>
      ),
    },
  ];

  if (isError)
    return (
      <div className="flex items-center justify-center mt-[250px]">
        <Spin size="large" />
      </div>
    );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold px-px">Bộ sưu tập</span>
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Bộ sưu tập</h1>
        <div className="flex">
          <Link to="/admin/products/tags/add" className="mr-1">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              <i className="fa-sharp fa-solid fa-plus text-2xl"></i>
              Thêm
            </Button>
          </Link>
          <Link to="/admin/products/tags/remote">
            <Button className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg py-1 hover:bg-red-600 shadow-md transition-colors flex items-center">
              <DeleteOutlined className="mr-1" />
              Thùng rác
            </Button>
          </Link>
        </div>
      </div>
      <div className="max-w-4xl">
        <Table
          columns={columns}
          dataSource={dataSource ? dataSource : []}
          loading={isLoading}
          pagination={{ pageSize: 10, className: "my-5" }}
        />
      </div>

      <Modal
        title="Chi tiết bộ sưu tập"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedCollection && (
          <div>
            <div className="mb-4 ">
              <Text strong>Tên bộ sưu tập:</Text> {selectedCollection.ten}
            </div>
            <div className="mb-4">
              {/* <Text strong>Ảnh bộ sưu tập:</Text> */}
              <Image src={selectedCollection.duong_dan_anh} alt="Ảnh bộ sưu tập" width={100} />
            </div>
            <Title level={4}>Sản phẩm trong bộ sưu tập</Title>
            <Table
              columns={[
                {
                  title: 'Tên sản phẩm',
                  dataIndex: 'ten_san_pham',
                  key: 'ten_san_pham',
                  render: (text, record) => (
                    <a className="text-black" 
                     onClick={() => showProductDetails(record)}>{text}</a>
                  ),
                },
                {
                  title: 'Ảnh sản phẩm',
                  dataIndex: 'anh_san_pham',
                  key: 'anh_san_pham',
                  render: (anh_san_pham: string) => (
                    <Image src={anh_san_pham} alt="Ảnh sản phẩm" width={100} />
                  ),
                },
              ]}
              dataSource={selectedCollection.san_phams}
              rowKey="id"
              pagination={false}
            />
          </div>
        )}
      </Modal>
      <Modal
        title="Chi tiết sản phẩm"
        visible={isProductModalVisible}
        onCancel={() => setIsProductModalVisible(false)}
        footer={null}
      >
        {isProductModalVisible && selectedProduct && (
          <Detail item={selectedProduct} />
        )}
      </Modal>
    </main>
  );
};

export default TagsAdmin;
