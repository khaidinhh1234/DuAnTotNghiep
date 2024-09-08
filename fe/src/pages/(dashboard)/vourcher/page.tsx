
import React, { ChangeEvent, useRef, useState } from "react";
import { DeleteOutlined, PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import { Button, Input, Popconfirm, Space, Table, Tag, Checkbox } from "antd";
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
  trang_thai: string;
  dieu_kien_ap_dung: string;
  so_luot_su_dung: number;
  gioi_han_su_dung: number;
}

const promotions: PromotionType[] = [
  {
    key: "1",
    ten_khuyen_mai: "Giảm giá 10% cho đơn hàng trên 500k",
    loai_khuyen_mai: "Giảm giá phần trăm",
    gia_tri: "10",
    ngay_bat_dau: "2024-09-01",
    ngay_ket_thuc: "2024-09-30",
    trang_thai: "Đang hoạt động",
    dieu_kien_ap_dung: "Đơn hàng từ 500,000 VND",
    so_luot_su_dung: 15,
    gioi_han_su_dung: 100,
  },
  {
    key: "2",
    ten_khuyen_mai: "Giảm 200k cho đơn hàng từ 1 triệu",
    loai_khuyen_mai: "Giảm giá tiền mặt",
    gia_tri: 200000,
    ngay_bat_dau: "2024-08-01",
    ngay_ket_thuc: "2024-08-31",
    trang_thai: "Đã kết thúc",
    dieu_kien_ap_dung: "Đơn hàng từ 1,000,000 VND",
    so_luot_su_dung: 40,
    gioi_han_su_dung: 50,
  },
  {
    key: "3",
    ten_khuyen_mai: "Giảm giá 15% cho đơn hàng trên 1 triệu",
    loai_khuyen_mai: "Giảm giá phần trăm",
    gia_tri: "15",
    ngay_bat_dau: "2024-10-01",
    ngay_ket_thuc: "2024-10-31",
    trang_thai: "Đang hoạt động",
    dieu_kien_ap_dung: "Đơn hàng từ 1,000,000 VND",
    so_luot_su_dung: 25,
    gioi_han_su_dung: 75,
  },
  {
    key: "4",
    ten_khuyen_mai: "Giảm 50k cho đơn hàng từ 500k",
    loai_khuyen_mai: "Giảm giá tiền mặt",
    gia_tri: 50000,
    ngay_bat_dau: "2024-07-01",
    ngay_ket_thuc: "2024-07-31",
    trang_thai: "Đang hoạt động",
    dieu_kien_ap_dung: "Đơn hàng từ 500,000 VND",
    so_luot_su_dung: 60,
    gioi_han_su_dung: 100,
  },
  {
    key: "5",
    ten_khuyen_mai: "Giảm giá 5% cho tất cả sản phẩm",
    loai_khuyen_mai: "Giảm giá phần trăm",
    gia_tri: "5",
    ngay_bat_dau: "2024-09-15",
    ngay_ket_thuc: "2024-09-30",
    trang_thai: "Đang hoạt động",
    dieu_kien_ap_dung: "Áp dụng cho tất cả sản phẩm",
    so_luot_su_dung: 120,
    gioi_han_su_dung: 300,
  },
  {
    key: "6",
    ten_khuyen_mai: "Giảm 100k cho đơn hàng từ 700k",
    loai_khuyen_mai: "Giảm giá tiền mặt",
    gia_tri: 100000,
    ngay_bat_dau: "2024-08-15",
    ngay_ket_thuc: "2024-09-15",
    trang_thai: "Đang hoạt động",
    dieu_kien_ap_dung: "Đơn hàng từ 700,000 VND",
    so_luot_su_dung: 80,
    gioi_han_su_dung: 150,
  },
  {
    key: "7",
    ten_khuyen_mai: "Tặng quà 50k cho đơn hàng từ 600k",
    loai_khuyen_mai: "Quà tặng",
    gia_tri: 50000,
    ngay_bat_dau: "2024-08-01",
    ngay_ket_thuc: "2024-09-01",
    trang_thai: "Đang hoạt động",
    dieu_kien_ap_dung: "Đơn hàng từ 600,000 VND",
    so_luot_su_dung: 70,
    gioi_han_su_dung: 100,
  },
  {
    key: "8",
    ten_khuyen_mai: "Giảm giá 20% cho đơn hàng trên 2 triệu",
    loai_khuyen_mai: "Giảm giá phần trăm",
    gia_tri: "20",
    ngay_bat_dau: "2024-09-01",
    ngay_ket_thuc: "2024-10-01",
    trang_thai: "Đang hoạt động",
    dieu_kien_ap_dung: "Đơn hàng từ 2,000,000 VND",
    so_luot_su_dung: 90,
    gioi_han_su_dung: 200,
  },];

type DataIndex = keyof PromotionType;

const PromotionAdmin: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<DataIndex | "">("");
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
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
      title: "STT",
      key: "index",
      render: (_, __, index) => index + 1,
      width: "3%",
    },
    {
      title: "Tên khuyến mãi",
      dataIndex: "ten_khuyen_mai",
      key: "ten_khuyen_mai",
      width: "15%",
      ...getColumnSearchProps("ten_khuyen_mai"),
      sorter: (a: any, b: any) => a.ten_khuyen_mai.length - b.ten_khuyen_mai.length,
    },
    {
      title: "Loại khuyến mãi",
      dataIndex: "loai_khuyen_mai",
      key: "loai_khuyen_mai",
      width: "15%",
    },
    {
      title: "Giá trị",
      dataIndex: "gia_tri",
      key: "gia_tri",
      width: "15%",
      render: (gia_tri: number | string) =>
        typeof gia_tri === "number" ? `${gia_tri.toLocaleString()} VND` : `${gia_tri}%`,
      sorter: (a: any, b: any) => a.gia_tri - b.gia_tri,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "ngay_bat_dau",
      key: "ngay_bat_dau",
      width: "15%",
      ...getColumnSearchProps("ngay_bat_dau"),
      sorter: (a: any, b: any) => a.ngay_bat_dau - b.ngay_bat_dau,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "ngay_ket_thuc",
      key: "ngay_ket_thuc",
      width: "15%",
      ...getColumnSearchProps("ngay_ket_thuc"),
      sorter: (a: any, b: any) => a.ngay_ket_thuc - b.ngay_ket_thuc,
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      width: "10%",
      render: (trang_thai: string) => {
        let color: string;
  
        switch (trang_thai) {
          case 'Đang hoạt động':
            color = 'green';
            break;
          case 'Đã kết thúc':
            color = 'volcano';
            break;
          default:
            color = 'default';
            break;
        }
  
        return (
          <Tag color={color} style={{ border: 'none', padding: '2', borderRadius: '4px' }}>
            {trang_thai.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Điều kiện áp dụng",
      dataIndex: "dieu_kien_ap_dung",
      key: "dieu_kien_ap_dung",
      width: "20%",
      ...getColumnSearchProps("dieu_kien_ap_dung"),
      sorter: (a: any, b: any) => a.dieu_kien_ap_dung.length - b.dieu_kien_ap_dung.length,
    },
    {
      title: "Quản trị",
      key: "action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Chuyển vào thùng rác"
            description="Bạn có chắc chắn muốn xóa không?"
            okText="Có"
            cancelText="Không"
          >
            <Button className="bg-white text-red-500 border border-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 shadow-md transition-colors">
              Xóa
            </Button>
          </Popconfirm>
          <Button className="bg-white text-orange-600 border border-orange-500 rounded-lg hover:bg-orange-50 hover:text-orange-600 shadow-md transition-colors">
            Cập nhật
          </Button>
        </Space>
      ),
    },
  ];

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRowKeys(promotions.map(p => p.key));
    } else {
      setSelectedRowKeys([]);
    }
  };

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

  function handleKeyDown(_event: KeyboardEvent<HTMLInputElement>): void {
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
              <PlusCircleOutlined /> Thêm khuyến mãi
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
