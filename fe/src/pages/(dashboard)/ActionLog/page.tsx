import { Col, Table, Tag } from "antd";
import ProfileBanner from "../adminProfile/profile/ProfileBanner";
import Banner from "./banner";

// Dữ liệu mẫu cho bảng
const data = [
  {
    key: "1",
    name: "Nguyễn Văn A",
    email: "a@example.com",
    loginTime: "2024-10-10 10:30",
    status: "Đã đăng nhập",
  },
  {
    key: "2",
    name: "Trần Thị B",
    email: "b@example.com",
    loginTime: "2024-10-11 09:15",
    status: "Đã đăng nhập",
  },
  {
    key: "3",
    name: "Lê Văn C",
    email: "c@example.com",
    loginTime: "2024-10-11 08:45",
    status: "Đã đăng xuất",
  },
];

// Cột cho bảng
const columns = [
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Thời gian đăng nhập",
    dataIndex: "loginTime",
    key: "loginTime",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (text: any) => {
      let color = text === "Đã đăng nhập" ? "green" : "volcano";
      return (
        <Tag color={color} key={text}>
          {text}
        </Tag>
      );
    },
  },
];
// type SelectCommonPlacement = SelectProps["placement"];
export function ActionLog() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Col span={24} className="w-full">
          <Banner />
        </Col>

        <div className="max-w-8xl bg-white rounded-md p-5">
          <div className="flex items-center">
            <h1 className=" font-semibold md:text-2xl px-2">
              Nhật ký truy cập{" "}
            </h1>
          </div>
          <div className="shadow-md shadow-slate-400 border-t rounded-lg">
            <Table columns={columns} dataSource={data} />
          </div>
        </div>
      </main>
      {/* <Chart3 /> */}
      {/* <Chart4 /> */}
    </div>
  );
}
