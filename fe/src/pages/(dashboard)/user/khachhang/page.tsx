import { SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import {
  Button,
  Image,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import React, { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { Alert, Flex, Spin } from "antd";
import instance from "@/configs/admin";
const contentStyle: React.CSSProperties = {
  padding: 50,
  background: "rgba(0, 0, 0, 0.05)",
  borderRadius: 4,
};

const content = <div style={contentStyle} />;

interface DataType {
  key: React.Key;
  anh_nguoi_dung: string;
  ho: string;
  ten: string;
  email: string;
  so_dien_thoai: string;
  dia_chi: string;
  gioi_tinh: string;
  ngay_sinh: Date;
  vai_tros: string;
}

type DataIndex = keyof DataType;

const UsersAdminkhachhang: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["productskey"],
    queryFn: async () => {
      const res = await instance.get("/taikhoan");
      return res.data;
    },
  });
  // console.log(data);
  const user = data?.data
    ?.filter((item: any) =>
      item?.vai_tros?.some((item: any) => item?.ten_vai_tro === "Khách hàng")
    )
    .map((item: any, index: number) => {
      // console.log(item);
      return {
        ...item,
        key: item.id,
        index: index,
      };
    });
  // console.log(user);
  const mutate = useMutation({
    mutationFn: async (id: string) => {
      try {
        const res = await instance.delete(`/taikhoan/${id}`);
        message.open({
          type: "success",
          content: "Xóa thành công",
        });
        return res.data;
      } catch (error) {
        message.open({
          type: "error",
          content: "Xóa thất bại",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productskey"],
      });
    },
  });
  // const users = user.reverse();

  // const [searchText, setSearchText] = useState
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

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
        ?.toString()
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
      title: "STT",
      render: (record) => <span>{record.index + 1}</span>,
      key: "key",
      className: "pl-5",
    },
    {
      title: "Sản phẩm",
      render: (record) => (
        <div className="flex gap-5">
          <div>
            <Image
              src={
                record.anh_nguoi_dung
                  ? record.anh_nguoi_dung
                  : "https://cdn.pixabay.com/animation/2023/10/10/13/27/13-27-45-28_512.gif"
              }
              alt=""
              className="w-20 h-20 object-cover rounded-lg p-2 border"
            />
          </div>
          <div className="pt-4 text-start">
            <p>
              {record.ho} {record.ten}
            </p>
            <p>{record.email}</p>
          </div>
        </div>
      ),

      className: "mx-auto",
      width: "30%",
      key: "anh_nguoi_dung",
    },
    // {
    //   title: "Tên",
    //   dataIndex: "ten",
    //   key: "ten",
    //   width: "5%",
    //   ...getColumnSearchProps("ten"),
    //   sorter: (a: any, b: any) => a.ten.length - b.ten.length,
    //   render: (text) => (text ? text : "Chưa có dữ liệu"),
    // },
    // {
    //   title: "Họ",
    //   dataIndex: "ho",
    //   key: "ho",
    //   width: "5%",
    //   ...getColumnSearchProps("ho"),
    //   sorter: (a: any, b: any) => a.ho.length - b.ho.length,
    //   render: (text) => (text ? text : "Chưa có dữ liệu"),
    // },
    // {
    //   title: "Email",
    //   dataIndex: "email",
    //   key: "email",
    //   width: "20%",
    //   ...getColumnSearchProps("email"),
    //   sorter: (a: any, b: any) => a.email.length - b.email.length,
    //   render: (text) => (text ? text : "Chưa có dữ liệu"),
    // },
    {
      title: "Số điện thoại",
      dataIndex: "so_dien_thoai",
      key: "so_dien_thoai",
      width: "15%",
      ...getColumnSearchProps("so_dien_thoai"),
      sorter: (a: any, b: any) => a.so_dien_thoai - b.so_dien_thoai,
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "dia_chi",
      key: "dia_chi",
      width: "20%",
      ...getColumnSearchProps("dia_chi"),
      sorter: (a: any, b: any) =>
        (a.dia_chi?.length || 0) - (b.dia_chi?.length || 0),
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    // {
    //   title: "Giới tính",
    //   dataIndex: "gioi_tinh",
    //   key: "gioi_tinh",
    //   width: "10%",
    //   // ...getColumnSearchProps("gioi_tinh"),
    //   sorter: (a: any, b: any) => (a.gioi_tinh || 0) - (b.gioi_tinh || 0),
    //   render: (text) => (text == 1 ? "Nam" : text == 2 ? "Nữ" : "Khác"),
    // },
    // {
    //   title: "Ngày sinh",
    //   dataIndex: "ngay_sinh",
    //   key: "ngay_sinh",
    //   width: "15%",
    //   ...getColumnSearchProps("ngay_sinh"),
    //   sorter: (a: any, b: any) => (a.ngay_sinh || 0) - (b.ngay_sinh || 0),
    //   render: (text) => (text ? text : "Chưa có dữ liệu"),
    // },

    {
      title: "Quản trị",
      key: "action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Chuyển vào thùng rác"
            description="Bạn có chắc chắn muốn xóa không?"
            okText="Có"
            cancelText="Không"
            onConfirm={() => {
              mutate.mutate(String(record?.key));
            }}
          >
            <Button className="bg-gradient-to-l from-red-400  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300">
              Chặn
            </Button>
          </Popconfirm>
          <Link to={`/admin/users/khachhang/edit/${record.key}`}>
            <Button className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold">
              Chỉnh sửa
            </Button>
          </Link>
          <Link to={`show/${record.key}`}>
            <Button className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold">
              xem
            </Button>
          </Link>
        </Space>
      ),
    },
  ];
  const [searchText, setSearchText] = useState("");

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchText(e.target.value);
  // };

  // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  //   if (e.key === "Enter") {
  //     console.log(searchText);
  //     // Thực hiện hành động tìm kiếm tại đây
  //   }
  // };

  // const products = [...data].reverse();
  isError && (
    <div>
      {" "}
      <Spin tip="Loading" size="large">
        {content}
      </Spin>
    </div>
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className=" md:text-base">
          Quản trị / <span className="font-semibold px-px=">Tài khoản </span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className=" font-semibold md:text-3xl">Tài khoản Khách hàng</h1>
        <div className="flex">
          {" "}
          <Link to="/admin/users/khachhang/add" className="mr-1">
            <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              <i className="fa-sharp fa-solid fa-plus text-2xl"></i>
              Thêm
            </Button>
          </Link>
          <Link to="/admin/users/khachhang/remote">
            <Button className="bg-gradient-to-r  from-red-500 to-orange-500 text-white rounded-lg py-1 hover:bg-red-600 shadow-md transition-colors flex items-center">
              {/* <DeleteOutlined className="mr-1" /> */}
              Chặn
            </Button>
          </Link>
        </div>
      </div>
      <div className=" ">
        <Table
          columns={columns}
          dataSource={user}
          loading={isLoading}
          pagination={{ pageSize: 10, className: "my-5" }}
        />
      </div>
    </main>
  );
};

export default UsersAdminkhachhang;
