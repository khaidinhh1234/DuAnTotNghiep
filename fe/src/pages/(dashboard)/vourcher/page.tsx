import React, { ChangeEvent, useRef, useState } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Popconfirm, Space, Table, Tag } from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/axios";

interface PromotionType {
  key: React.Key;
  mo_ta: string;
  so_luong: number;
  loai_khuyen_mai: string;
  gia_tri: number | string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  ma_code: string;
  trang_thai: string;
  hang_thanh_viens: string;
  tong_giam_gia_toi_da: string;
  so_luot_su_dung: number;
  gioi_han_su_dung: number;
}

type DataIndex = keyof PromotionType;

const PromotionAdmin: React.FC = () => {
  const {
    data: voucher,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["VOUCHER_KEY"],
    queryFn: async () => {
      const response = await instance.get("/admin/makhuyenmai");

      return response.data;
    },
  });
  console.log(voucher);
  const [searchedColumn, setSearchedColumn] = useState<DataIndex | "">("");
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  // const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<PromotionType> => ({
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

  const columns: TableColumnsType<PromotionType> = [
    {
      title: "Khuyến mãi",
      key: "khuyen_mai",
      width: "18%",
      ...getColumnSearchProps("mo_ta"), // Sử dụng tính năng tìm kiếm cho "Tên khuyến mãi"
      sorter: (a: any, b: any) => a.mo_ta.length - b.mo_ta.length, // Sắp xếp theo độ dài tên khuyến mãi
      render: (record) => (
        <div>
          <h5>{record.mo_ta}</h5>

          <span className="text-gray-600 text-sm">Mã: {record.ma_code}</span>
        </div>
      ),
    },
    {
      title: "	Thời gian thu thập - Thời gian quy đổi",
      key: "ngay_bat_dau",
      width: "20%",
      ...getColumnSearchProps("ngay_bat_dau"),
      sorter: (a: any, b: any) => a.ngay_bat_dau - b.ngay_bat_dau,
      render: (record) => (
        <>
          <span>
            Từ: {new Date(record.ngay_bat_dau).toLocaleDateString("vi-VN")}
          </span>{" "}
          <br />
          Đến:{" "}
          <span>
            {new Date(record.ngay_ket_thuc).toLocaleDateString("vi-VN")}
          </span>
        </>
      ),
    },
    {
      title: "Số lượng",
      key: "so_luong",
      ...getColumnSearchProps("so_luong"),

      width: "15%",
      render: (record) => (
        <>
          <span
            className={` font-medium text-md ${record.so_luong > 20 ? "text-gray-600" : record.so_luong > 5 ? "text-yellow-600" : "text-red-600"}`}
          >
            {record.so_luong} Lượt
          </span>
        </>
      ),
    },

    // {
    //   title: "Giá trị",
    //   dataIndex: "gia_tri",
    //   key: "gia_tri",
    //   width: "15%",
    //   render: (gia_tri: number | string) =>
    //     typeof gia_tri === "number"
    //       ? `${gia_tri.toLocaleString()} VND`
    //       : `${gia_tri}%`,
    //   sorter: (a: any, b: any) => a.gia_tri - b.gia_tri,
    // },
    {
      title: "Loại khuyến mãi",
      // dataIndex: "loai_khuyen_mai",
      key: "loai",
      width: "15%",
      render: (record) => (
        <Tag
          color={record.loai === "phần trăm" ? "#1cb5e0" : "#155799"}
          className="font-semibold px-2  rounded-lg"
        >
          {record.loai === "phan_tram" ? "phần trăm" : "tiền"}
        </Tag>
      ),
    },
    {
      title: "Hạng thành viên",
      key: "hang_thanh_viens",
      ...getColumnSearchProps("hang_thanh_viens"),

      width: "15%",
      render: (record) => (
        <>
          <span className="text-gray-600 text-md">
            {record.hang_thanh_viens
              .map((hang: any) =>
                hang.ten_hang_thanh_vien === "Vàng"
                  ? "Vàng"
                  : hang.ten_hang_thanh_vien === "Bạc"
                    ? "Bạc"
                    : "Đồng"
              )
              .join(", ")}
          </span>
        </>
      ),
    },
    {
      title: "Chi tiết khuyến mãi",

      key: "gioi_han_su_dung",
      width: "25%",
      ...getColumnSearchProps("gioi_han_su_dung"),
      sorter: (a: any, b: any) =>
        a.chi_tieu_toi_thieu.length - b.chi_tieu_toi_thieu.length,
      render: (record) => (
        console.log(record),
        (
          <div>
            <h5>
              Mức giảm giá: {record.giam_gia.toLocaleString()}{" "}
              {record.loai === "tien_mat" ? "VND" : "%"}
              <br />
              {record.chi_tieu_toi_thieu === 0
                ? "Áp dụng cho tất cả sản phẩm"
                : "   Giá trị đơn hàng tối thiểu  " +
                  (record.chi_tieu_toi_thieu
                    ? record.chi_tieu_toi_thieu.toLocaleString()
                    : "") +
                  " VND"}
              {/* :{record.dieu_kien_ap_dung.toLocaleString("vn-VN")}
            VND */}
            </h5>
          </div>
        )
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      width: "10%",
      render: (trang_thai: number | string) => (
        <Tag
          color={
            trang_thai == 1
              ? "#00a854"
              : trang_thai == 2
                ? "#f0cb35"
                : "#f04134"
          }
          className="font-semibold px-2  rounded-lg "
        >
          {trang_thai == 1 ? (
            <CheckCircleOutlined />
          ) : trang_thai == "" ? (
            <CloseCircleOutlined />
          ) : (
            <CloseCircleOutlined />
          )}
          <span>
            {" "}
            {trang_thai == 1
              ? "hoạt động"
              : trang_thai == 2
                ? "Tạm ngừng"
                : "hết hạn "}
          </span>
        </Tag>
      ),
    },

    {
      title: "Quản trị",
      key: "action",
      render: (_, record: any) => (
        <Space>
          {/* {record.trang_thai === "Đang hoạt động" ? ( */}
          <>
            {record.trang_thai == 1 && (
              <>
                <Popconfirm
                  title="Chuyển vào thùng rác"
                  description="Bạn có chắc chắn muốn tắt không?"
                  okText="Có"
                  cancelText="Không"
                >
                  <Button className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
                    Tắt
                  </Button>
                </Popconfirm>
                <Button className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
                  Cập nhật
                </Button>{" "}
              </>
            )}
            {record.trang_thai == 2 && (
              <>
                <Button className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
                  Bật
                </Button>
                <Button className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
                  Xem
                </Button>{" "}
              </>
            )}
            {record.trang_thai == 0 && (
              <>
                <Button className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
                  Xem
                </Button>{" "}
              </>
            )}
          </>
        </Space>
      ),
    },
  ];

  // const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.checked) {
  //     setSelectedRowKeys(promotions.map(p => p.key));
  //   } else {
  //     setSelectedRowKeys([]);
  //   }
  // };

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: (selectedKeys: React.Key[]) => {
  //     setSelectedRowKeys(selectedKeys);
  //   },
  // };

  // const products = [...promotions].reverse();
  function handleChange(_event: ChangeEvent<HTMLInputElement>): void {
    throw new Error("Function not implemented.");
  }

  function handleKeyDown(_event: any): void {
    throw new Error("Function not implemented.");
  }
  isError && <div>Error...</div>;
  isLoading && <div>Loading...</div>;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold px-px">Khuyến mãi</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Khuyến mãi</h1>

        <div className="flex gap-2">
          <Link to="/admin/add-vocher">
            <Button className="bg-blue-500 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              <i className="fa-sharp fa-solid fa-plus text-2xl"></i>
              Thêm khuyến mãi
            </Button>
          </Link>

          <Link to="remote">
            <Button className="bg-red-500 text-white rounded-lg py-1 hover:bg-red-600 shadow-md transition-colors flex items-center">
              <DeleteOutlined className="mr-1" />
              Thùng rác
            </Button>
          </Link>
        </div>
      </div>

      <div>
        <div className="max-w-xs my-2">
          <Input
            placeholder="Tìm kiếm..."
            size="large"
            value={searchText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Table
          columns={columns}
          dataSource={voucher?.data}
          onChange={handleTableChange}
          // pagination={voucher?.data}
          rowKey="key"
          // title={() => (
          //   <Checkbox
          //     indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < promotions.length}
          //     onChange={handleSelectAllChange}
          //     checked={selectedRowKeys.length === promotions.length}
          //   >
          //     Chọn tất cả
          //   </Checkbox>
          // )}
        />
      </div>
    </main>
  );
};

export default PromotionAdmin;
