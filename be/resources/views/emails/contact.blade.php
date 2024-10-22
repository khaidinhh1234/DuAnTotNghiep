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

        font-size: 14px;
        /* margin-bottom: 15px; */
    }

    .content p.reply {
        color: black;
    }

    .content a {
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
        /* background-color: #3B0F13; */
        color: black;
        /* border-left: 4px solid #ed4b4d; */
        margin: 5px auto;
        padding: 10px 15px;
        font-style: italic;
        font-size: 14px;
        width: 80%;
        border-radius: 5px;
    }

    .signature {
        margin-top: 30px;
        align-items: center;
    }

    .loi {
        border-top: 1px solid #ddd;
        align-items: center;
        display: flex;
        flex-direction: column;
    }

    .loll {
        margin-top: -13px;
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

        <div class="gif-credit">
            <p><a href="" class="text-underline font-size-sm" target="_blank">Confirmation email</a> by <a href=""
                    class="text-underline font-size-sm" target="_blank">Creative Stall</a></p>
        </div>
        <div class="content">
            <h2>Xin chào:{{ $name }}</h2>
            <p class="reply">Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ trả lời email của bạn trong thời gian
                sớm nhất.</p>
            <p class="reply">Thông tin liên hệ của bạn: {{ $email }}</p>
            <!-- <div class="contact-customers"><strong>Nội dung:</strong>{{ $noidung }}</div> -->

        </div>
        <div>
            <div class="contact-customers"><strong>Nội dung:</strong></div>

            <blockquote>
                {{ $noi_dung}}
            </blockquote>
            <div class="loi">
                <p class="signature">Trân trọng,</p>
                <p class="loll">Đội ngũ hỗ trợ khách hàng</p>

            </div>
        </div>


        <div class="footer">
            <p>Bằng cách liên hệ với chúng tôi, bạn đồng ý với <a href="#">Điều khoản & Điều kiện</a> và <a
                    href="#">Chính sách bảo mật</a>.</p>
        </div>
    </div>
</body>

</html>