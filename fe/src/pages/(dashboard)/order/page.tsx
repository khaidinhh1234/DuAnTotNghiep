import { SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  InputRef,
  TableColumnsType,
  TableColumnType,
  TableProps,
} from "antd";
import {
  Button,
  Flex,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import Detail from "./detail";
import instance from "@/configs/admin";
type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

interface DataType {
  created_at: string | number | Date;
  id: number;
  user_id: number;
  ghi_chu: string;
  trang_thai_don_hang: string;
  phuong_thuc_thanh_toan: string;
  tong_tien_don_hang: string;
  ten_nguoi_dat_hang: string;
  so_dien_thoai_nguoi_dat_hang: string;
  dia_chi_nguoi_dat_hang: string;
  ma_giam_gia: string;
  so_tien_giam_gia: string;
  trang_thai_thanh_toan: string;
  duong_dan: string;
  trang_thai_van_chuyen: string;
}
const datas = [
  {
    value: "1",
    label: "Xác nhận đơn hàng",
  },
  {
    value: "2",
    label: "Hoàn tất đơn hàng",
  },
  {
    value: "3",
    label: "Hủy đơn hàng",
  },
];
type DataIndex = keyof any;
const OrderAdmin: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<DataIndex | "">("");
  const [searchText, setSearchText] = useState("");

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

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${String(dataIndex)}`}
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
  const columns: TableColumnsType<DataType> = [
    {
      title: "Mã Đơn hàng",
      dataIndex: "ma_don_hang",
      ...getColumnSearchProps("ma_don_hang"),
      onFilter: (value, record: any) => record.ma_don_hang.indexOf(value) === 0,
      sorter: (a: any, b: any) => a.ma_don_hang.length - b.ma_don_hang.length,
    },
    {
      title: "Ngày tạo",
      ...getColumnSearchProps("created_at"),
      sorter: (a: any, b: any) => a.created_at - b.created_at,
      onFilter: (value: boolean | React.Key, record: any) =>
        new Date(record.created_at)
          .toLocaleDateString("vi-VN")
          .includes(String(value)) ||
        new Date(record.created_at)
          .toLocaleDateString("vi-VN")
          .includes(String(value)), // Tìm

      // dataIndex: "created_at",/
      render: (_, record) => {
        const date = new Date(record.created_at);
        return (
          <div>
            {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
          </div>
        );
      },
    },
    {
      title: "Khách hàng",
      ...getColumnSearchProps("ten_nguoi_dat_hang"),
      sorter: (a: any, b: any) =>
        a.ten_nguoi_dat_hang.localeCompare(b.ten_nguoi_dat_hang),
      onFilter: (value: boolean | React.Key, record: any) =>
        record.ten_nguoi_dat_hang
          .toLowerCase()
          .includes(String(value).toLowerCase()),

      dataIndex: "ten_nguoi_dat_hang",
    },

    {
      title: "Trạng thái",
      dataIndex: "trang_thai_don_hang",
      ...getColumnSearchProps("trang_thai_don_hang"),
      sorter: (a: any, b: any) =>
        a.trang_thai_don_hang.localeCompare(b.trang_thai_don_hang),
      onFilter: (value: boolean | React.Key, record: any) =>
        record.trang_thai_don_hang
          .toLowerCase()
          .includes(String(value).toLowerCase()),

      render: (_, record) => {
        return (
          <div
            className={
              "font-bold text-[15px] " +
              (record.trang_thai_don_hang === "Chờ xác nhận"
                ? "text-yellow-400" // Chờ xác nhận: màu vàng nhạt
                : record.trang_thai_don_hang === "Đã xác nhận"
                  ? "text-orange-500" // Đã xác nhận: màu cam đậm
                  : record.trang_thai_don_hang === "Đang xử lý"
                    ? "text-blue-500" // Đang xử lý: màu xanh dương
                    : record.trang_thai_don_hang === "Đang giao hàng"
                      ? "text-purple-500" // Đang giao hàng: màu tím
                      : record.trang_thai_don_hang === "Giao hàng thành công"
                        ? "text-green-500" // Đã giao hàng thành công: màu xanh lá
                        : record.trang_thai_don_hang === "Hủy hàng"
                         ? "text-red-500" // Hủy đơn hàng: màu đ��
                         : "text-green-500 "
              )
            }
          >
            {record.trang_thai_don_hang === "Chờ xác nhận"
              ? "Chờ xác nhận"
              : record.trang_thai_don_hang === "Đã xác nhận"
                ? "Đã xác nhận"
                : record.trang_thai_don_hang === "Đang xử lý"
                  ? "Chờ lấy hàng"
                  : record.trang_thai_don_hang === "Đang giao hàng"
                    ? "Đang giao hàng"
                    : record.trang_thai_don_hang === "Giao hàng thành công"
                      ? "Đã giao hàng thành công"
                  
                      : record.trang_thai_don_hang === "Hủy hàng"
                        ? "Hủy hàng"
                        : "Hủy hàng"
                      }
                      
          </div>
        );
      },
    },
    {
      title: "Thanh toán",
      dataIndex: "trang_thai_thanh_toan",
      ...getColumnSearchProps("trang_thai_thanh_toan"),
      sorter: (a: any, b: any) =>
        a.trang_thai_thanh_toan.localeCompare(b.trang_thai_thanh_toan),
      onFilter: (value: boolean | React.Key, record: any) =>
        record.trang_thai_thanh_toan
          .toLowerCase()
          .includes(String(value).toLowerCase()),

      render: (_, record) => {
        return (
          <div
            className={
              record.trang_thai_thanh_toan === "Đã thanh toán"
                ? "text-green-500 font-bold text-[15px]"
                : record.trang_thai_thanh_toan === "Chờ xử lý"
                  ? "text-blue-500 font-bold text-[15px]"
                  : "text-yellow-500 font-bold text-[15px]"
            }
          >
            {record.trang_thai_thanh_toan === "Đã thanh toán"
              ? "Đã thanh toán"
              : record.trang_thai_thanh_toan === "Chờ xử lý"
                ? "Chờ xử lý"
                : "Chưa thanh toán"}
          </div>
        );
      },
    },
    // {
    //   title: "Giao hàng",
    //   dataIndex: "trang_thai_van_chuyen",
    //   ...getColumnSearchProps("trang_thai_van_chuyen"),
    //   sorter: (a: any, b: any) =>
    //     a.trang_thai_van_chuyen.localeCompare(b.trang_thai_van_chuyen),
    //   onFilter: (value: boolean | React.Key, record: any) =>
    //     record.trang_thai_van_chuyen
    //       .toLowerCase()
    //       .includes(String(value).toLowerCase()),

    //   render: (_, record) => {
    //     return (
    //       <div
    //         className={
    //           record.trang_thai_van_chuyen === "Chờ xử lý"
    //             ? "text-orange-500 font-bold text-[15px]"
    //             : record.trang_thai_van_chuyen === "Chờ lấy hàng"
    //               ? "text-blue-500 font-bold text-[15px]"
    //               : record.trang_thai_van_chuyen === "Đang giao hàng"
    //                 ? "text-green-500 font-bold text-[15px]"
    //                 : record.trang_thai_van_chuyen === "Giao hàng thành công"
    //                   ? "text-teal-500 font-bold text-[15px]"
    //                   : "text-red-500 font-bold text-[15px]" // Trạng thái khác
    //         }
    //       >
    //         {record.trang_thai_van_chuyen === "Chờ xử lý"
    //           ? "Chờ xử lý"
    //           : record.trang_thai_van_chuyen === "Chờ lấy hàng"
    //             ? "Chờ lấy hàng"
    //             : record.trang_thai_van_chuyen === "Đang giao hàng"
    //               ? "Đang giao hàng"
    //               : record.trang_thai_van_chuyen === "Giao hàng thành công"
    //                 ? "Giao hàng thành công"
    //                 : "Hủy"}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: "COD",
    //   render: (_, record) => {
    //     return (
    //       <div
    //         className={
    //           record.trang_thai_thanh_toan === "Chưa thanh toán"
    //             ? "text-red-500 font-bold text-[15px]" // Màu đỏ cho "Chưa thanh toán"
    //             : record.trang_thai_thanh_toan === "Đã thanh toán"
    //               ? "text-green-500 font-bold text-[15px]" // Màu xanh lá cho "Đã thanh toán"
    //               : "text-gray-500 font-bold text-[15px]" // Màu xám cho các trạng thái khác
    //         }
    //       >
    //         {record.trang_thai_thanh_toan === "Chưa thanh toán"
    //           ? "Chưa Nhận"
    //           : record.trang_thai_thanh_toan === "Đã thanh toán"
    //             ? "Đã Nhận"
    //             : "Không thu tiền"}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Tổng tiền",
      dataIndex: " tong_tien_don_hang",
      render: (_, record) => {
        return (
          <div>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(record.tong_tien_don_hang))}
          </div>
        );
      },
    },
    {
      title: "Quản trị",
      dataIndex: "products",
      render: (_, record) => <Detail record={record} />,
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [trangthai, setTrangThai] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [formcheck, setFormCheck] = useState(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ORDERS"],
    queryFn: async () => {
      const response = await instance.get("/donhang");
      return response.data;
    },
  });
  const order: DataType[] | undefined = data?.data;
  // console.log("order", order);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (data: React.Key[]) => {
      console.log("data", data);
      try {
        const trangthais =
          trangthai == "1"
            ? "Đã xác nhận"
            : trangthai == "2"
              ? "Đang xử lý"
              : trangthai == "3"
                ? "Đã giao hàng thành công"
                : "Đã hủy hàng";

        const response = await instance.put("donhang/trang-thai-don-hang", {
          trang_thai_don_hang: trangthais,
          id: data,
        });
        const error = response.data.message;
        start();
        if (error === "Cập nhật trạng thái đơn hàng thành công") {
          message.open({
            type: "success",
            content: error,
          });
        } else {
          message.open({
            type: "success",
            content: error,
          });
        }
        return response.data;
      } catch (error: any) {
        console.error(error.message);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["ORDERS"],
      });
      setLoading(false);
    },
    onError: (error: any) => {
      console.error("Error updating order:", error.message);
      message.open({
        type: "error",
        content: `Cập nhật trạng thái đơn hàng thất bại: ${error.message}`,
      });
      setLoading(false);
    },
  });

  const start = () => {
    setFormCheck(!formcheck);
    // setLoading(true);
    // ajax request after empty completing
    // setTimeout(() => {
    // console.log("selectedRowKeys", selectedRowKeys);
    // setLoading(false);
    // }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    // const data = order?.filter((item) => {
    //   console.log("item", item?.id);
    // });
    // console.log("selectedRowKeys changed: ", data);
    // const id = newSelectedRowKeys.map((item) => {
    //   console.log("item", item);
    // });
    // console.log("id", id);
    // console.log("id", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  interface OrderData extends DataType {
    key: React.Key;
  }

  const [filteredData, setFilteredData] = useState<DataType[]>([]);

  // Cập nhật dữ liệu khi nhận được từ API
  useEffect(() => {
    if (order) {
      setFilteredData(order);
    }
  }, [order]);

  // Hàm xử lý tìm kiếm
  const handleSearchChange = (e: any) => {
    const value = e.target.value;
    setSearchText(value);
    // console.log(value);
    if (value) {
      const filtered = order?.filter(
        (item: any) =>
          item.ten_nguoi_dat_hang.toLowerCase().includes(value.toLowerCase()) ||
          item.ma_don_hang.toLowerCase().includes(value.toLowerCase()) ||
          item.trang_thai_don_hang
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item.trang_thai_thanh_toan
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          item.trang_thai_van_chuyen.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(filtered || []);
    } else {
      if (order) {
        setFilteredData(order); // Reset to original order data if search is empty
      }
    }
  };

  const dataSource: OrderData[] | undefined = filteredData?.map(
    (item: DataType, i: number): OrderData => ({
      ...item,
      key: i + 1,
    })
  );
  const handleChange = (value: string) => {
    setTrangThai(value);
  };
  const hasSelected = selectedRowKeys.length > 0;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / <span className="font-semibold">Đơn hàng</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Đơn hàng</h1>
      </div>
      <div>
        {" "}
        <div className="max-w-xs my-2">
          <Input
            placeholder="Tìm kiếm..."
            size="large"
            value={searchText}
            onChange={handleSearchChange}
            style={{ marginBottom: 16, maxWidth: 300 }}
          />
        </div>
        <Flex gap="middle" vertical>
          <Flex align="center" gap="middle" className="relative">
            <Button
              type="primary"
              onClick={start}
              disabled={!hasSelected}
              loading={loading}
              className="text-white"
            >
              Thao tác
            </Button>

            {formcheck && (
              <div className="bg-white absolute left-0 top-10 z-10 w-80 h-36 rounded-lg shadow-md p-3">
                <p>Cập nhật trạng thái đơn hàng theo:</p>
                <Select
                  defaultValue={datas[0].label}
                  style={{ width: "100%" }}
                  onChange={handleChange}
                  options={datas}
                />
                <br />
                <div className="my-5 flex justify-between">
                  <Popconfirm
                    title="Trạng thái"
                    description="Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng này?"
                    okText="Có"
                    onConfirm={() => mutate(selectedRowKeys)}
                    cancelText="Không"
                  >
                    <Button
                      type="primary"
                      className="bg-red-500 text-white hover:bg-red-700"
                      disabled={!hasSelected}
                      loading={loading}
                    >
                      Xác nhận
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            )}

            {hasSelected ? `Đã chọn ${selectedRowKeys.length} đơn` : null}
          </Flex>
          <Table<DataType>
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            loading={isLoading}
            pagination={{ pageSize: 10, className: "my-5" }}
          />
        </Flex>
      </div>
    </main>
  );
};

export default OrderAdmin;
