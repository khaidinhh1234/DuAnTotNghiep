<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông tin liên hệ</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            background-color: #1a1a2e;
            color: #fff;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .email-container {
            width: 100%;
            max-width: 500px;
            background-color: #2e2e4e;
            border-radius: 10px;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
            text-align: center;
            padding: 20px;
            margin: auto;
        }

        .header {
            background-color: #ffd700;
            padding: 20px;
        }

        .header img {
            width: 80px;
            height: auto;
        }

        h2 {
            color: #ffd700;
            font-size: 24px;
            margin-bottom: 10px;
        }

        .content p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 20px;
            color: #b3b3cc;
        }

        .message {
            background-color: #1f1f3d;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #fff;
            border-left: 4px solid #ffd700;
        }

        .cta-button {
            display: inline-block;
            text-align: center;
            background-color: #ffd700;
            color: #1a1a2e;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: bold;
            margin-top: 20px;
        }

        .cta-button:hover {
            background-color: #e6c300;
            color: #fff;
        }

        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #999;
        }

        .footer a {
            color: #ffd700;
            text-decoration: none;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header Section -->
        <div class="header">
            <img src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1726411972/Screenshot_2024-09-15_215232_d3dt3j.png"
                alt="Company Logo">
        </div>

        <!-- Content Section -->
        <div class="content">
            <h2>Xin chào, {{ $name }}</h2>
            <p>Email: {{ $email }}</p>
            <p>Cảm ơn bạn đã liên hệ với chúng tôi từ Glow Clothing. Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi lại trong thời gian sớm nhất.</p>

            <!-- Displaying the user's message -->
            <div class="message">
                <strong>Nội dung liên hệ:</strong><br>
                {{ $noidung }}
            </div>

            <!-- CTA Button -->
            <a href="https://example.com" class="cta-button">Truy cập trang của chúng tôi</a>
        </div>

        <!-- Footer Section -->
        <div class="footer">
            <p>Bằng cách liên hệ với chúng tôi, bạn đồng ý với <a href="#">Điều khoản & Điều kiện</a> và <a href="#">Chính sách bảo mật</a>.</p>
        </div>
    </div>
</body>

</html>
