import instance from "@/configs/admin";
import { SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, DatePicker, Flex, Input, message, Popconfirm, Select, Space, Table, TableColumnsType, TableProps } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DetailTransport from "./DetailTransport";


type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];
const { Option } = Select;
const { RangePicker } = DatePicker;

interface TransportData extends Transport {
  key: React.Key;
}

interface Transport {
  don_hang: any;
  id: number;
  created_at: string;
  don_hang_id: number;
  ma_van_chuyen: string;
  trang_thai_van_chuyen: string;
  cod: number;
  tien_cod: number;
  anh_xac_thuc: string;
}
const datas = [
  {
    value: "1",
    label: "Đang giao hàng",
  },
  {
    value: "2",
    label: "Giao hàng thành công",
  },
  {
    value: "3",
    label: "Giao hàng thất bại",
  },
];
const TableUncomfirmedOrder: React.FC = () => {
  const queryClient = useQueryClient();
  const [trangthai, setTrangThai] = useState<string>();
  const [filteredData, setFilteredData] = useState<Transport[]>([]);
  const [formcheck, setFormCheck] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const hasSelected = selectedRowKeys.length > 0;
  const [loading, setLoading] = useState(false);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    // console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    // const id = newSelectedRowKeys.map((item) => {
    //   return Number(item) + 1;
    // });
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection: TableRowSelection<Transport> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const { mutate } = useMutation({
    mutationFn: async (data: React.Key[]) => {
      console.log(data)
      try {
        const trangthais =  
          trangthai === "1"
            ? "Đang giao hàng"
            : trangthai === "2"
              ? "Giao hàng thành công"
              : trangthai === "3"
                ? "Giao hàng thất bại"
                : "Không rõ";

        const response = await instance.put(
          "vanchuyen/trang-thai-van-chuyen",
          {
            trang_thai_van_chuyen: trangthais,
            id: data,
          }
        );
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
        queryKey: ["vanchuyen"],
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
  const { data, isLoading, isError } = useQuery({
    queryKey: ["vanchuyen"],
    queryFn: async () => {
      const response = await instance.get("/vanchuyen");
      return response.data;
    },
  });
  console.log(data)
  const start = () => {
    setFormCheck(!formcheck);
  };
  const transport: Transport[] | undefined = data?.data;

  useEffect(() => {
    if (transport) {
      setFilteredData(transport);
    }
  }, [transport]);

  const dataSource: TransportData[] | undefined = filteredData?.map(
    (item: Transport, index: number): TransportData => ({
      key: item.id,
      ...item,
      don_hang_id: item.don_hang?.ma_don_hang || "Chưa có dữ liệu",
      // index: index + 1,
    })
  );
  const handleChange = (value: string) => {
    setTrangThai(value);
  };
  const columns: TableColumnsType<Transport> = [
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
              (record.trang_thai_van_chuyen === "Chờ xử lý"
                ? "text-yellow-400"
                : record.trang_thai_van_chuyen === "Đang giao hàng"
                  ? "text-orange-500"
                  : record.trang_thai_van_chuyen === "Giao hàng thành công"
                    ? "text-blue-500"
                    : record.trang_thai_van_chuyen === "Giao hàng thất bại"
                      ? "text-red-500"
                      : "text-gray-500") // Các giá trị khác hiển thị màu xám
            }
          >
            {record.trang_thai_van_chuyen === "Chờ xử lý"
              ? "Chờ xử lý"
              : record.trang_thai_van_chuyen === "Đang giao hàng"
                ? "Đang giao hàng"
                : record.trang_thai_van_chuyen === "Giao hàng thành công"
                  ? "Giao hàng thành công"
                  : record.trang_thai_van_chuyen === "Giao hàng thất bại"
                    ? "Giao hàng thất bại"
                    : "Trạng thái không xác định"} {/* Trạng thái khác */}
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
          <Table<Transport>
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

export default TableUncomfirmedOrder;
