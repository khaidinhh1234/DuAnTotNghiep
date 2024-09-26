import instance from "@/configs/axios";
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
  vai_tros: { ten_cai_tro: string }[];
}

type DataIndex = keyof DataType;

const UsersAdminNhanvien: React.FC = () => {
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (id: string) => {
      try {
        const res = await instance.delete(`/admin/taikhoan/${id}`);
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
  const { data, isLoading, isError } = useQuery({
    queryKey: ["productskey"],
    queryFn: async () => {
      const res = await instance.get("/admin/taikhoan");
      return res.data;
    },
  });

  const user = data?.data
    ?.filter((item: any) =>
      item?.vai_tros.some((role: any) => role.ten_vai_tro !== "member")
    )
    .map((item: any, index: string) => ({
      ...item,
      key: item.id,
      index: index,
    }));

  // console.log(user);

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
      title: "STT",
      render: (record) => <span>{record.index + 1}</span>,
      key: "key",
      className: "pl-5",
    },
    {
      title: "Ảnh người dùng",
      render: (record) =>
        record.anh_nguoi_dung ? (
          <Image
            src={record.anh_nguoi_dung}
            alt=""
            className="w-20 h-20 object-cover rounded-lg p-2 border"
          />
        ) : (
          <img
            src="https://cdn.pixabay.com/animation/2023/10/10/13/27/13-27-45-28_512.gif"
            alt=""
            className="w-20 h-20 object-cover rounded-lg p-2 border"
          />
        ),
      className: "pl-10",
      width: "15%",
      key: "anh_nguoi_dung",
    },
    {
      title: "Tên",
      dataIndex: "ten",
      key: "ten",
      width: "5%",
      ...getColumnSearchProps("ten"),
      sorter: (a: any, b: any) => a.ten.length - b.ten.length,
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Họ",
      dataIndex: "ho",
      key: "ho",
      width: "5%",
      ...getColumnSearchProps("ho"),
      sorter: (a: any, b: any) => a.ho.length - b.ho.length,
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
      ...getColumnSearchProps("email"),
      sorter: (a: any, b: any) => a.email.length - b.email.length,
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "so_dien_thoai",
      key: "so_dien_thoai",
      width: "15%",
      ...getColumnSearchProps("so_dien_thoai"),
      sorter: (a: any, b: any) =>
        a.so_dien_thoai.length - b.so_dien_thoai.length,
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "dia_chi",
      key: "dia_chi",
      width: "20%",
      ...getColumnSearchProps("dia_chi"),
      sorter: (a: any, b: any) => a.dia_chi.length - b.dia_chi.length,
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Giới tính",
      dataIndex: "gioi_tinh",
      key: "gioi_tinh",
      width: "10%",
      // ...getColumnSearchProps("gioi_tinh"),
      sorter: (a: any, b: any) => (a.gioi_tinh || 0) - (b.gioi_tinh || 0),
      render: (text) => (text == 1 ? "Nam" : text == 2 ? "Nữ" : "Khác"),
    },
    {
      title: "Ngày sinh",
      dataIndex: "ngay_sinh",
      key: "ngay_sinh",
      width: "15%",
      ...getColumnSearchProps("ngay_sinh"),
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Vai trò",
      render: (_, record) =>
        Array.isArray(record.vai_tros) &&
        record.vai_tros.map((item: any) => (
          <Tag
            color="#36D1DC"
            className="rounded-xl font-bold my-1 w-28 text-center mx-auto truncate"
            key={item.key}
          >
            {item.ten_vai_tro}
          </Tag>
        )),
      key: "vai_tros",
      width: "30%",
      sorter: (a: any, b: any) => a.vai_tros.length - b.vai_tros.length,
    },
    {
      title: "Quản trị",
      key: "action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Chặn tài khoản này?"
            description="Bạn có chắc chắn muốn chặn không?"
            okText="Có"
            cancelText="Không"
            className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white"
            onConfirm={() => {
              mutate.mutate(record?.key.toString());
            }}
          >
            <Button className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
              Chặn
            </Button>
          </Popconfirm>
          <Link to={`/admin/users/nhanvien/edit/${record.key}`}>
            <Button className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
              Chỉnh sửa
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
  isError && <div>Đã xảy ra lỗi</div>;
  isLoading && <div>Đang tải dữ liệu...</div>;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className=" md:text-base">
          Quản trị / <span className="font-semibold px-px=">Tài khoản </span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className=" font-semibold md:text-3xl">Tài khoản Nhân Viên</h1>
        <div className="flex">
          {" "}
          <Link to="/admin/users/nhanvien/add" className="mr-1">
            <Button className="ml-auto bg-black text-white rounded-lg  py-1">
              <i className="fa-sharp fa-solid fa-plus text-2xl"></i>
              Thêm
            </Button>
          </Link>
          {/* <Link to="/admin/users/nhanvien/remote">
            <Button className="ml-auto bg-black text-white rounded-lg  py-1">
          
              Chặn
            </Button>
          </Link> */}
        </div>
      </div>
      <div className=" ">
        <Table columns={columns} dataSource={user} />
      </div>
    </main>
  );
};

export default UsersAdminNhanvien;
