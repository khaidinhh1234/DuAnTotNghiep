<!DOCTYPE html>

<html lang="en">


<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>


<body >

    <h2>Xin chào,</h2>
    <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Vui lòng nhấn vào link dưới đây để đặt lại mật khẩu:</p>
    <p>
        <a href="{{ 'http://localhost:5173/changePassword?token=' . $token }}">Đặt lại mật khẩu</a>
    </p>
    <p>Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.</p>
    <p>Trân trọng,<br>{{ config('app.name') }}</p>
</body>


</html>

