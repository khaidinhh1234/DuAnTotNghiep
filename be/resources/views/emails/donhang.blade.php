<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hóa Đơn Đặt Hàng - Cầu Vồng Sặc Sỡ</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/css/bootstrap.min.css">
    <style>
        body {
            background-color: #f8f9fa; /* Nền xám nhạt */
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333333; /* Chữ xám đậm */
            line-height: 1.6;
        }

        .email-container {
            max-width: 600px;
            margin: auto;
            background: #ffffff; /* Nền trắng */
            border: 1px solid #dddddd; /* Viền xám nhạt */
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            text-align: left;
        }

        .header {
            background-color: #343a40; /* Nền xám đậm */
            padding: 15px;
            text-align: center;
        }

        .header img {
            max-width: 100px;
            height: auto;
            margin-bottom: 5px;
        }

        h1 {
            font-size: 24px;
            margin-bottom: 5px;
            color: #ffffff; /* Chữ trắng */
        }

        h2 {
            font-size: 20px;
            color: #343a40; /* Chữ xám đậm */
            margin: 15px 0 10px;
            padding-bottom: 5px;
            border-bottom: 2px solid #dddddd; /* Viền xám nhạt */
        }

        .footer {
            text-align: center;
            font-size: 14px;
            color: #ffffff;
            padding: 15px;
            background-color: #343a40; /* Nền xám đậm */
            border-top: 1px solid #dddddd; /* Viền xám nhạt */
        }

        .table {
            border-collapse: collapse;
            margin: 15px 0;
            width: 100%;
            color: #333333; /* Chữ xám đậm */
        }

        .table th,
        .table td {
            vertical-align: middle;
            padding: 8px;
            border: 1px solid #dddddd; /* Viền xám nhạt */
            background-color: #ffffff; /* Nền trắng */
        }

        .table th {
            background-color: #f8f9fa; /* Nền xám nhạt */
            color: #343a40; /* Chữ xám đậm */
            font-weight: bold;
            text-transform: uppercase;
        }

        .product-image {
            width: 80px;
            height: auto;
            border: 1px solid #dddddd; /* Viền xám nhạt */
            border-radius: 5px;
        }

        .summary {
            background-color: #f8f9fa; /* Nền xám nhạt */
            border-radius: 5px;
            padding: 15px;
            margin-top: 20px;
            font-size: 18px;
            color: #333333; /* Chữ xám đậm */
        }

        .highlight {
            color: #dc3545; /* Màu đỏ */
            font-weight: bold;
        }

        .cta-button {
            display: inline-block;
            background-color: #007bff; /* Nền xanh dương */
            color: #ffffff; /* Chữ trắng */
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 15px;
            transition: background-color 0.3s;
            font-size: 16px;
            border: 1px solid #007bff; /* Viền xanh dương */
        }

        .cta-button:hover {
            background-color: #0056b3; /* Nền xanh dương đậm khi hover */
            color: #ffffff; /* Chữ trắng khi hover */
        }

        /* Responsive Design */
        @media (max-width: 600px) {
            .email-container {
                width: 100%;
                padding: 5px;
            }

            .header img {
                max-width: 80px;
            }

            h1 {
                font-size: 28px;
            }

            h2 {
                font-size: 24px;
            }
        }
    </style>
</head>

<body>
<div class="email-container">
    <div class="header">
        <img src="https://res.cloudinary.com/dpundwxg1/image/upload/v1732433902/image-removebg-preview_nce4uq.png" alt="Logo Công Ty" style="background: none;">
        <h1>HÓA ĐƠN ĐẶT HÀNG</h1>
    </div>

    <h2>THÔNG TIN ĐƠN HÀNG</h2>
    <table class="table">
        <tbody>
        <tr>
            <th scope="row">Mã Đơn Hàng</th>
            <td class="highlight">{{ $donHang->ma_don_hang }}</td>
        </tr>
        <tr>
            <th scope="row">Tổng Tiền</th>
            <td class="highlight">{{ number_format($donHang->tong_tien_don_hang) }} VND</td>
        </tr>
        <tr>
            <th scope="row">Phương Thức Thanh Toán</th>
            <td>{{ $donHang->phuong_thuc_thanh_toan }}</td>
        </tr>
        <tr>
            <th scope="row">Trạng Thái Đơn Hàng</th>
            <td>{{ $donHang->trang_thai_don_hang }}</td>
        </tr>
        </tbody>
    </table>

    <h2>THÔNG TIN NGƯỜI ĐẶT HÀNG</h2>
    <table class="table">
        <tbody>
        <tr>
            <th scope="row">Tên</th>
            <td>{{ $donHang->ten_nguoi_dat_hang }}</td>
        </tr>
        <tr>
            <th scope="row">Email</th>
            <td>{{ $donHang->email_nguoi_dat_hang }}</td>
        </tr>
        <tr>
            <th scope="row">Số Điện Thoại</th>
            <td>{{ $donHang->so_dien_thoai_nguoi_dat_hang }}</td>
        </tr>
        <tr>
            <th scope="row">Địa Chỉ Giao Hàng</th>
            <td>{{ $donHang->dia_chi_nguoi_dat_hang }}</td>
        </tr>
        </tbody>
    </table>

    <h2>CHI TIẾT SẢN PHẨM</h2>
    <table class="table">
        <thead>
        <tr>
            <th>Ảnh</th>
            <th>Tên Sản Phẩm</th>
            <th>Màu Sắc</th>
            <th>Kích Thước</th>
            <th>Số Lượng</th>
            <th>Giá</th>
            <th>Thành Tiền</th>
        </tr>
        </thead>
        <tbody>
        @foreach($donHang->chiTiets as $chiTiet)
            <tr>
                <td>
                    <img src="{{ $chiTiet->bienTheSanPham->anhBienThe->pluck('duong_dan_anh')->first() }}" alt="{{ $chiTiet->bienTheSanPham->sanPham->ten_san_pham }}" class="product-image">
                </td>
                <td>{{ $chiTiet->bienTheSanPham->sanPham->ten_san_pham }}</td>
                <td>{{ $chiTiet->bienTheSanPham->mauBienThe->ten_mau_sac }}</td>
                <td>{{ $chiTiet->bienTheSanPham->kichThuocBienThe->kich_thuoc }}</td>
                <td>{{ $chiTiet->so_luong }}</td>
                <td>{{ number_format($chiTiet->gia) }} VND</td>
                <td>{{ number_format($chiTiet->thanh_tien) }} VND</td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <div class="summary">
        <h3>Tổng Kết Đơn Hàng</h3>
        <p><strong>Tổng Tiền Phải Trả:</strong> {{ number_format($donHang->tong_tien_don_hang) }} VND</p>
        <p><strong>Phương Thức Thanh Toán:</strong> {{ $donHang->phuong_thuc_thanh_toan }}</p>
    </div>

    <div class="footer">
        <p>Xin cảm ơn bạn đã đặt hàng tại chúng tôi!</p>
        <a href="http://localhost:5173/" class="cta-button">QUAY LẠI TRANG CHỦ</a>
    </div>
</div>
</body>

</html>
