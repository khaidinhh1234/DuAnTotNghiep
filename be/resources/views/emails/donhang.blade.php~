<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hóa Đơn Đặt Hàng</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/css/bootstrap.min.css">
    <style>
        body {
            background-color: #ffcc00; /* Nền vàng chói */
            font-family: 'Comic Sans MS', cursive, sans-serif; /* Font chữ tệ */
            margin: 0;
            padding: 20px;
            color: #ff0000; /* Chữ đỏ */
            line-height: 1.6;
        }

        .email-container {
            max-width: 600px;
            margin: auto;
            background: #ff3300; /* Nền đỏ chói */
            border: 10px solid #00ff00; /* Viền xanh lá chói */
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            overflow: hidden;
            text-align: center;
        }

        .header {
            background-color: #000000; /* Nền đen */
            padding: 20px;
        }

        .header img {
            max-width: 150px;
            height: auto;
            margin-bottom: 10px;
        }

        h1 {
            font-size: 36px; /* Tiêu đề lớn */
            margin-bottom: 5px;
            color: #00ffcc; /* Màu xanh chói */
            text-shadow: 2px 2px 5px white; /* Đổ bóng màu trắng */
        }

        h2 {
            font-size: 30px; /* Tiêu đề phụ lớn */
            color: #ff00ff; /* Màu hồng chói */
            margin: 20px 0 10px;
            padding-bottom: 5px;
            border-bottom: 3px dotted #ffd700; /* Viền chấm vàng */
        }

        .footer {
            text-align: center;
            font-size: 14px;
            color: #cccccc;
            padding: 20px;
            background-color: #330033; /* Nền tím đậm */
            border-top: 5px solid #ff0000; /* Viền đỏ */
        }

        .table {
            border-collapse: collapse;
            margin: 20px 0;
            width: 100%;
            color: #ffffff; /* Chữ trắng */
        }

        .table th,
        .table td {
            vertical-align: middle;
            padding: 10px;
            border: 2px dashed #000000; /* Viền đen gạch */
            background-color: #ffcc00; /* Nền vàng */
        }

        .table th {
            background-color: #9900cc; /* Nền tím chói */
            color: #ffff00; /* Chữ vàng */
            font-weight: bold;
            text-transform: uppercase; /* Viết hoa tất cả */
        }

        .product-image {
            width: 80px;
            height: auto;
            border: 5px solid #00ff00; /* Viền xanh lá */
            border-radius: 5px;
        }

        .summary {
            background-color: #ff9999; /* Nền hồng nhạt */
            border-radius: 5px;
            padding: 20px;
            margin-top: 20px;
            font-size: 18px;
            color: #0000ff; /* Chữ xanh dương */
        }

        .highlight {
            color: #ff0000; /* Màu đỏ */
            font-weight: bold;
        }

        .cta-button {
            display: inline-block;
            background-color: #ff00cc; /* Nền hồng */
            color: #ffffff; /* Chữ trắng */
            text-decoration: none;
            padding: 15px 25px;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
            transition: background-color 0.3s;
            font-size: 18px; /* Chữ lớn */
            border: 3px solid #0000ff; /* Viền xanh dương */
        }

        .cta-button:hover {
            background-color: #ffcc00; /* Nền vàng khi hover */
            color: #000000; /* Chữ đen khi hover */
        }

        /* Responsive Design */
        @media (max-width: 600px) {
            .email-container {
                width: 100%;
                padding: 10px;
            }

            .header img {
                max-width: 120px;
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
        <img src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1726411972/Screenshot_2024-09-15_215232_d3dt3j.png" alt="Logo Công Ty">
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
