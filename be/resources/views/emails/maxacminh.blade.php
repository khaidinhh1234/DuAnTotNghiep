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

            .otp-boxes {
                display: flex;
                justify-content: center;
                gap: 10px;
                margin-bottom: 10px;
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
        </style>
    </head>

    <body>
        <div class="email-container">
            <div class="header">
                <img
                    src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1726411972/Screenshot_2024-09-15_215232_d3dt3j.png"
                    alt="Logo Công Ty"
                    style="mix-blend-mode: multiply"
                />
            </div>

            <div class="gif-container">
                <img
                    src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1726412281/Screenshot_2024-09-15_215744_skrx3f.png"
                    alt="Animation"
                />
            </div>

            <div class="gif-credit">
                <p>Email lấy lại mã minh Glow Clothing</p>
            </div>

            <div class="content">
                <h2>Chào, {{ $name }}</h2>
                <p>
                    Chúng tôi đã nhận được yêu cầu lấy lại mã minh của bạn.<br />
                    Dưới đây là mã xác minh của bạn:
                </p>
                <div class="otp-boxes">
                    <div class="otp-box">5</div>
                    <div class="otp-box">0</div>
                    <div class="otp-box">2</div>
                    <div class="otp-box">0</div>
                    <div class="otp-box">1</div>
                    <div class="otp-box">8</div>
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
