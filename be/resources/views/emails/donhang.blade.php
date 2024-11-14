<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hóa Đơn Đặt Hàng - Cầu Vồng Sặc Sỡ</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/5.1.3/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f8f9fa;
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
        }

        .email-container {
            max-width: 700px;
            margin: auto;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }

        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eaeaea;
        }

        .header img {
            max-width: 80px;
        }

        h1 {
            font-size: 28px;
            margin-top: 15px;
            color: #007bff;
        }

        h2 {
            font-size: 22px;
            margin-top: 30px;
            color: #495057;
        }

        .table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
        }

        .table th,
        .table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eaeaea;
        }

        .table th {
            background-color: #f1f1f1;
            font-weight: bold;
            color: #333;
        }

        .product-image {
            width: 60px;
            height: auto;
            border-radius: 5px;
        }

        .summary {
            background-color: #f7f7f7;
            border-radius: 5px;
            padding: 20px;
            margin-top: 30px;
            text-align: center;
        }

        .highlight {
            font-weight: bold;
            color: #007bff;
        }

        .cta-button {
            display: inline-block;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
            transition: background-color 0.3s ease;
        }

        .cta-button:hover {
            background-color: #0056b3;
        }

        .footer {
            text-align: center;
            font-size: 14px;
            color: #666;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eaeaea;
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
            <th>Mã Đơn Hàng</th>
            <td class="highlight">{{ $donHang->ma_don_hang }}</td>
        </tr>
        <tr>
            <th>Tổng Tiền</th>
            <td class="highlight">{{ number_format($donHang->tong_tien_don_hang) }} VND</td>
        </tr>
        <tr>
            <th>Phương Thức Thanh Toán</th>
            <td>{{ $donHang->phuong_thuc_thanh_toan }}</td>
        </tr>
        <tr>
            <th>Trạng Thái Đơn Hàng</th>
            <td>{{ $donHang->trang_thai_don_hang }}</td>
        </tr>
        </tbody>
    </table>

    <h2>THÔNG TIN NGƯỜI ĐẶT HÀNG</h2>
    <table class="table">
        <tbody>
        <tr>
            <th>Tên</th>
            <td>{{ $donHang->ten_nguoi_dat_hang }}</td>
        </tr>
        <tr>
            <th>Email</th>
            <td>{{ $donHang->email_nguoi_dat_hang }}</td>
        </tr>
        <tr>
            <th>Số Điện Thoại</th>
            <td>{{ $donHang->so_dien_thoai_nguoi_dat_hang }}</td>
        </tr>
        <tr>
            <th>Địa Chỉ Giao Hàng</th>
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
        <p>Cảm ơn bạn đã đặt hàng tại chúng tôi!</p>
        <a href="http://localhost:5173/" class="cta-button">QUAY LẠI TRANG CHỦ</a>
    </div>
</div>
</body>

</html>
