<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
</head>
<body>
    <h2>Xin chào,</h2>
    <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng nhấn vào link dưới đây để đặt lại mật khẩu:</p>
    <p>
        <a href="{{ 'http://localhost:5173/changePassword?token=' . $token) }}">Đặt lại mật khẩu</a>
    </p>
    <p>Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.</p>
    <p>Trân trọng,<br>{{ config('app.name') }}</p>
</body>
</html>
