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
  DatePicker,
  Flex,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
  Tabs,
} from "antd";
import type { FilterDropdownProps } from "antd/es/table/interface";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import Detail from "./detail";
import instance from "@/configs/admin";
const { RangePicker } = DatePicker;
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
    label: "Hoàn tất Chuẩn bị",
  },
];
type DataIndex = keyof any;
const OrderAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Tất cả");

  const [searchedColumn, setSearchedColumn] = useState<DataIndex | "">("");
  const [searchText, setSearchText] = useState("");

  const searchInput = useRef<InputRef>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["ORDERS"],
    queryFn: async () => {
      const response = await instance.get("/donhang");
      return response.data;
    },
  });
  const order: DataType[] | undefined = data?.data;
  const handleDateChange = (_: any, dateStrings: [string, string]) => {
    const startDate = new Date(dateStrings[0]);
    const endDate = new Date(dateStrings[1]);
    // console.log("startDate", startDate);
    // console.log("endDate", endDate);

    const filtered = order?.filter((record: any) => {
      const recordDate = new Date(record.created_at);
      return recordDate >= startDate && recordDate <= endDate;
    });
    // console.log("filtered", filtered);
    setFilteredData(filtered || []);
    // Thực hiện hành động gì đó, ví dụ như gọi API để lọc theo khoảng ngày
  };

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
  // Cập nhật dữ liệu khi nhận được từ API
  useEffect(() => {
    // console.log("order", activeTab);
    if (order) {
      if (activeTab === "Tất cả") {
        // console.log("order", activeTab);
        setFilteredData(order);
      } else {
        const filtered = order?.filter(
          (item: any) =>
            item.trang_thai_don_hang
              .toLowerCase()
              .includes(activeTab.toLowerCase()) ||
            item.trang_thai_thanh_toan
              .toLowerCase()
              .includes(activeTab.toLowerCase())
        );
        setFilteredData(filtered);
      }

      // setFilteredData(order);
    }
  }, [order, activeTab]);
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
      render: (_, record: any) => {
        // console.log(record?.user?.ho);
        return (
          <div>
            {record.ten_nguoi_dat_hang
              ? record.ten_nguoi_dat_hang
              : `${record?.user?.ho} ${record?.user?.ten}`}
          </div>
        );
      },
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
                      : record.trang_thai_don_hang === "Chờ khách hàng xác nhận"
                        ? "text-green-700"
                        : record.trang_thai_don_hang === "Hoàn tất đơn hàng"
                          ? "text-green-500" // Hoàn tất đơn hàng: màu xanh lá
                          : record.trang_thai_don_hang === "Hủy hàng"
                            ? "text-red-500" // Hủy hàng: màu đỏ
                            : record.trang_thai_don_hang ===
                                "Đơn hàng bị từ chối nhân"
                              ? "text-red-700" // Đơn hàng bị từ chối nhận: màu đỏ đậm
                              : record.trang_thai_don_hang === "Hoàn hàng"
                                ? "text-blue-700" // Hoàn hàng: màu xanh đậm
                                : record.trang_thai_don_hang ===
                                    "Chờ xác nhận hoàn hàng"
                                  ? "text-yellow-500" // Chờ xác nhận hoàn hàng: màu vàng đậm
                                  : record.trang_thai_don_hang ===
                                      "Từ chối hoàn hàng"
                                    ? "text-gray-500" // Từ chối hoàn hàng: màu xám
                                    : "text-gray-700") // Mặc định: màu xám đậm
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
                    : record.trang_thai_don_hang === "Chờ khách hàng xác nhận"
                      ? "Chờ khách hàng xác nhận"
                      : record.trang_thai_don_hang === "Hoàn tất đơn hàng"
                        ? "Hoàn tất đơn hàng"
                        : record.trang_thai_don_hang === "Hủy hàng"
                          ? "Hủy hàng"
                          : record.trang_thai_don_hang ===
                              "Đơn hàng bị từ chối nhân"
                            ? "Đơn hàng bị từ chối nhận"
                            : record.trang_thai_don_hang === "Hoàn hàng"
                              ? "Hoàn hàng"
                              : record.trang_thai_don_hang ===
                                  "Chờ xác nhận hoàn hàng"
                                ? "Chờ xác nhận hoàn hàng"
                                : record.trang_thai_don_hang ===
                                    "Từ chối hoàn hàng"
                                  ? "Từ chối hoàn hàng"
                                  : "Giao hàng thất bại"}
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
                  : record.trang_thai_thanh_toan === "Đã hoàn tiền"
                    ? "text-red-500 font-bold text-[15px]" // Đã hoàn tiền: màu đỏ
                    : "text-yellow-500 font-bold text-[15px]" // Chưa thanh toán: màu vàng
            }
          >
            {record.trang_thai_thanh_toan === "Đã thanh toán"
              ? "Đã thanh toán"
              : record.trang_thai_thanh_toan === "Chờ xử lý"
                ? "Chờ xử lý"
                : record.trang_thai_thanh_toan === "Đã hoàn tiền"
                  ? "Đã hoàn tiền"
                  : "Chưa thanh toán"}
          </div>
        );
      },
    },

    {
      title: "Tổng tiền",
      dataIndex: " tong_tien_don_hang",
      render: (_, record) => {
        // console.log("record", record);
        return (
          <div>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(record?.tong_tien_don_hang))}
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

  // console.log("order", order);
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (data: React.Key[]) => {
      try {
        const trangthais =
          trangthai === "1"
            ? "Đã xác nhận"
            : trangthai == "2"
              ? "Đang xử lý"
              : "Đã xác nhận";
        const response = await instance.put("donhang/trang-thai-don-hang", {
          trang_thai_don_hang: trangthais,
          id: data,
        });
        const datas = response.data.data.length;
        const error = response.data;
        // console.log("error", datas);
        start();
        if (datas >= 1) {
          message.open({
            type: "error",
            content: `Không thể cập nhật trạng thái ${datas} đơn hàng không hợp lệ`,
          });
        } else {
          message.open({
            type: "success",
            content: error.message,
          });
        }
        return response.data;
      } catch (error: any) {
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
  const dataSource: OrderData[] | undefined = filteredData?.map(
    (item: DataType): OrderData => ({
      ...item,
      key: item.id,
    })
  );
  // Cập nhật dữ liệu khi nhận được từ API
  useEffect(() => {
    if (order) {
      setFilteredData(order);
    }
  }, [order]);

  // Hàm xử lý tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);

    if (value) {
      const filtered = order?.filter((item: any) => {
        // Kiểm tra nếu các trường tồn tại trước khi gọi toLowerCase
        const tenNguoiDatHang = item.ten_nguoi_dat_hang?.toLowerCase() || "";
        const maDonHang = item.ma_don_hang?.toLowerCase() || "";
        const trangThaiDonHang = item.trang_thai_don_hang?.toLowerCase() || "";
        const trangThaiThanhToan =
          item.trang_thai_thanh_toan?.toLowerCase() || "";
        const trangThaiVanChuyen =
          item.trang_thai_van_chuyen?.toLowerCase() || "";

        return (
          tenNguoiDatHang.includes(value.toLowerCase()) ||
          maDonHang.includes(value.toLowerCase()) ||
          trangThaiDonHang.includes(value.toLowerCase()) ||
          trangThaiThanhToan.includes(value.toLowerCase()) ||
          trangThaiVanChuyen.includes(value.toLowerCase())
        );
      });
      setFilteredData(filtered || []);
    } else {
      // Reset về dữ liệu gốc khi không có giá trị tìm kiếm
      if (order) setFilteredData(order);
    }
  };

  const handleChange = (value: string) => {
    setTrangThai(value);
  };
  const hasSelected = selectedRowKeys.length > 0;
  const tabItems = [
    { label: "Tổng đơn hàng", key: "Tất cả" },
    { label: "Chờ xác nhận", key: "Chờ xác nhận" },
    { label: "Đã xác nhận", key: "Đã xác nhận" },
    { label: "Chờ lấy hàng", key: "Đang xử lý" },

    { label: "Giao hàng thất bại", key: "Đơn hàng bị từ chối nhân" },

    { label: "Giao hàng thành công", key: "Hoàn tất đơn hàng" },
    { label: "Chưa thanh toán", key: "Chưa thanh toán" },

    { label: "Đã thanh toán", key: "Đã thanh toán" },
  ];

  if (isLoading)
    return (
      <div className="flex items-center justify-center mt-[250px]">
        <Spin size="large" />
      </div>
    );
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
        <Tabs
          defaultActiveKey="Tất cả"
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={tabItems}
        />
        <Flex gap="middle" vertical>
          <Flex align="center" gap="middle" className="relative">
            <div className="flex gap-3">
              <Button
                type="primary"
                onClick={start}
                disabled={!hasSelected}
                loading={loading}
                className="text-white"
              >
                Thao tác
              </Button>
              <div style={{ marginBottom: 16 }}>
                <Space>
                  <Input
                    placeholder="Tìm kiếm"
                    prefix={<SearchOutlined />}
                    onChange={(e: any) => handleSearchChange(e)}
                  />

                  <RangePicker onChange={handleDateChange} />
                </Space>
              </div>
            </div>
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
