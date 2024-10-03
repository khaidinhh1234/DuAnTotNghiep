  import instance from "@/configs/admin";
  import { SearchOutlined } from "@ant-design/icons";
  import { useQuery } from "@tanstack/react-query";
  import { Button, DatePicker, Input, Select, Space, Table } from "antd";
  import type { ColumnsType } from "antd/es/table";
  import React, { useEffect, useState } from "react";
  import { Link } from "react-router-dom";
  import DetailTransport from "./DetailTransport";

  const { Option } = Select;
  const { RangePicker } = DatePicker;

  interface TransportData extends Transport {
    key: React.Key;
  }

  interface Transport {
    id: number;
    created_at: string; 
    don_hang_id: number;
    ma_van_chuyen: string;
    trang_thai_van_chuyen: string;
    cod: number;
    tien_cod: number;
    anh_xac_thuc: string;
  }

  const TableUncomfirmedOrder: React.FC = () => {
    const [filteredData, setFilteredData] = useState<Transport[]>([]);
    
    const { data, isLoading, isError } = useQuery({
      queryKey: ["vanchuyen"],
      queryFn: async () => {
        const response = await instance.get("/vanchuyen");
        return response.data;
      },
    });

    const transport: Transport[] | undefined = data?.data;

    useEffect(() => {
      if (transport) {
        setFilteredData(transport);
      }
    }, [transport]);

    const dataSource: TransportData[] | undefined = filteredData?.map(
      (item: Transport, i: number): TransportData => ({
        ...item,
        key: i + 1,
      })
    );

    const columns: ColumnsType<TransportData> = [
      {
        title: "Mã vận chuyển",
        dataIndex: "ma_van_chuyen", // Sửa lại cho khớp với dữ liệu thực tế
        key: "ma_van_chuyen",
      },
      {
        title: "Mã đơn hàng",
        dataIndex: "don_hang_id",
        key: "don_hang_id",
        render: (text) => <a>{text}</a>,
      },
      {
        title: "Ngày tạo",
        dataIndex: "created_at",
        key: "created_at",
        sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
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
        title: "Thanh toán",
        dataIndex: "trang_thai_thanh_toan",
        key: "trang_thai_thanh_toan",
        sorter: (a, b) => a.trang_thai_thanh_toan.localeCompare(b.trang_thai_thanh_toan),
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
      {
        title: "Trạng thái giao hàng",
        dataIndex: "trang_thai_van_chuyen",
        key: "trang_thai_van_chuyen",
        sorter: (a, b) => a.trang_thai_van_chuyen.localeCompare(b.trang_thai_van_chuyen),
        render: (_, record) => {
          return (
            <div
              className={
                "font-bold text-[15px] " +
                (record.trang_thai_van_chuyen === "Chờ xác nhận"
                  ? "text-yellow-400"
                  : record.trang_thai_van_chuyen === "Đã xác nhận"
                    ? "text-orange-500"
                    : record.trang_thai_van_chuyen === "Đang xử lý"
                      ? "text-blue-500"
                      : record.trang_thai_van_chuyen === "Đang giao hàng"
                        ? "text-purple-500"
                        : record.trang_thai_van_chuyen === "Đã giao hàng thành công"
                          ? "text-green-500"
                          : "text-red-500")
              }
            >
              {record.trang_thai_van_chuyen === "Chờ xác nhận"
                ? "Chờ xác nhận"
                : record.trang_thai_van_chuyen === "Đã xác nhận"
                  ? "Đã xác nhận"
                  : record.trang_thai_van_chuyen === "Đang xử lý"
                    ? "Đang xử lý"
                    : record.trang_thai_van_chuyen === "Đang giao hàng"
                      ? "Đang giao hàng"
                      : record.trang_thai_van_chuyen === "Đã giao hàng thành công"
                        ? "Giao Thành công"
                        : "Hủy"}
            </div>
          );
        },
      },
      {
        title: "Tổng tiền",
        dataIndex: "tien_cod",
        key: "tien_cod",
      },  
      {
        title: "Thao tác",
        key: "action",
        render: (_, record) => (
          <Space size="middle">
            <DetailTransport record={record} />
            <Button>Hủy đơn</Button>
          </Space>
        ),
      },
    ];

    return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="md:text-base">
            Quản trị / Vận chuyển /{" "}
            <span className="font-semibold px-px">Chưa xác nhận đơn hàng</span>
          </h1>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Link to="/admin/transport" className="mr-1">
              <Button className="ml-auto bg-black text-white rounded-lg py-1">
                Quay lại
              </Button>
            </Link>
          </div>
        </div>
        <div>
          {/* Bộ lọc tìm kiếm */}
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Input placeholder="Tìm kiếm" prefix={<SearchOutlined />} />
              <Select defaultValue="Tất cả đơn hàng" style={{ width: 200 }}>
                <Option value="tatca">Tất cả đơn hàng</Option>
                <Option value="choxuly">Chờ xử lý</Option>
                <Option value="cholayhang">Chờ lấy hàng</Option>
                <Option value="danggiaohang">Đang giao hàng</Option>
                <Option value="giaohangthanhcong">Giao hàng thành công</Option>
              </Select>
              <RangePicker />
            </Space>
          </div>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={{ pageSize: 10, className: "my-5" }}
          />
        </div>
      </main>
    );
  };

  export default TableUncomfirmedOrder;
