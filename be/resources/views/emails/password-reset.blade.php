<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đổi Mật Khẩu</title>
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
            padding: 10px;
            border-radius: 5px;
        }

        .header {
            padding: 15px;
            text-align: center;
        }

        .header img {
            max-width: 100px;
        }

        .gif-container {
            text-align: center;
            margin: 10px 0;
            /* Giảm khoảng cách giữa ảnh động và nội dung */
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
            padding: 15px;
        }

        .content h2 {
            font-size: 18px;
            margin: 5px 0 10px;
            /* Giảm khoảng cách trên và dưới tiêu đề */
        }

        .content p {
            font-size: 14px;
            margin-bottom: 15px;
        }

        .content a {
            color: #fff;
        }

        .cta-button {
            display: block;
            background: #ed4b4d;
            color: #fff;
            text-align: center;
            padding: 8px 12px;
            margin: 20px auto;
            border-radius: 4px;
            text-decoration: none;
            font-size: 15px;
            width: 300px;
            max-width: 100%;
        }


        .footer {
            font-size: 11px;
            color: #666;
            text-align: center;
            padding: 10px;
            border-top: 1px solid #ddd;
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
            <img src="/LOGOGLOW.png" alt="Logo Công Ty">
        </div>

        <div class="gif-container">
            <img src="./Confirmation Letter.png" alt="Animation">
        </div>

        <div class="gif-credit">
            <p><a href="" class="text-underline font-size-sm" target="_blank">Confirmation email</a> by <a
                    href="" class="text-underline font-size-sm" target="_blank">Creative Stall</a></p>
        </div>

        <div class="content">
            <h2>Chào, {{ $name }}</h2>
            <p>Chúng tôi đã nhận được yêu cầu đổi mật khẩu của bạn. Vui lòng sử dụng liên kết dưới đây để tạo mật khẩu
                mới:</p>

            <a class="cta-button" href="{{ 'http://localhost:5173/changePassword?token=' . $token }}">Đặt lại mật
                khẩu</a>

            <p>Nếu bạn không yêu cầu đổi mật khẩu, vui lòng bỏ qua email này.</p>
        </div>

        <div class="footer">
            <p>Bằng cách tương tác với email này, bạn đồng ý với <a href="#">Điều Khoản & Điều Kiện</a> và <a
                    href="#">Chính Sách Bảo Mật</a> của chúng tôi.</p>
            <p><a href="#">Quản lý tài khoản của bạn</a> • <a href="#">Hủy đăng ký</a></p>
        </div>
    </div>
</body>

</html>
