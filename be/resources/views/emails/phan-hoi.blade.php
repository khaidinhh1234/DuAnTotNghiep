<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Phản Hồi Khách Hàng</title>
</head>
<body>
    <h1>Xin chào {{ $name }},</h1>
    <p>Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi đã nhận được phản hồi của bạn và sẽ phản hồi lại trong thời gian sớm nhất.</p>
    <p>Nội dung phản hồi của bạn:</p>
    <blockquote>
        {{ $noi_dung_phan_hoi }}
    </blockquote>
    <p>Trân trọng,</p>
    <p>Đội ngũ hỗ trợ khách hàng</p>
</body>
</html>