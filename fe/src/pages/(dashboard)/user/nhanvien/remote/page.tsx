import instance from "@/configs/admin";
import { SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Image, Input, message, Space, Table } from "antd";
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
  vai_tros: string;
}

type DataIndex = keyof DataType;

// const data: DataType[] = [
//   {
//     key: "1",
//     anh_nguoi_dung: "https://picsum.photos/id/10/300/300",
//     ho: "Nguyen",
//     ten: "Van A",
//     email: "vana@example.com",
//     so_dien_thoai: "0123456789",
//     dia_chi: "123 Main St",
//     gioi_tinh: "Nam",
//     ngay_sinh: "1990-01-01",
//     vai_tros: "Admin",
//   },
//   {
//     key: "2",
//     anh_nguoi_dung: "https://picsum.photos/id/11/300/300",
//     ho: "Tran",
//     ten: "Thi B",
//     email: "thib@example.com",
//     so_dien_thoai: "0987654321",
//     dia_chi: "456 Elm St",
//     gioi_tinh: "Nu",
//     ngay_sinh: "1992-02-02",
//     vai_tros: "User",
//   },
//   {
//     key: "3",
//     anh_nguoi_dung: "https://picsum.photos/id/12/300/300",
//     ho: "Le",
//     ten: "Van C",
//     email: "vanc@example.com",
//     so_dien_thoai: "0112233445",
//     dia_chi: "789 Oak St",
//     gioi_tinh: "Nam",
//     ngay_sinh: "1988-03-03",
//     vai_tros: "Moderator",
//   },
// ];

const UsersRemoteNhanvien: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["productskey"],
    queryFn: async () => {
      const res = await instance.get("/taikhoan/thung-rac");
      return res.data;
    },
  });
  console.log(data);
  const user = data?.data
    ?.filter((item: any) =>
      item?.vai_tros?.some((item: any) => item?.ten_vai_tro !== "Khách hàng")
    )
    .map((item: any, index: number) => {
      // console.log(item);
      return {
        ...item,
        key: index + 1,
        index: index,
      };
    });
  console.log(user);
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: async (id: number) => {
      try {
        const res = await instance.post(`/taikhoan/thung-rac/${id}`);
        message.open({
          type: "success",
          content: "Khôi phục thành công",
        });
        return res.data;
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productskey"],
      });
    },
  });
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
      dataIndex: "key",
      key: "key",
      className: "pl-5",
    },
    {
      title: "Thông tin",
      key: "thong_tin",
      width: "25%",
      render: (record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid white",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: "#f0faff",
            transition: "background-color 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#AABBCC";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#f0faff";
          }}
        >
          {record.anh_nguoi_dung ? (
            <img
              src={record.anh_nguoi_dung}
              alt="Avatar"
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
          ) : (
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "70%",
                backgroundColor: "#ccc",
                marginRight: "10px",
              }}
            />
          )}
          <div>
            <div style={{ fontWeight: "bold" }}>
              {`${record.ho} ${record.ten}` || "Chưa có dữ liệu"}
            </div>
            <div
              style={{
                marginTop: "5px",
                fontSize: "14px",
                color: "#333",
              }}
            >
              {record.email ? record.email : "Chưa có dữ liệu"}
            </div>
          </div>
        </div>
      ),
    },

    {
      title: "Số điện thoại",
      dataIndex: "so_dien_thoai",
      key: "so_dien_thoai",
      width: "10%",
      // ...getColumnSearchProps("so_dien_thoai"),
      sorter: (a: any, b: any) =>
        (a.so_dien_thoai || 0) - (b.so_dien_thoai || 0),
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "dia_chi",
      key: "dia_chi",
      width: "20%",
      // ...getColumnSearchProps("dia_chi"),
      sorter: (a: any, b: any) => (a.dia_chi || 0) - (b.dia_chi || 0),
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Giới tính",
      dataIndex: "gioi_tinh",
      key: "gioi_tinh",
      width: "10%",
      // ...getColumnSearchProps("gioi_tinh"),
      sorter: (a: any, b: any) => (a.gioi_tinh || 0) - (b.gioi_tinh || 0),
      render: (text) => (text == "1" ? "Nam" : text == "2" ? "Nữ" : "Khác"),
    },

    {
      title: "Quản trị",
      key: "action",
      render: (_, record: any) => (
        <Space>
          <Button
            className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold"
            onClick={() => mutate.mutate(Number(record?.id))}
          >
            Khôi phục
          </Button>
        </Space>
      ),
    },
  ];
  const [searchText, setSearchText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Thực hiện hành động tìm kiếm tại đây
    }
  };

  isError && <div>Đã xảy ra lỗi</div>;
  isLoading && <div>Đang tải dữ liệu...</div>;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className=" md:text-base">
          Quản trị / Tài khoản /
          <span className="font-semibold px-px="> Chặn tài khoản</span>{" "}
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className=" font-semibold md:text-3xl">Chặn tài khoản nhân viên</h1>
        <div>
          {" "}
          <Link to="/admin/users" className="mr-1">
            <Button className="ml-auto bg-black text-white rounded-lg  py-1">
              <i className="fa-sharp fa-solid fa-plus text-2xl"></i>
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      <div className=" ">
        <Table
          columns={columns}
          dataSource={user}
          pagination={{ pageSize: 10, className: "my-5" }}
        />
      </div>
    </main>
  );
};

export default UsersRemoteNhanvien;
