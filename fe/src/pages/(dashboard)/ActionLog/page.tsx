import instance from "@/configs/admin";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Col, DatePicker, Input, Space, Table } from "antd";
import { useState } from "react";
import Banner from "./banner";
import ProfileBanner from "../adminProfile/profile/ProfileBanner";
import { useLocalStorage } from "@/components/hook/useStoratge";
const { RangePicker } = DatePicker;
export function ActionLog() {
  const formatMoTa = (data: any) => {
    const capNhat = `Cập nhật bản ghi trong bảng < san_phams >:`;
    const luotXem = `luot_xem: <${data.luot_xem_before}> thành <${data.luot_xem_after}>`;

    // Lấy mô tả đầu tiên trong danh sách đánh giá
    const danhGia = data.danhGias?.[0]?.mo_ta || "Không có mô tả chi tiết";

    return `${capNhat} ${luotXem}, Mô tả: ${danhGia}`;
  };
  const { data: lichsu } = useQuery({
    queryKey: ["actionLog"],
    queryFn: async () => {
      const response = await instance.get("lich-su-hoat-dong");

      return response.data;
    },
  });
  console.log(lichsu);
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
    quyens: "Phân quyền truy cập",
    vai_tros: "Cấp Vai trò",
  };

  // console.log(lichsu);
  const datas = lichsu?.map((item: any, index: number) => {
    const dateObj = new Date(item?.created_at);
    const vnTime = new Date(dateObj.getTime());
    const date = vnTime.toISOString().split("T")[0];
    const [year, month, day] = date.split("-");
    const reversedDate = `${day}/${month}/${year}`;
    const time = vnTime.toISOString().split("T")[1].split(".")[0];
    // console.log("item", reversedDate);
    return {
      key: index + 1,
      ten_bang: tableNamesWithAccents[item?.ten_bang] || item?.ten_bang,
      hanh_dong: item?.loai_thao_tac,
      anh: item?.anh_nguoi_dung,
      email: item?.email,
      thoi_gian: reversedDate + " " + time,
      timedate: item?.created_at,
      ten_vai_tro: item?.ten_vai_tro,
      nhanvien: item.ho + " " + item?.ten,
      mo_ta: item?.mo_ta,
      dia_chi_ip: item?.dia_chi_ip,
    };
  });

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
      className: "w-[20%] ",

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
      className: "w-[12%]",
      key: "ten_bang",
    },
    {
      title: "Chức vụ",
      // className: "w-[10%]",
      dataIndex: "ten_vai_tro",
      render: (text: any) => {
        return (
          <div>
            <p
              className={` text-center text-white rounded-md font-bold px-2 my-auto ${text === "Quản trị viên" ? "bg-green-500" : text === "Khách hàng" ? "bg-red-700" : "bg-yellow-500"}`}
            >
              {" "}
              {text}
            </p>
          </div>
        );
      },
      className: "w-[10%]",
      key: "hanh_dong",
    },
    {
      title: "Thời gian",
      dataIndex: "thoi_gian",
      className: "w-[15%]",
      key: "thoi_gian",
    },

    {
      title: "Mô tả chi tiết",
      dataIndex: "mo_ta",
      key: "mo_ta",
      width: "30%",
      render: (_, record: any) => <span>{formatMoTa(record)}</span>,
    },
    {
      title: "Địa chỉ IP",
      dataIndex: "dia_chi_ip",
      key: "dia_chi_ip",
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
  const [filteredData, setFilteredData] = useState(datas);
  // console.log("datas", filteredData);
  const handleDateChange = (_e: any, dateStrings: [string, string]) => {
    const startDate = new Date(dateStrings[0]);
    startDate.setHours(0, 0, 0, 0);
    // console.log("startDate", startDate);

    const endDate = new Date(dateStrings[1]);
    endDate.setHours(23, 59, 59, 999); // Đặt endDate đến cuối ngày
    // console.log("endDate", endDate);

    const filtered = datas?.filter((record: any) => {
      const recordDate = new Date(record?.timedate);
      recordDate.setHours(0, 0, 0, 0); // Loại bỏ thời gian của recordDate
      // console.log("recordDate", recordDate);

      return recordDate >= startDate && recordDate <= endDate;
    });

    setFilteredData(filtered || []);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value) {
      const filtered = datas?.filter((item: any) => {
        // Kiểm tra nếu các trường tồn tại trước khi gọi toLowerCase
        // const key = item.key?.toNumber().toLowerCase();
        const ten_bang = item.ten_bang?.toLowerCase();
        const hanh_dong = item.hanh_dong?.toLowerCase();
        const email = item.email?.toLowerCase();
        const nhanvien = item.nhanvien?.toLowerCase();
        const mo_ta = item.mo_ta?.toLowerCase();
        const dia_chi_ip = item.dia_chi_ip?.toLowerCase();
        const thoi_gian = item.thoi_gian?.toLowerCase();

        return (
          // key?.includes(value.toLowerCase()) ||
          ten_bang?.includes(value.toLowerCase()) ||
          hanh_dong?.includes(value.toLowerCase()) ||
          email?.includes(value.toLowerCase()) ||
          nhanvien?.includes(value.toLowerCase()) ||
          mo_ta?.includes(value.toLowerCase()) ||
          dia_chi_ip?.includes(value.toLowerCase()) ||
          thoi_gian?.includes(value.toLowerCase())
        );
      });
      setFilteredData(filtered || datas);
    } else {
      // Reset về dữ liệu gốc khi không có giá trị tìm kiếm
      if (datas) setFilteredData(datas);
    }
  };
  const [user] = useLocalStorage("user" as any, {});
  const id = user?.user?.id;
  const { data } = useQuery({
    queryKey: ["taikhoanid", id],
    queryFn: async () => {
      try {
        const res = await instance.get(`/taikhoan/${id}`);
        return res.data;
      } catch (error) {
        throw error;
      }
    },
  });

  const profile = data?.data;
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Col span={24} className="w-full">
          <ProfileBanner profile={profile} />
        </Col>

        <div className="max-w-8xl bg-white rounded-md p-5">
          <div className="flex items-center justify-between">
            <h1 className=" font-semibold md:text-2xl px-2">
              Nhật ký truy cập{" "}
            </h1>
            <div>
              <div className="text-gray-500 mb-2">
                {" "}
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
          </div>
          <div className="shadow-md shadow-slate-400 border-t rounded-lg">
            <Table
              columns={columns}
              dataSource={filteredData ? filteredData : datas}
              pagination={{ className: "my-5" }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
