import { Col, Table, Tag } from "antd";
import ProfileBanner from "../adminProfile/profile/ProfileBanner";
import Banner from "./banner";
import { useQuery } from "@tanstack/react-query";
import instance from "@/configs/admin";
export function ActionLog() {
  const { data: lichsu } = useQuery({
    queryKey: ["actionLog"],
    queryFn: async () => {
      const response = await instance.get("lich-su-hoat-dong");

      return response.data;
    },
  });
  const tableNamesWithAccents: { [key: string]: string } = {
    lien_hes: "Liên hệ",
    anh_bien_thes: "Ảnh biến thể",
    bien_the_san_phams: "Biến thể sản phẩm",
    san_phams: "Sản phẩm",
    danh_mucs: "Danh mục",
    don_hangs: "Đơn hàng",
    tai_khoans: "Tài khoản",
    danh_muc_tin_tucs: "Danh mục tin tức",
    tin_tucs: "Tin tức",
  };

  console.log(lichsu);

  const datas = lichsu?.map((item: any, index: number) => {
    const date = new Date(item?.created_at); // Chuyển đổi chuỗi thành đối tượng Date

    // Chuyển sang múi giờ Việt Nam (GMT+7)
    const vietnamTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return {
      key: index + 1,
      ten_bang: tableNamesWithAccents[item?.ten_bang] || item?.ten_bang,
      hanh_dong: item?.loai_thao_tac,
      anh: item?.user?.anh_nguoi_dung,
      email: item?.user?.email,
      thoi_gian: `${vietnamTime.toLocaleDateString()} ${vietnamTime.toLocaleTimeString()}`, // Định dạng theo ngày và giờ
      nhanvien: item?.user?.ho + " " + item?.user?.ten,
    };
  });
  // console.log(datas);
  // Dữ liệu mẫu cho bảng
  // const data = [
  //   {
  //     key: "1",
  //     name: "Nguyễn Văn A",
  //     hanh_dong: "xóa",
  //     loginTime: "2024-10-10 10:30",
  //     status:
  //       "Hướng dẫn quản lý kế toán dịch vụ xem lại lịch sử thao tác của nhân viên trên ASP: Biết được cụ thể",
  //   },
  //   {
  //     key: "2",
  //     name: "Trần Thị B",
  //     hanh_dong: "thêm",
  //     loginTime: "2024-10-11 09:15",
  //     status:
  //       "Hướng dẫn quản lý kế toán dịch vụ xem lại lịch sử thao tác của nhân viên trên ASP: Biết được cụ thể",
  //   },
  //   {
  //     key: "3",
  //     name: "Lê Văn C",
  //     hanh_dong: "cập nhật",
  //     loginTime: "2024-10-11 08:45",
  //     status:
  //       "Hướng dẫn quản lý kế toán dịch vụ xem lại lịch sử thao tác của nhân viên trên ASP: Biết được cụ thể",
  //   },
  // ];

  // Cột cho bảng
  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      className: "w-[5%]",
    },
    {
      title: "Tài khoản",

      key: "name",
      className: "w-[30%] ",

      render: (text: any) => {
        // console.log(text);
        return (
          <div className="flex items-center ">
            <img
              src={text?.anh ? text?.anh : "/images/avatar.jpg"}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-3">
              <div className="font-semibold">
                {text.nhanvien ? text.nhanvien : "không có"}
              </div>
              <div className="text-gray-500">
                <span className="font-semibold">Email :</span>
                <span className="ml-1">
                  <a href={`mailto: ${text.email ? text.email : "không có"}`}>
                    {text.email ? text.email : "không có"}
                  </a>
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Bảng thao tác",
      dataIndex: "ten_bang",
      className: "w-[10%]",
      key: "ten_bang",
    },
    {
      title: "Hành động",
      dataIndex: "hanh_dong",
      render: (text: any) => {
        let color =
          text === "Thêm mới" ? "green" : text === "Cập nhật" ? "blue" : "red";
        return (
          <Tag color={color} key={text}>
            {text}
          </Tag>
        );
      },
      className: "w-[15%]",
      key: "hanh_dong",
    },
    {
      title: "Thời gian",
      dataIndex: "thoi_gian",
      className: "w-[20%]",
      key: "thoi_gian",
    },

    {
      title: "Mô tả chi tiết",
      dataIndex: "status",
      key: "status",
    },
    // {
    //   title: "Trạng thái",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (text: any) => {
    //     let color = text === "Đã đăng nhập" ? "green" : "volcano";
    //     return (
    //       <Tag color={color} key={text}>
    //         {text}
    //       </Tag>
    //     );
    //   },
    // },
  ];
  // type SelectCommonPlacement = SelectProps["placement"];

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
            <Table
              columns={columns}
              dataSource={datas}
              pagination={{ pageSize: 10, className: "my-5" }}
            />
          </div>
        </div>
      </main>
      {/* <Chart3 /> */}
      {/* <Chart4 /> */}
    </div>
  );
}
