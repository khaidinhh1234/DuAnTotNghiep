<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lấy lại mã xác minh</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .email-container {
            width: 100%;
            max-width: 460px;
            margin: 0 auto;
            background-color: #fff;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header img {
            max-width: 100px;
        }

        .gif-container {
            text-align: center;
            margin: 20px 0;
        }

        .gif-container img {
            max-width: 60px;
            height: auto;
        }

        .gif-credit {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin: 10px 0;
        }

        .gif-credit a {
            color: #0073e6;
            text-decoration: none;
        }

        .content {
            text-align: center;
        }

        .content h2 {
            font-size: 18px;
            margin: 10px 0;
        }

        .content p {
            font-size: 14px;
            margin-bottom: 15px;
        }

        .otp-boxes {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
        }

        .otp-box {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: black;
            font-weight: bold;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        .footer {
            font-size: 11px;
            color: #666;
            text-align: center;
            padding: 10px;
            border-top: 1px solid #ddd;
            margin-top: 20px;
        }

        .footer a {
            color: #0073e6;
            text-decoration: none;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <img src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1726411972/Screenshot_2024-09-15_215232_d3dt3j.png"
                alt="Logo Công Ty" />
        </div>

        <div class="gif-container">
            <img src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1726412281/Screenshot_2024-09-15_215744_skrx3f.png"
                alt="Animation" />
        </div>

        <div class="gif-credit">
            <p>Email lấy lại mã minh Glow Clothing</p>
        </div>

        <div class="content">
            <h2>Chào, {{ $name }}</h2>
            <p>
                Chúng tôi đã nhận được yêu cầu lấy lại mã minh của bạn.<br />
                Dưới đây là mã xác minh mới của bạn:
            </p>
            <div class="otp-boxes">
                @foreach ($maXacMinh as $item)
                    <div class="otp-box">{{ $item }}</div>
                @endforeach
            </div>
        </div>

        <div class="footer">
            <p>
                Bằng cách tương tác với email này, bạn đồng ý với
                <a href="#">Điều Khoản & Điều Kiện</a> và
                <a href="#">Chính Sách Bảo Mật</a> của chúng tôi.
            </p>
        </div>
    </div>
</body>

</html>
