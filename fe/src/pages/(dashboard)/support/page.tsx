import instance from "@/configs/admin";
import { SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Input,
  InputRef,
  message,
  Modal,
  Space,
  Table,
  TableColumnsType,
  Tabs,
} from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
const { Search } = Input;
type DataIndex = keyof Support;
interface Support {
  id: string | number;
  user_id: string | number;
  name: string;
  sdt_lien_he: number;
  email: string;
  noi_dung_lien_he: string;
  trang_thai_lien_he: string;
  created_at: string;
  user: {
    ho: string;
    ten: string;
  };
}
const datas = [
  { value: "1", label: "Chưa xử lý" },
  { value: "2", label: "Đã xử lý" },
];

const PageSupport: React.FC = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvaluate, setCurrentEvaluate] = useState<any | null>(null);
  const [phan_hoi, setphan_hoi] = useState<{ [key: number]: string }>({});
  const [filteredData, setFilteredData] = useState<Support[]>([]);

  // console.log('phan_hoi', phan_hoi);
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("Tất cả");
  const searchInput = useRef<InputRef>(null);
  const { data } = useQuery({
    queryKey: ["phanhoilienhe"],
    queryFn: async () => {
      const res = await instance.get(`/lien-he`);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async ({
      id,
      phan_hoi,
    }: {
      id: number | string;
      phan_hoi: string;
    }) => {
      // console.log(phan_hoi,'sưefsefd');
      const response = await instance.put(`/lien-he/${id}`, {
        noi_dung_phan_hoi: phan_hoi,
      });
      return response.data;
    },
    onSuccess: () => {
      message.success("Phản hồi thành công");
      queryClient.invalidateQueries({ queryKey: ["phanhoilienhe"] });
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });
  const showDetail = (record: Support) => {
    console.log("record", record);
    setCurrentEvaluate(record);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    if (currentEvaluate && phan_hoi[currentEvaluate.id as number]) {
      mutation.mutate({
        id: currentEvaluate.id,
        phan_hoi: phan_hoi[currentEvaluate.id as number],
      });
    }
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // lấy trạng thái
  const support: Support[] | undefined = data?.data;
  useEffect(() => {
    if (support) {
      if (activeTab === "Tất cả") {
        setFilteredData(support);
      } else {
        const filtered = support.filter(
          (item) => item.trang_thai_lien_he === activeTab
        );
        setFilteredData(filtered);
      }
    }
  }, [support, activeTab]);

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

  const getColumnSearchProps = (dataIndex: DataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
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
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: any) =>
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
  useEffect(() => {
    if (support) {
      if (activeTab === "Tất cả") {
        setFilteredData(support);
      } else {
        const filtered = support.filter(
          (item) => item.trang_thai_lien_he === activeTab
        );
        setFilteredData(filtered);
      }
    }
  }, [support, activeTab]);

  const dataSource = filteredData.map((support: Support, index: number) => ({
    key: support.id,
    ...support,
    index: index + 1,
    user_id: `${support?.user?.ho} ${support?.user?.ten}` || "Chưa có dữ liệu",
  }));

  const columns: TableColumnsType<Support> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "id",
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      width: "15%",
      ...getColumnSearchProps("name"),
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      render: (text) => (text ? text : "Chưa có dữ liệu"),
    },
    {
      title: "Thông tin liên hệ",
      dataIndex: "",
      key: "thong_tin_lien_he",
      render: (text: { email: string; sdt_lien_he: string }) => (
        <div>
          <div>
            <strong>Email</strong>:{" "}
            <a href={`mailto:${text.email}`}>{text.email}</a>
          </div>
          {/* <div>
            <strong>Số điện thoại</strong>:{" "}
            <a href={`tel:${text.sdt_lien_he}`}>{text.sdt_lien_he}</a>
          </div> */}
        </div>
      ),
    },
    // {
    //   title: 'Nội dung',
    //   dataIndex: 'noi_dung_lien_he',
    //   key: 'noi_dung_lien_he',
    //   width: '30%',
    //   render: (text: string) => (
    //     <span>
    //       {text.length > 100 ? `${text.substring(0, 100)}...` : text}
    //     </span>
    //   ),
    // },

    {
      title: "Trạng thái",
      dataIndex: "trang_thai_lien_he",
      key: "trang_thai_lien_he",
      render: (_, record) => {
        return (
          <div
            className={
              "font-bold text-[15px] " +
              (record.trang_thai_lien_he === "da_xu_ly"
                ? "text-green-500"
                : record.trang_thai_lien_he === "chua_xu_ly"
                  ? "text-yellow-500"
                  : "")
            }
          >
            {record.trang_thai_lien_he === "da_xu_ly"
              ? "Đã xử lý"
              : record.trang_thai_lien_he === "chua_xu_ly"
                ? "Chưa xử lý"
                : ""}
          </div>
        );
      },
    },
    {
      title: "Thời gian",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at: string) =>
        dayjs(created_at).format("DD/MM/YYYY HH:mm") || "Không có dữ liệu",
    },
    {
      title: "Quản trị",
      key: "action",
      render: (_, record: Support) => (
        <Space>
          <Button
            className="bg-gradient-to-r from-blue-500 to-blue-400 text-white hover:bg-blue-600 shadow-md"
            onClick={() => showDetail(record)}
            type="link"
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];
  useEffect(() => {
    // Simulate a data fetch
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);
  const tabItems = [
    { label: "Tất cả", key: "Tất cả" },
    { label: "Chưa xử lý", key: "chua_xu_ly" }, // Sử dụng giá trị 'chua_xu_ly' từ dữ liệu thực tế
    { label: "Đã xử lý", key: "da_xu_ly" }, // Sử dụng giá trị 'da_xu_ly' từ dữ liệu thực tế
  ];
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="md:text-base">
          Quản trị /{" "}
          <span className="font-semibold px-px">Liên hệ khách hàng</span>
        </h1>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold md:text-3xl">Liên hệ khách hàng</h1>
      </div>
      <Tabs
        defaultActiveKey="Tất cả"
        activeKey={activeTab}
        onChange={(key: any) => setActiveTab(key)}
        items={tabItems}
      />
      <Search
        placeholder="Tìm kiếm"
        onSearch={(value) => console.log(value)}
        style={{ width: 300, marginBottom: 20 }}
      />

      {/* Table */}
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
        loading={isLoading}
      />
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        width={800}
        footer={[
          <button
            key="cancel"
            onClick={handleCancel}
            className="bg-gray-300 text-black px-4 py-2 mr-2 rounded hover:bg-gray-400"
          >
            Hủy
          </button>,
          <button
            key="ok"
            onClick={handleOk}
            disabled={currentEvaluate?.trang_thai_lien_he === "da_xu_ly"}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600  ${currentEvaluate?.trang_thai_lien_he === "da_xu_ly" ? "cursor-not-allowed" : ""}`}
          >
            Gửi{" "}
          </button>,
        ]}
      >
        <h1 className="text-3xl font-bold">Chi tiết nội dung liên hệ</h1>
        {currentEvaluate && (
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3 flex flex-col items-center">
              <img
                src="https://i.pinimg.com/originals/f3/d1/ed/f3d1edf10d63c40e1fa06364176fa502.png"
                alt="User Avatar"
                width={150}
              />
              <p className="mt-2 text-center font-bold">
                {`${currentEvaluate.name}`}
              </p>
            </div>

            <div className="col-span-9">
              <p>
                <strong>Thông tin người liên hệ:</strong>{" "}
                {/* spell-checker: disable-line */}
                <div>
                  <strong>Email</strong>:{" "}
                  <a href={`mailto:${currentEvaluate.email}`}>
                    {currentEvaluate.email}
                  </a>
                </div>
                <div>
                  <strong>Số điện thoại</strong>:{" "}
                  <a href={`tel:${currentEvaluate.sdt_lien_he}`}>
                    {currentEvaluate.sdt_lien_he || "Chưa có dữ liệu"}
                  </a>
                </div>{" "}
                {/* spell-checker: disable-line */}
              </p>
              <p className="mb-20">
                <strong>Nội dung liên hệ: </strong>{" "}
                {currentEvaluate.noi_dung_lien_he}
              </p>{" "}
              {/* spell-checker: disable-line */}
              {/* Input for feedback */}
              <Input.TextArea
                rows={4}
                value={phan_hoi[currentEvaluate.id as number] || ""}
                onChange={(e) =>
                  setphan_hoi({
                    ...phan_hoi,
                    [currentEvaluate.id as number]: e.target.value,
                  })
                } // spell-checker: disable-line
                placeholder="Nhập phản hồi" //
                disabled={currentEvaluate.trang_thai_lien_he === "da_xu_ly"}
                className="mt-4 w-full max-w-full"
              />
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default PageSupport;
