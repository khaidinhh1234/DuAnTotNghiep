import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
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
import instance from "@/configs/admin";
import Detail from "./detail/detail";

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
      const response = await instance.get("/makhuyenmai");

      return response.data;
    },
  });
  const vouchers = voucher?.data?.map((voucher: any, index: number) => ({
    index: index + 1,
    ...voucher,
  }));

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async ({ record, action }: any) => {
      if (action === "Tắt") {
        try {
          const response = await instance.post(
            `/makhuyenmai/huy-kich-hoat/${record.id}`,
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
            `/makhuyenmai/kich-hoat/${record.id}`,
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
    if (vouchers) {
      setFilteredData(vouchers);
    }
  }, [voucher]);

  // Hàm xử lý tìm kiếm
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if (value) {
      const filtered = vouchers?.filter(
        (item: PromotionType) =>
          // Tìm kiếm trong các trường mong muốn
          item.mo_ta.toLowerCase().includes((value as string).toLowerCase()) ||
          item.ma_code.toLowerCase().includes((value as string).toLowerCase())
      ); // Bạn có thể thêm các trường khác nếu cần

      setFilteredData(filtered);
    } else {
      setFilteredData(vouchers);
    }
  };

  const [searchedColumn, setSearchedColumn] = useState<DataIndex | "">("");

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

  const columns: TableColumnsType<PromotionType> = [
    {
      title: "STT",

      // key: "key",
      // width: "5%",
      className: "text-center",
      render: (index) => (
        <span className="text-gray-600 text-md">{index.index}</span>
      ),
    },
    {
      title: "Khuyến Mãi",

      key: "gia_tri",
      width: "40%",
      className: "text-center",
      render: (record) => <Detail record={record} />,
    },

    {
      title: "Số lượng",
      key: "so_luong",

      sorter: (a: any, b: any) => a.so_luong_da_su_dung - b.so_luong_da_su_dung,

      // width: "25%",
      render: (record) => (
        <>
          <span
            className={` font-medium text-lg ${record.so_luong - record.so_luong_da_su_dung >= 20 ? "text-gray-600" : record.so_luong - record.so_luong_da_su_dung >= 5 ? "text-yellow-600" : "text-red-600"}`}
          >
            {record.so_luong_da_su_dung} / {record.so_luong}
          </span>
        </>
      ),
    },

    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      // width: "30%",
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
          rowKey="key"
          pagination={{ pageSize: 10, className: "my-5" }}
          loading={isLoading}
        />
      </div>
    </main>
  );
};

export default VoucherAdmin;
