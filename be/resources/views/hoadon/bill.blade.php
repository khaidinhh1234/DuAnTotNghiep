<!doctype html>
<html lang="vi">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }

        .shipping-label {
            max-width: 700px;
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin: auto;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ddd;
            padding-bottom: 20px;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .logo-img {
            width: 80px;
        }

        .header-title {
            font-size: 30px;
            color: #000;
            font-weight: bold;
        }

        .barcode-section {
            text-align: right;
        }

        .tracking-code,
        .order-id {
            font-size: 16px;
            margin: 5px 0;
        }

        .info {
            display: flex;
            justify-content: space-between;
            margin-top: 10px 0;
        }

        .sender,
        .receiver {
            width: 48%;
        }

        .sender h3,
        .receiver h3 {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .details {
            background: #f9f9f9;
            padding: 5px 15px;
            border: 1px dashed #ddd;
            margin-bottom: 20px;
        }

        .details h2 {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .summary {
            display: flex;
            justify-content: space-between;
            align-items: start;
            background: #f9f9f9;
            padding: 0px 10px;
            border: 1px solid #ddd;
            margin-bottom: 10px;
        }

        .weight {
            font-size: 14px;
        }

        .price {
            text-align: left;
        }

        .price h3 {
            font-size: 20px;
            color: #000;
        }

        .footer {
            font-size: 12px;
            color: #888;
        }

        .delivery-note {
            margin-bottom: 5px;
        }

        .recruitment {
            color: #ff5722;
            font-weight: bold;
            text-align: center;
        }

        .flexas {
            display: grid;
            grid-template-columns: 2fr 1fr;
        }

        .madon {
            border: 2px dashed #000;
            /* Màu đen và nét đứt */
            text-align: center;
            /* Căn giữa nội dung */
            border-radius: 8px;
            /* Bo góc (tuỳ chọn) */
            padding: 5px;
            /* Khoảng cách giữa viền và nội dung */
            font-size: 30px;
            /* Cỡ chữ */
        }

        .datetime {
            text-align: center;
            font-size: 25px;
            font-weight: bold;
        }

        .tien {
            font-size: 30px;
            color: #ff5722;
            padding: 0 10px;
        }

        .details1 {
            display: flex;
            background: #f9f9f9;
            padding: 5px 15px;
            border: 1px dashed #ddd;
            margin-bottom: 20px;
            flex-direction: column;
        }

        .footer-text {
            margin-top: auto;
            width: 100%;

            font-size: 12px;
            color: #555;
        }

        .xacnhan {
            font-size: 15px;
            font-weight: bold;
            text-align: center;
            color: #000;
            margin-right: 10px;
            margin-top: 10px;
        }

        .nguyen {
            font-size: 12px;
            font-weight: normal;
            color: #000;
        }

        .tieb {
            padding-top: 10px;
            margin-left: 5px;
        }
    </style>
</head>

<body>
    <div class="shipping-label">
        <div class="header">
            <div class="logo">
                <img src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1729398683/Black_and_White_Circle_Business_Logo_1_ieyoum.png"
                    alt="Shopee Logo" class="logo-img" />
                <h1 class="header-title">Glow Express</h1>
            </div>
            <div class="barcode-section">
                <div class="barcode"></div>
                <p class="tracking-code">
                    Mã vận đơn: <strong>{{ $hoaDon->vanChuyen->ma_van_chuyen }}</strong>
                </p>
                <p class="order-id">Mã đơn hàng: <strong>{{ $hoaDon['ma_don_hang'] }}</strong></p>
            </div>
        </div>

        <div class="info">
            <div class="sender">
                <h3>Thông tin Người Bán:</h3>
                <p>{{ $thongTinWeb->ten_website }}</p>
                <p>{{ $thongTinWeb->dia_chi }}</p>
                <p>SĐT: {{ $thongTinWeb->so_dien_thoai_dat_hang }}</p>
            </div>
            <div class="receiver">
                <h3>Thông tin Người Mua</h3>
                <p>{{ $hoaDon['ten_nguoi_dat_hang'] }}</p>

                <p>{{ $hoaDon['so_dien_thoai_nguoi_dat_hang'] }}</p>

                <p>{{ $hoaDon['dia_chi_nguoi_dat_hang'] }}</p>
            </div>
        </div>
        <div>
            @php
                function generateRandomCode()
                {
                    // Sinh hai chữ cái đầu ngẫu nhiên (HC)
                    $prefix = strtoupper(Str::random(2));

                    // Sinh hai số ngẫu nhiên (51)
                    $randomNumber1 = str_pad(rand(0, 99), 2, '0', STR_PAD_LEFT);

                    // Sinh hai số ngẫu nhiên tiếp theo (03)
                    $randomNumber2 = str_pad(rand(0, 99), 2, '0', STR_PAD_LEFT);

                    // Sinh chữ và số ngẫu nhiên (GV13)
                    $suffix = strtoupper(Str::random(2)) . rand(10, 99);

                    // Ghép thành chuỗi
                    return "{$prefix}-{$randomNumber1}-{$randomNumber2}-{$suffix}";
                }
            @endphp
            <h2 class="madon">@php
                $generatedCode = generateRandomCode();
                echo $generatedCode;
            @endphp</h2>
        </div>
        <div class="flexas">
            <div class="details1">
                <h3>Nội dung hàng:</h3>
                <ol>
                    @foreach ($hoaDon->chiTiets as $item)
                        <li>{{ $item->bienTheSanPham->sanPham->ten_san_pham }}-{{ $item->bienTheSanPham->mauBienThe->ten_mau_sac }}-{{ $item->bienTheSanPham->kichThuocBienThe->kich_thuoc }}/{{ $item->bienTheSanPham->kichThuocBienThe->loai_kich_thuoc }}
                            SL: {{ $item->so_luong }}</li>
                    @endforeach
                </ol>
                <p class="footer-text">
                    Kiểm tra tên sản phẩm và đối chiếu, Mã vận chuyển/mã đơn hàng trên
                    ứng dụng Glow Clowthing trước khi nhận hàng (Lưu ý: Một số sản phẩm
                    có thể bị ẩn do danh sách quá dài).
                </p>
            </div>

            <div class="details">
                <h3>Ngày đặt hàng:</h3>
                <p class="datetime">
                    {{ $hoaDon->created_at->format('d/m/Y') }} <br />
                    {{ $hoaDon->created_at->format('H:i') }}
                </p>
            </div>
        </div>
        <div class="summary">
            <div class="tieb">
                <span class="xacnhan">Tiền thu Người nhận:</span>
                <h1 class="tien">{{ number_format($hoaDon->tong_tien_don_hang, 0, ',', '.') }} VND</h1>
            </div>
            <div class="xacnhan">
                <span>Chữ ký Người nhận:</span><br />
                <span class="nguyen">Xác nhận nguyên vẹn , không móp méo , bể/vỡ</span>
            </div>
        </div>

        <div class="footer">
            <p class="delivery-note">
                Chỉ dẫn giao hàng: Không đồng kiểm; Chuyển hoàn sau 3 lần phát...
            </p>
            <p class="recruitment">
                Tuyển dụng Tài xế/Điều phối kho {{ $thongTinWeb->ten_website }} - Thu nhập 8-20 triệu - Gọi
                {{ $thongTinWeb->so_dien_thoai_dat_hang }}
            </p>
        </div>
    </div>

</body>

</html>
