<!DOCTYPE html>
<html lang="vi">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Thông tin liên hệ</title>
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


        .content {
            padding: 15px;
        }

        .content h2 {
            font-size: 18px;
            margin: 5px 0 10px;
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
align-items: center;        }
        .loi{
            border-top: 1px solid #ddd;
            align-items: center;
            display: flex;
            flex-direction: column;
        }
        .loll{
            margin-top: -13px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <img src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1726411972/Screenshot_2024-09-15_215232_d3dt3j.png"
                alt="Logo Công Ty">
        </div>

        <div class="gif-container">
            <img src="https://res.cloudinary.com/dcvu7e7ps/image/upload/v1726412281/Screenshot_2024-09-15_215744_skrx3f.png"
                alt="Animation">
        </div>
        <div class="gif-credit">
            <p><a href="" class="text-underline font-size-sm" target="_blank">Confirmation email</a> by <a href=""
                    class="text-underline font-size-sm" target="_blank">Creative Stall</a></p>
        </div>
        <div class="content">
            <h2>Xin chào:{{ $name }}</h2>
            <p class="reply">Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ trả lời email của bạn trong thời gian sớm nhất.</p>
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
            <p>Bằng cách tương tác với email này, bạn đồng ý với <a href="#">Điều Khoản & Điều Kiện</a> và <a
                    href="#">Chính Sách Bảo Mật</a> của chúng tôi.</p>
        </div>
    </div>
</body>

</html>
