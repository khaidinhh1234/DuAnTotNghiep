import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import {
  Button,
  Input,
  message,
  Popconfirm,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  chi_tieu_toi_thieu: number;
}

type DataIndex = keyof PromotionType;

const VoucherAdmin: React.FC = () => {
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
  // console.log(voucher);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async ({ record, action }: any) => {
      if (action === "Tắt") {
        try {
          const response = await instance.post(
            `/admin/makhuyenmai/huy-kich-hoat/${record.id}`,
            { ...record, trang_thai: 0 }
          );
          message.open({
            type: "success",
            content: "Tắt khuyến mãi thành công",
          });
          return response.data;
        } catch (error) {
          message.open({
            type: "error",
            content: "Tắt khuyến mãi không thành công",
          });
        }
      }
      if (action === "Bật") {
        try {
          const response = await instance.post(
            `/admin/makhuyenmai/kich-hoat/${record.id}`,
            { ...record, trang_thai: 1 }
          );
          message.open({
            type: "success",
            content: "Bật khuyến mãi thành công",
          });
          return response.data;
        } catch (error) {
          message.open({
            type: "error",
            content: "Bật khuyến mãi không thành công",
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["VOUCHER_KEY"] });
    },
  });
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<PromotionType[]>([]);

  // Cập nhật dữ liệu khi nhận được từ API
  useEffect(() => {
    if (voucher?.data) {
      setFilteredData(voucher?.data);
    }
  }, [voucher]);

  // Hàm xử lý tìm kiếm
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    // console.log(value);
    if (value) {
      const filtered = voucher?.data?.filter(
        (item: PromotionType) =>
          // Tìm kiếm trong các trường mong muốn
          item.mo_ta.toLowerCase().includes((value as string).toLowerCase()) ||
          item.ma_code
            .toLowerCase()
            .includes((value as string).toLowerCase()) ||
          (item.hang_thanh_viens &&
            Array.isArray(item.hang_thanh_viens) &&
            item.hang_thanh_viens
              .map((hang: any) => hang.toLowerCase())
              .join(", ")
              .includes((value as string).toLowerCase()))
      ); // Bạn có thể thêm các trường khác nếu cần

      setFilteredData(filtered);
    } else {
      setFilteredData(voucher?.data);
    }
  };

  const [searchedColumn, setSearchedColumn] = useState<DataIndex | "">("");

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
            Tìm kiếm
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
      key: "ma_code",
      width: "18%",
      ...getColumnSearchProps("mo_ta"), // Sử dụng tính năng tìm kiếm cho "mo_ta"
      onFilter: (value: boolean | React.Key, record: PromotionType) =>
        record.mo_ta.toLowerCase().includes(String(value).toLowerCase()) ||
        record.ma_code.toLowerCase().includes(String(value).toLowerCase()),
      sorter: (a: any, b: any) => a.ma_code.localeCompare(b.ma_code),
      render: (record) => (
        <div>
          <h5>{record.mo_ta}</h5>

          <span className="text-gray-600 text-sm">Mã: {record.ma_code}</span>
        </div>
      ),
    },
    {
      title: "Thời gian thu thập - Thời gian quy đổi",
      key: "ngay_bat_dau",
      width: "20%",
      ...getColumnSearchProps("ngay_bat_dau"),
      onFilter: (value: boolean | React.Key, record: any) =>
        new Date(record.ngay_bat_dau)
          .toLocaleDateString("vi-VN")
          .includes(String(value)) ||
        new Date(record.ngay_ket_thuc)
          .toLocaleDateString("vi-VN")
          .includes(String(value)), // Tìm kiếm trong cả ngay_bat_dau và ngay_ket_thuc
      sorter: (a: any, b: any) =>
        new Date(a.ngay_bat_dau).getTime() - new Date(b.ngay_bat_dau).getTime(), // Sắp xếp theo thời gian
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
      onFilter: (value: boolean | React.Key, record: any) =>
        record.so_luong.toString().includes(String(value)) ||
        record.so_luong_da_su_dung.toString().includes(String(value)), // Tìm kiếm trong cả so_luong và so_luong_da_su_dung
      sorter: (a: any, b: any) => a.so_luong - b.so_luong, // Sắp xếp theo số

      width: "15%",
      render: (record) => (
        <>
          <span
            className={` font-medium text-md ${record.so_luong - record.so_luong_da_su_dung >= 20 ? "text-gray-600" : record.so_luong - record.so_luong_da_su_dung >= 5 ? "text-yellow-600" : "text-red-600"}`}
          >
            {record.so_luong_da_su_dung} / {record.so_luong}
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
      sorter: (a: any, b: any) => a.loai.localeCompare(b.loai),
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
      onFilter: (value: boolean | React.Key, record: any) =>
        record.hang_thanh_viens
          .map((hang: any) =>
            hang.ten_hang_thanh_vien === "Vàng"
              ? "Vàng"
              : hang.ten_hang_thanh_vien === "Bạc"
                ? "Bạc"
                : "Đồng"
          )
          .join(", ")
          .includes(String(value)), // Tìm kiếm trong cả hang_thanh_viens
      sorter: (a: any, b: any) =>
        a.hang_thanh_viens.length - b.hang_thanh_viens.length,
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

      key: " chi_tieu_toi_thieu",
      width: "25%",
      ...getColumnSearchProps("chi_tieu_toi_thieu"),
      onFilter: (value: boolean | React.Key, record: any) =>
        record.chi_tieu_toi_thieu
          .map((chi_tieu_toi_thieu: any) =>
            chi_tieu_toi_thieu === 0
              ? "Áp dụng cho tất cả sản phẩm"
              : "   Giá trị đơn hàng tối thiểu  " +
                chi_tieu_toi_thieu.toLocaleString() +
                " VNĐ"
          )
          .join(", ")
          .includes(String(value)), // Tìm kiếm trong cả chi_tieu_toi_thieu
      sorter: (a: any, b: any) => a.chi_tieu_toi_thieu - b.chi_tieu_toi_thieu,

      render: (record) => (
        // console.log(record),
        <div>
          <h5>
            Mức giảm giá: {record.giam_gia.toLocaleString()}{" "}
            {record.loai === "tien_mat" ? "VNĐ" : "%"}
            <br />
            {record.chi_tieu_toi_thieu === 0
              ? "Áp dụng cho tất cả sản phẩm"
              : "   Giá trị đơn hàng tối thiểu  " +
                record.chi_tieu_toi_thieu.toLocaleString() +
                " VNĐ"}
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
      sorter: (a: any, b: any) => a.trang_thai - b.trang_thai,
      onFilter: (value: boolean | React.Key, record: any) =>
        record.trang_thai
          .map((trang_thai: any) =>
            trang_thai === 1
              ? "Đang hoạt động"
              : trang_thai === 0
                ? "Tạm ngừng"
                : "Hết hạn"
          )
          .join(", ")
          .includes(String(value)), // Tìm kiếm trong cả trang_thai
      render: (trang_thai: number | string) => (
        <Tag
          color={
            trang_thai == 1
              ? "#00a854"
              : trang_thai == 0
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
              : trang_thai == 0
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
                  title=" Bạn có muốn tắt không?"
                  description="Bạn có chắc chắn muốn tắt không?"
                  okText="Có"
                  onConfirm={() => {
                    mutate({ record, action: "Tắt" });
                  }}
                  cancelText="Không"
                >
                  <Button className="bg-gradient-to-l from-red-500  to-red-600 hover:from-red-500 hover:to-red-700  text-white font-bold border border-red-300">
                    Tắt
                  </Button>
                </Popconfirm>
                <Link to={`/admin/vouchers/edit/${record.id}`}>
                  {" "}
                  <Button className=" bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold">
                    Cập nhật
                  </Button>{" "}
                </Link>
              </>
            )}
            {record.trang_thai == 0 && (
              <>
                <Button
                  onClick={() => mutate({ record, action: "Bật" })}
                  className=" bg-gradient-to-l from-green-700 to-green-600 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold"
                >
                  Bật
                </Button>
                <Link to={`/admin/vouchers/show/${record.id}`}>
                  {" "}
                  <Button className=" bg-gradient-to-l from-sky-600 to-cyan-600 text-white hover:from-sky-500 hover:to-cyan-500 border border-green-300 font-bold">
                    Xem
                  </Button>{" "}
                </Link>
              </>
            )}
            {record.trang_thai == 2 && (
              <>
                <Link to={`/admin/vouchers/show/${record.id}`}>
                  <Button className=" bg-gradient-to-l from-sky-600 to-cyan-600 text-white hover:from-sky-500 hover:to-cyan-500 border border-green-300 font-bold">
                    Xem
                  </Button>{" "}
                </Link>
              </>
            )}
          </>
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
            <Button className="bg-gradient-to-r  from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              <i className="fa-sharp fa-solid fa-plus text-2xl"></i>
              Thêm khuyến mãi
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
            onChange={handleSearchChange}
            style={{ marginBottom: 16, maxWidth: 300 }}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filteredData}
          onChange={handleTableChange}
          rowKey="key"
          loading={isLoading}
        />
      </div>
    </main>
  );
};

export default VoucherAdmin;
