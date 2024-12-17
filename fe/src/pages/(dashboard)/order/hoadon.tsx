import instance from "@/configs/admin";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const getDateAndTimeWithSeconds = (utcDate: any) => {
  const date = new Date(utcDate);

  // Lấy ngày, tháng và năm
  const day = date.getDate();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  // Lấy giờ, phút và giây gốc
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};
const Hoadon = ({ record, products, tong }: any) => {
  const [code, setCode] = useState("");
  console.log(record);
  const generateRandomCode = () => {
    const prefix = "HC";
    const middleNumbers = Math.floor(Math.random() * 90 + 10); // Số ngẫu nhiên từ 10 đến 99
    const suffixNumbers = Math.floor(Math.random() * 90 + 10); // Số ngẫu nhiên từ 10 đến 99
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetter1 = letters.charAt(
      Math.floor(Math.random() * letters.length)
    );
    const randomLetter2 = letters.charAt(
      Math.floor(Math.random() * letters.length)
    );
    const randomLetter3 = Math.floor(Math.random() * 90 + 10);

    return `${prefix}-${middleNumbers}-${suffixNumbers}-${randomLetter1}${randomLetter2}${randomLetter3}`;
  };
  const { data: bill } = useQuery({
    queryKey: ["SHIPPER"],
    queryFn: async () => {
      const response = await instance.get(`/donhang/${record.id}/bill`);
      return response.data;
    },
  });
  console.log("sdfhu", bill);

  const { data } = useQuery({
    queryKey: ["SHIPPER"],
    queryFn: async () => {
      const response = await instance.get(`/vanchuyen/${record.id}`);
      return response.data;
    },
  });

  const mavanchuyen = data?.data?.van_chuyen;
  console.log(mavanchuyen);
  useEffect(() => {
    const randomCode = generateRandomCode();
    setCode(randomCode);
  }, []);
  const result = getDateAndTimeWithSeconds(record.created_at);
  const handlePrint = () => {
    const content = document.getElementById("invoice-content");
    const win = window.open("", "", "width=700,height=900");
    if (content && win) {
      win.document.write(content.innerHTML);
      win.document.close();
      win.print();
    } else {
      console.error("Invoice content not found");
    }
  };
  return (
    <div
      className="flex flex-col items-center p-4 space-y-4"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <button
        onClick={handlePrint}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
      >
        In Hóa Đơn
      </button>

      <div
        id="invoice-content"
        className="hidden w-full max-w-4xl mx-auto bg-white p-6 border border-gray-200 shadow-lg rounded-lg"
      >
        <div
          style={{
            maxWidth: "700px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "20px",
            margin: "auto",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #ddd",
              paddingBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img
                src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729398683/Black_and_White_Circle_Business_Logo_1_ieyoum.png"
                alt="Shopee Logo"
                style={{ width: "80px" }}
              />
              <h1
                style={{
                  fontSize: "30px",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                Glow Express
              </h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ marginBottom: "10px" }}>/*************/</div>
              <p style={{ fontSize: "16px", margin: "5px 0" }}>
                Mã vận đơn: <strong>{mavanchuyen?.ma_van_chuyen}</strong>
              </p>
              <p style={{ fontSize: "16px", margin: "5px 0" }}>
                Mã đơn hàng: <strong>{record.ma_don_hang}</strong>
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <div style={{ width: "48%" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                Thông tin Người Bán:
              </h3>
              <p>Glow Clothing</p>
              <p>
                13 P. Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội, Việt Nam
              </p>
              <p>SĐT: 0342278284</p>
            </div>
            <div style={{ width: "48%" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                Thông tin Người Mua
              </h3>
              <p>
                {record?.ten_nguoi_dat_hang ??
                  record?.user?.ho + record?.user?.ten}
              </p>
              <p>
                {record?.so_dien_thoai_nguoi_dat_hang ??
                  record?.user?.so_dien_thoai}
              </p>
              <p>{record?.dia_chi_nguoi_dat_hang ?? record?.user?.dia_chi}</p>
            </div>
          </div>

          <div>
            <h2
              style={{
                border: "2px dashed #000",
                textAlign: "center",
                borderRadius: "8px",
                padding: "5px",
                fontSize: "30px",
              }}
            >
              {code}
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                background: "#f9f9f9",
                padding: "5px 15px",
                border: "1px dashed #ddd",
                marginBottom: "20px",
              }}
            >
              <h3>Nội dung hàng:</h3>{" "}
              <ol>
                {products?.slice(0, 3).map((item: any) => (
                  <li key={item?.id}>
                    <span
                      style={{
                        display: "inline-block" /* Để áp dụng kích thước */,
                        maxWidth: "300px" /* Giới hạn độ rộng */,
                        whiteSpace: "nowrap" /* Không cho xuống dòng */,
                        overflow: "hidden" /* Ẩn phần nội dung thừa */,
                        textOverflow:
                          "ellipsis" /* Thêm dấu "..." khi quá dài */,
                      }}
                    >
                      {" "}
                      {item?.bien_the_san_pham?.san_pham?.ten_san_pham}
                    </span>{" "}
                    <p className="">
                      Màu :{" "}
                      <span>
                        {item?.bien_the_san_pham?.mau_bien_the?.ten_mau_sac}
                      </span>{" "}
                      - Size :{" "}
                      <span>
                        {" "}
                        {
                          item?.bien_the_san_pham?.kich_thuoc_bien_the
                            ?.kich_thuoc
                        }
                        /
                        {
                          item?.bien_the_san_pham?.kich_thuoc_bien_the
                            ?.loai_kich_thuoc
                        }
                      </span>
                      - SL: {item?.so_luong}
                    </p>{" "}
                  </li>
                ))}{" "}
                {products?.length > 3 &&
                  "........................................"}
              </ol>
              <p style={{ fontSize: "12px", color: "#555", marginTop: "auto" }}>
                Kiểm tra tên sản phẩm và đối chiếu, Mã vận chuyển/mã đơn hàng
                trên ứng dụng Glow Clowthing trước khi nhận hàng (Lưu ý: Một số
                sản phẩm có thể bị ẩn do danh sách quá dài).
              </p>
            </div>
            <div
              style={{
                background: "#f9f9f9",
                padding: "5px 15px",
                border: "1px dashed #ddd",
                marginBottom: "20px",
              }}
            >
              <h3>Ngày đặt hàng:</h3>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "25px",
                  fontWeight: "bold",
                }}
              >
                {result}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              background: "#f9f9f9",
              padding: "10px",
              border: "1px solid #ddd",
              marginBottom: "10px",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  color: "#000",
                  marginRight: "10px",
                }}
              >
                Tiền thu Người nhận:
              </span>
              <h1
                style={{
                  fontSize: "30px",
                  color: "#ff5722",
                  padding: "0 10px",
                }}
              >
                {mavanchuyen?.tien_cod?.toLocaleString("vi-VN") ??
                  tong?.tong_tien?.toLocaleString("vi-VN") ??
                  0}{" "}
                VNĐ
              </h1>
            </div>
            <div>
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  color: "#000",
                  margin: "0px 40px",
                }}
              >
                Chữ ký Người nhận:
              </span>
              <br />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "normal",
                  color: "#000",
                }}
              >
                Xác nhận nguyên vẹn, không móp méo, bể/vỡ
              </span>
            </div>
          </div>

          <div style={{ fontSize: "12px", color: "#888" }}>
            <p>
              Chỉ dẫn giao hàng: Không đồng kiểm; Chuyển hoàn sau 3 lần phát...
            </p>
            <p
              style={{
                color: "#ff5722",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Tuyển dụng Tài xế/Điều phối kho SPX - Thu nhập 8-20 triệu - Gọi
              1900 6885
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hoadon;
