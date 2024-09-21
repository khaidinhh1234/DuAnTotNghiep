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

interface PromotionType {
  key: React.Key;
  ten_khuyen_mai: string;
  loai_khuyen_mai: string;
  gia_tri: number | string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  ma_code: string;
  trang_thai: string;
  dieu_kien_ap_dung: number;
  so_luot_su_dung: number;
  gioi_han_su_dung: number;
}

const promotions: PromotionType[] = [
  {
    key: "1",
    ten_khuyen_mai: "Giảm giá 10% cho đơn hàng trên 500k",
    loai_khuyen_mai: "phần trăm",
    gia_tri: "10",
    ma_code: "ID123456",
    ngay_bat_dau: "2024-09-01",
    ngay_ket_thuc: "2024-09-30",
    trang_thai: "Đang hoạt động",
    dieu_kien_ap_dung: 500000,
    so_luot_su_dung: 15,
    gioi_han_su_dung: 100,
  },
  {
    key: "2",
    ten_khuyen_mai: "Giảm 200k cho đơn hàng từ 1 triệu",
    loai_khuyen_mai: "tiền ",
    gia_tri: 200000,
    ma_code: "ID123456456",
    ngay_bat_dau: "2024-08-01",
    ngay_ket_thuc: "2024-08-31",
    trang_thai: "Đã hết hạn",
    dieu_kien_ap_dung: 1000000,
    so_luot_su_dung: 50,
    gioi_han_su_dung: 50,
  },
  {
    key: "3",
    ten_khuyen_mai: "Giảm giá 15% cho đơn hàng trên 1 triệu",
    loai_khuyen_mai: "phần trăm",
    gia_tri: "15",
    ma_code: "ID123456789",
    ngay_bat_dau: "2024-10-01",
    ngay_ket_thuc: "2024-10-31",
    trang_thai: "Đang hoạt động",
    dieu_kien_ap_dung: 1000000,
    so_luot_su_dung: 25,
    gioi_han_su_dung: 75,
  },
  {
    key: "4",
    ten_khuyen_mai: "Giảm 50k cho đơn hàng từ 500k",
    loai_khuyen_mai: "tiền ",
    gia_tri: 50000,

    ma_code: "ID13456456",
    ngay_bat_dau: "2024-07-01",
    ngay_ket_thuc: "2024-07-31",
    trang_thai: "Đang hoạt động",
    dieu_kien_ap_dung: 500000,
    so_luot_su_dung: 60,
    gioi_han_su_dung: 100,
  },
  {
    key: "5",
    ten_khuyen_mai: "Giảm giá 5% cho tất cả sản phẩm",
    ma_code: "ID123456",
    loai_khuyen_mai: "phần trăm",
    gia_tri: "5",
    ngay_bat_dau: "2024-09-15",
    ngay_ket_thuc: "2024-09-30",
    trang_thai: "Đang hoạt động",
    dieu_kien_ap_dung: 0,
    so_luot_su_dung: 120,
    gioi_han_su_dung: 300,
  },
  {
    key: "6",
    ten_khuyen_mai: "Giảm 100k cho đơn hàng từ 700k",
    loai_khuyen_mai: "tiền",
    gia_tri: 100000,
    ma_code: "ID123456456",
    ngay_bat_dau: "2024-08-15",
    ngay_ket_thuc: "2024-09-15",
    trang_thai: "Đang hoạt động",
    dieu_kien_ap_dung: 700000,
    so_luot_su_dung: 80,
    gioi_han_su_dung: 150,
  },
  {
    key: "7",
    ten_khuyen_mai: "Tặng quà 50k cho đơn hàng từ 600k",
    loai_khuyen_mai: "phần trăm",
    gia_tri: 50000,
    ma_code: "ID123456789",
    ngay_bat_dau: "2024-08-01",
    ngay_ket_thuc: "2024-09-01",
    trang_thai: "Đang hoạt động",
    dieu_kien_ap_dung: 600000,
    so_luot_su_dung: 70,
    gioi_han_su_dung: 100,
  },
  {
    key: "8",
    ten_khuyen_mai: "Giảm giá 20% cho đơn hàng trên 2 triệu",
    loai_khuyen_mai: "phần trăm",
    gia_tri: "20",
    ma_code: "ID12566789",
    ngay_bat_dau: "2024-09-01",
    ngay_ket_thuc: "2024-10-01",
    trang_thai: "Đang hoạt động",
    dieu_kien_ap_dung: 2000000,
    so_luot_su_dung: 90,
    gioi_han_su_dung: 200,
  },
];

type DataIndex = keyof PromotionType;

const PromotionAdmin: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<DataIndex | "">("");
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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
      ...getColumnSearchProps("ten_khuyen_mai"), // Sử dụng tính năng tìm kiếm cho "Tên khuyến mãi"
      sorter: (a: any, b: any) =>
        a.ten_khuyen_mai.length - b.ten_khuyen_mai.length, // Sắp xếp theo độ dài tên khuyến mãi
      render: (record) => (
        <div>
          <h5>{record.ten_khuyen_mai}</h5>

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
      title: "Lượt sử dụng",
      key: "so_luot_su_dung",
      ...getColumnSearchProps("so_luot_su_dung"),

      width: "15%",
      render: (record) => (
        <>
          <span className="text-gray-600 text-md">
            {record.so_luot_su_dung} / {record.gioi_han_su_dung}
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
      key: "loai_khuyen_mai",
      width: "15%",
      render: (record) => (
        <Tag
          color={record.loai_khuyen_mai === "phần trăm" ? "#155799" : "#1cb5e0"}
          className="font-semibold px-2  rounded-lg"
        >
          {record.loai_khuyen_mai}
        </Tag>
      ),
    },
    {
      title: "Chi tiết khuyến mãi",

      key: "dieu_kien_ap_dung",
      width: "25%",
      ...getColumnSearchProps("dieu_kien_ap_dung"),
      sorter: (a: any, b: any) =>
        a.dieu_kien_ap_dung.length - b.dieu_kien_ap_dung.length,
      render: (record) => (
        <div>
          <h5>
            Mức giảm giá: {record.gia_tri.toLocaleString()}{" "}
            {typeof record.gia_tri === "number" ? "VND" : "%"}
            <br />
            {record.dieu_kien_ap_dung === 0
              ? "Áp dụng cho tất cả sản phẩm"
              : "   Giá trị đơn hàng tối thiểu  " +
                record.dieu_kien_ap_dung.toLocaleString() +
                " VND"}
            {/* :{record.dieu_kien_ap_dung.toLocaleString("vn-VN")}
            VND */}
          </h5>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      width: "10%",
      render: (trang_thai: string) => (
        <Tag
          color={trang_thai === "Đang hoạt động" ? "#00a854" : "#f04134"}
          className="font-semibold px-2  rounded-lg"
        >
          {trang_thai === "Đang hoạt động" ? (
            <CheckCircleOutlined />
          ) : (
            <CloseCircleOutlined />
          )}{" "}
          {trang_thai}
        </Tag>
      ),
    },

    {
      title: "Quản trị",
      key: "action",
      render: (_, record) => (
        <Space>
          {record.trang_thai === "Đang hoạt động" ? (
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
          ) : (
            <Button className="border bg-black rounded-lg hover:bg-white hover:shadow-black shadow-md hover:text-black text-white">
              Xem
            </Button>
          )}
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys);
    },
  };

  const products = [...promotions].reverse();
  function handleChange(_event: ChangeEvent<HTMLInputElement>): void {
    throw new Error("Function not implemented.");
  }

  function handleKeyDown(_event: any): void {
    throw new Error("Function not implemented.");
  }

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
          dataSource={promotions}
          onChange={handleTableChange}
          pagination={pagination}
          rowSelection={rowSelection}
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
