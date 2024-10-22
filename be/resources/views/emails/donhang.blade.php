<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận đơn hàng</title>
</head>
<body>
<h1>Xin chào {{ $donHang->ten_nguoi_dat_hang }},</h1>
<p>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi.</p>

<h2>Thông tin đơn hàng</h2>
<p>Mã đơn hàng: <strong>{{ $donHang->ma_don_hang }}</strong></p>
<p>Tổng tiền: <strong>{{ number_format($donHang->tong_tien_don_hang) }} VND</strong></p>
<p>Phương thức thanh toán: <strong>{{ $donHang->phuong_thuc_thanh_toan }}</strong></p>

<h2>Thông tin chi tiết sản phẩm</h2>
<ul>
    @foreach ($donHang->chiTietDonHang as $chiTiet)
        <li>
            Sản phẩm: {{ $chiTiet->bienTheSanPham->ten_san_pham }} <br>
            Biến thể: {{ $chiTiet->bienTheSanPham->thong_tin_bien_the }} <br>
            Số lượng: {{ $chiTiet->so_luong }} <br>
            Giá: {{ number_format($chiTiet->gia) }} VND <br>
            Thành tiền: {{ number_format($chiTiet->thanh_tien) }} VND
        </li>
    @endforeach
</ul>

<p>Chúng tôi sẽ liên hệ với bạn để xác nhận đơn hàng và giao hàng sớm nhất.</p>

<p>Trân trọng,</p>
<p>Cửa hàng của bạn</p>
</body>
</html>
