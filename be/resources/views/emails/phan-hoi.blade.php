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

        p {
            font-size: 16px;
            line-height: 1.6;
            color: #b3b3cc;
        }

        blockquote {
            background-color: #1f1f3d;
            color: #fff;
            border-left: 4px solid #ffd700;
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

        /* Button Styling */
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
    </style>
</head>
<body>

    <div class="container">
        <h1>Xin chào {{ $name }},</h1>
        <p>Cảm ơn bạn đã liên hệ với chúng tôi! Chúng tôi đã nhận được phản hồi của bạn và sẽ phản hồi lại trong thời gian sớm nhất.</p>
        
        <p>Nội dung phản hồi của shop:</p>
        <blockquote>
            {{ $noi_dung_phan_hoi }}
        </blockquote>

        <p class="signature">Trân trọng,<br>Đội ngũ hỗ trợ khách hàng</p>

        <a href="http://localhost:5173" class="btn">Quay lại trang chủ</a> 

        <div class="footer">
            <p>&copy; 2024 Glow Clothing .</p> 
        </div>
    </div>

</body>
</html>
