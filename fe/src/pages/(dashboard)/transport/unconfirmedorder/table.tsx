import instance from "@/configs/admin";
import { SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Flex,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  TableColumnsType,
  TableProps,
  Tabs,
} from "antd";
import React, { useEffect, useState } from "react";
import DetailTransport from "./DetailTransport";
import OrderDetail from "../../_component/Detaile";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];
// const { Option } = Select;
const { RangePicker } = DatePicker;

interface TransportData extends Transport {
  key: React.Key;
  index: number;
}

interface Transport {
  don_hang: any;
  id: number;
  created_at: string;
  don_hang_id: number;
  shipper_id: number;
  ma_van_chuyen: string;
  trang_thai_van_chuyen: string;
  cod: number;
  tien_cod: number;
  anh_xac_thuc: string;
  khach_hang_xac_nhan: string;
  shipper_xac_nhan: string;
  so_lan_giao: string;
  ghi_chu: string;
}

const datas = [
  { value: "1", label: "Đang giao hàng" },
  { value: "2", label: "Giao hàng thành công" },
  { value: "3", label: "Giao hàng thất bại" },
  { label: "Giao hàng thất bại", key: "Giao hàng thất bại" },
];

const TableUncomfirmedOrder: React.FC = () => {
  const queryClient = useQueryClient();
  const [trangthai, setTrangThai] = useState<string>();
  const [filteredData, setFilteredData] = useState<Transport[]>([]);
  const [formcheck, setFormCheck] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("Tất cả");
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<Transport> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    setDateRange(dateStrings);
  };
  const { data, isLoading } = useQuery({
    queryKey: ["vanchuyen"],
    queryFn: async () => {
      const response = await instance.get("/vanchuyen");
      return response.data;
    },
  });

  useEffect(() => {
    if (data?.data) {
      let filtered = data.data;

      if (searchText) {
        filtered = filtered.filter((item: Transport) =>
          item.ma_van_chuyen.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      if (dateRange) {
        const [start, end] = dateRange;
        filtered = filtered.filter((item: Transport) => {
          const itemDate = new Date(item.created_at)
            .toISOString()
            .split("T")[0];
          return itemDate >= start && itemDate <= end;
        });
      }

      if (activeTab !== "Tất cả") {
        filtered = filtered.filter(
          (item: Transport) => item.trang_thai_van_chuyen === activeTab
        );
      }

      setFilteredData(filtered);
    }
  }, [searchText, dateRange, activeTab, data]);

  // const { mutate } = useMutation({
  //   mutationFn: async (data: React.Key[]) => {
  //     try {
  //       const trangthais =
  //         trangthai === "1"
  //           ? "Đang giao hàng"
  //           : trangthai === "2"
  //             ? "Giao hàng thành công"
  //             : trangthai === "3"
  //               ? "Giao hàng thất bại"
  //               : "Không rõ";

  //       const response = await instance.put("vanchuyen/trang-thai-van-chuyen", {
  //         trang_thai_van_chuyen: trangthais,
  //         id: data,
  //       });
  //       const error = response.data.message;
  //       start();
  //       if (error === "Cập nhật trạng thái đơn hàng thành công") {
  //         message.open({
  //           type: "success",
  //           content: error,
  //         });
  //       } else {
  //         message.open({
  //           type: "success",
  //           content: error,
  //         });
  //       }
  //       return response.data;
  //     } catch (error: any) {
  //       console.error(error.message);
  //       throw new Error(error.message);
  //     }
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["vanchuyen"],
  //     });
  //     setLoading(false);
  //   },
  //   onError: (error: any) => {
  //     console.error("Error updating order:", error.message);
  //     message.open({
  //       type: "error",
  //       content: `Cập nhật trạng thái đơn hàng thất bại: ${error.message}`,
  //     });
  //     setLoading(false);
  //   },
  // });

  // const { data, isLoading } = useQuery({
  //   queryKey: ["vanchuyen"],
  //   queryFn: async () => {
  //     const response = await instance.get("/vanchuyen");
  //     return response.data;
  //   },
  // });
  // console.log(data);

  const start = () => {
    setFormCheck(!formcheck);
  };

  const transport: Transport[] | undefined = data?.data;

  useEffect(() => {
    if (transport) {
      // Nếu tab "Tất cả" được chọn, hiển thị tất cả dữ liệu mà không lọc
      if (activeTab === "Tất cả") {
        setFilteredData(transport);
      } else {
        // Lọc dữ liệu theo trạng thái của tab đang được chọn
        const filtered = transport?.filter(
          (item) => item.trang_thai_van_chuyen === activeTab
        );
        setFilteredData(filtered);
      }
    }
  }, [transport, activeTab]);

  const dataSource: TransportData[] = (
    Array.isArray(filteredData) ? filteredData : []
  ).map(
    (item: any): TransportData => ({
      key: item.id,
      ...item,
      don_hang_id: item.don_hang?.ma_don_hang || "Chưa có dữ liệu",
      trang_thai_thanh_toan:
        item.don_hang?.trang_thai_thanh_toan || "Chưa có dữ liệu",
      shipper_id: item.don_hang?.shipper?.ho_ten || "Chưa có dữ liệu",
    })
  );

  const handleChange = (value: string) => {
    setTrangThai(value);
  };
  const hasSelected = selectedRowKeys.length > 0;
  const columns: TableColumnsType<Transport> = [
    {
      title: "Mã vận chuyển",
      dataIndex: "ma_van_chuyen",
      key: "ma_van_chuyen",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "don_hang_id",
      key: "don_hang_id",
      render: (text) => <OrderDetail record={text} />,
    },

    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      sorter: (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
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
      title: "Trạng thái giao hàng",
      dataIndex: "trang_thai_van_chuyen",
      key: "trang_thai_van_chuyen",
      render: (_, record) => {
        return (
          <div
            className={
              "font-bold text-[15px] " +
              (record.trang_thai_van_chuyen === "Chờ xử lý"
                ? "text-yellow-400"
                : record.trang_thai_van_chuyen === "Đang giao hàng"
                  ? "text-blue-500"
                  : record.trang_thai_van_chuyen === "Giao hàng thành công"
                    ? "text-green-500"
                    : record.trang_thai_van_chuyen === "Giao hàng thất bại"
                      ? "text-red-500"
                      : "text-gray-500")
            }
          >
            {record.trang_thai_van_chuyen}
          </div>
        );
      },
    },
    {
      title: "Thanh toán",
      dataIndex: "trang_thai_thanh_toan",
      key: "trang_thai_thanh_toan",
      sorter: (a: any, b: any) =>
        a.trang_thai_thanh_toan.localeCompare(b.trang_thai_thanh_toan),
      render: (_, record: any) => {
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
    {
      title: "Tổng tiền COD",
      dataIndex: "tien_cod",
      // key: "tien_cod",
      render: (_, record) => {
        return (
          <div>
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(record.tien_cod))}
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        // console.log(record),
        <Space size="middle">
          <DetailTransport record={record} />
        </Space>
      ),
    },
  ];

  // Tabs để lọc dữ liệu theo trạng thái
  const tabItems = [
    { label: "Đơn vận chuyển", key: "Tất cả" },
    { label: "Chờ xử lý", key: "Chờ xử lý" },
    { label: "Đang giao hàng", key: "Đang giao hàng" },
    { label: "Giao hàng thành công", key: "Giao hàng thành công" },
    { label: "Giao hàng thất bại", key: "Giao hàng thất bại" },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị /<span className="font-semibold px-px"> Vận chuyển</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Vận chuyển</h1>
      </div>
      {/* <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/transport" className="mr-1">
            <Button className="ml-auto bg-black text-white rounded-lg py-1">
              Quay lại
            </Button>
          </Link>
        </div>
      </div> */}
      <div>
        <Tabs
          defaultActiveKey="Tất cả"
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={tabItems}
        />
        {/* Bộ lọc tìm kiếm */}
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Input
              placeholder="Tìm kiếm"
              prefix={<SearchOutlined />}
              onChange={handleSearchChange}
            />
            <RangePicker onChange={handleDateRangeChange} />
          </Space>
        </div>
        <Table<Transport>
          columns={columns}
          dataSource={dataSource}
          loading={isLoading}
          pagination={{ pageSize: 10, className: "my-5" }}
        />
      </div>
    </main>
  );
};

export default TableUncomfirmedOrder;
