<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phản Hồi Khách Hàng</title>
    <style>
        body {
            background-color: #1a1a2e;
            color: #fff;
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #2e2e4e;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
            text-align: center;
        }

        h1 {
            color: #ffd700;
            font-size: 28px;
        }

        .content p {
            font-size: 16px;
            line-height: 1.6;
            color: #b3b3cc;
        }

        blockquote {
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

        .contact-customers {
            font-size: 15px;
            border-top: 1px solid #ddd;
            margin-bottom: 5px;
            padding-left: 15px;
        }

        blockquote {
            color: black;
            margin: 5px auto;
            margin: 20px auto;
            padding: 10px 15px;
            font-style: italic;
            font-size: 14px;
            width: 80%;
            border-radius: 5px;
        }

        .signature {
            margin-top: 30px;
            font-weight: bold;
            color: #ffd700;
        }

        .footer {
            margin-top: 50px;
            font-size: 12px;
            color: #999;
        }

        .btn {
            background-color: #ffd700;
            color: #1a1a2e;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 14px;
            margin-top: 20px;
            display: inline-block;
            font-weight: bold;
        }

        .btn:hover {
            background-color: #e6c300;
            color: #fff;
        }

        .noi-dung-lien-he {
            font-size: 18px;
            color: #ffffff;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="email-container">

        <div class="content">
            <div class="container">
                <div class="header">
                    <img src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1726411972/Screenshot_2024-09-15_215232_d3dt3j.png"
                        alt="Company Logo" style="mix-blend-mode: multiply">
                </div>
                <h1>Xin chào {{ $name }},</h1>
                <p>Liên hệ của bạn: {{ $email }}</p>

                <p>Glow Clothing đã chặn tài khoản của bạn vì lí do vi phạm chính sách của Glow ClothingClothing</p>

                <p>Lí do chúng tôi block của bạn:</p>
                <blockquote class="noi-dung-lien-he">
                    {{ $noidung['ly_do_block'] }}
                </blockquote>
                <p>Nếu bạn có khiếu nại, <a href="http://localhost:5173/contact">vui lòng ấn vào đây.</a> </p>
                <p class="signature">Trân trọng,<br>Đội ngũ hỗ trợ khách hàng</p>

                <a href="http://localhost:5173/" class="btn">Quay lại trang chủ</a>

                <div class="footer">
                    <p>&copy; 2024 Glow Clothing</p>
                </div>
            </div>

</body>

</html>
