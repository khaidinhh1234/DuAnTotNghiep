import React, { useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Space, Table, DatePicker } from "antd";
import type { InputRef } from "antd";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import "@/global.css";
import type { TableColumnsType } from "antd";
import type { FilterConfirmProps, FilterDropdownProps } from "antd/es/table/interface";
import instance from "@/configs/admin";

const { RangePicker } = DatePicker;

interface DataType {
  id: number;
  ten_uu_dai: string;
  mo_ta: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  gia_tri_uu_dai: number;
  loai: string;
  duong_dan_anh: string;
  ngay_hien_thi: string;
  key?: number;
}

type DataIndex = keyof DataType;

interface ApiResponse {
  status: boolean;
  data: DataType[] | DataType;
  message?: string;
}

interface MutationResponse {
  status: boolean;
  message?: string;
}

const ChuongTrinhUuDaiRemote: React.FC = () => {
  const [searchedColumn, setSearchedColumn] = useState<DataIndex | ''>('');
  const [searchText, setSearchText] = useState<string>('');
  const searchInput = useRef<InputRef>(null);

  const { data, isLoading } = useQuery<ApiResponse>({
    queryKey: ["chuongtrinhuudai"],
    queryFn: async () => {
      const res = await instance.get("/chuongtrinhuudai/thung-rac");
      return res.data;
    },
  });

  const chuongTrinhUuDai = React.useMemo(() => {
    if (!data?.data) return [];
    const dataArray = Array.isArray(data.data) ? data.data : [data.data];
    return dataArray.map((item: DataType, index: number) => ({
      ...item,
      key: index,
    }));
  }, [data]);

  const queryClient = useQueryClient();

  const { mutate } = useMutation<number, Error, number>({
    mutationFn: async (id: number) => {
      const response = await instance.post<MutationResponse>(`/chuongtrinhuudai/thung-rac/${id}`);
      if (!response.data.status) {
        throw new Error(response.data.message || "Failed to restore");
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chuongtrinhuudai"] });
      message.success("Khôi phục thành công");
    },
    onError: () => {
      message.error("Khôi phục thất bại");
    },
  });

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ): void => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void): void => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm kiếm
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
    onFilter: (value: string, record: DataType) =>
      record[dataIndex].toString().toLowerCase().includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: string) =>
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

  const getDateColumnSearchProps = (dataIndex: DataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Space direction="vertical">
          <DatePicker
            placeholder={`Tìm ${dataIndex}`}
            value={selectedKeys[0] ? dayjs(selectedKeys[0]) : null}
            onChange={(date: Dayjs | null) => 
              setSelectedKeys(date ? [date.format('YYYY-MM-DD')] : [])
            }
            style={{ width: 200, marginBottom: 8 }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Tìm kiếm
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value: string, record: DataType) => {
      const targetDate = formatDate(record[dataIndex]);
      return targetDate === value;
    }
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "STT",
      key: "stt",
      render: (_, __, index) => index + 1,
      width: "5%",
    },
    {
      title: "Ảnh",
      width: "15%",
      key: "duong_dan_anh",
      dataIndex: "duong_dan_anh",
      render: (duong_dan_anh: string) =>
        duong_dan_anh ? (
          <img
            src={duong_dan_anh}
            alt="Ảnh danh mục"
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />
        ) : (
          <span>Ảnh không có</span>
        ),
    },
    {
      title: "Tên ưu đãi",
      dataIndex: "ten_uu_dai",
      key: "ten_uu_dai",
      ...getColumnSearchProps("ten_uu_dai"),
      sorter: (a: DataType, b: DataType) => a.ten_uu_dai.localeCompare(b.ten_uu_dai),
      width: "20%",
    },
    {
      title: "Mô tả",
      dataIndex: "mo_ta",
      key: "mo_ta",
      ...getColumnSearchProps("mo_ta"),
      width: "25%",
    },
    {
      title: "Ngày Hiển thị",
      dataIndex: "ngay_hien_thi",
      key: "ngay_hien_thi",
      render: (text: string) => formatDate(text),
      ...getDateColumnSearchProps("ngay_hien_thi"),
      sorter: (a: DataType, b: DataType) => 
        new Date(a.ngay_hien_thi).getTime() - new Date(b.ngay_hien_thi).getTime(),
      width: "15%",
    },
    {
      title: "Thời gian",
      key: "thoi_gian",
      render: (record: DataType) => 
        `${formatDate(record.ngay_bat_dau)} - ${formatDate(record.ngay_ket_thuc)}`,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }: FilterDropdownProps) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Space direction="vertical">
            <RangePicker
              onChange={(dates: [Dayjs, Dayjs] | null) => {
                if (dates) {
                  setSelectedKeys([dates.map(date => date.format('YYYY-MM-DD')).join(',')]);
                } else {
                  setSelectedKeys([]);
                }
              }}
              style={{ marginBottom: 8 }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => confirm()}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Tìm kiếm
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters)}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </Space>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onFilter: (value: string, record: DataType) => {
        if (!value) return true;
        const [startDate, endDate] = value.split(',');
        const recordStart = new Date(record.ngay_bat_dau);
        const recordEnd = new Date(record.ngay_ket_thuc);
        const filterStart = new Date(startDate);
        const filterEnd = new Date(endDate);
        return recordStart >= filterStart && recordEnd <= filterEnd;
      },
      width: "20%",
    },
    {
      title: "Giá trị ưu đãi",
      dataIndex: "gia_tri_uu_dai",
      key: "gia_tri_uu_dai",
      render: (value: number, record: DataType) => 
        `${value}${record.loai === 'phan_tram' ? '%' : ''}`,
      width: "10%",
    },
    {
      title: "Quản trị",
      key: "action",
      render: (_: unknown, record: DataType) => (
        <Space>
          <Button
            className="bg-gradient-to-l from-green-400 to-cyan-500 text-white hover:from-green-500 hover:to-cyan-500 border border-green-300 font-bold"
            onClick={() => mutate(record.id)}
          >
            Khôi phục
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị / Chương trình ưu đãi /{" "}
          <span className="font-semibold px-px">Thùng rác</span>
        </h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-semibold md:text-3xl">Thùng rác</h1>
        <div className="flex">
          <Link to="/admin/chuongtrinhuudai" className="mr-1">
            <Button className="bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-lg py-1 hover:bg-blue-600 shadow-md transition-colors">
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="max-w-full">
        <Table<DataType>
          columns={columns}
          dataSource={chuongTrinhUuDai}
          pagination={{ pageSize: 10, className: "my-5" }}
          rowKey="id"
          loading={isLoading}
        />
      </div>
    </main>
  );
};

export default ChuongTrinhUuDaiRemote;
