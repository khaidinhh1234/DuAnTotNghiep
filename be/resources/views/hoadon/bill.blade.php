<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8"> <!-- Đảm bảo rằng dòng này đã tồn tại -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            padding: 0;
            margin: 0;
            background-color: #f8f9fa;
        }

        .invoice-container {
            width: 100%;
            max-width: 900px;
            margin: 30px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        }

        .invoice-header h1 {
            font-size: 24px;
            color: #007bff;
            margin: 0;
        }

        .invoice-header img {
            width: 150px;
        }

        .invoice-details {
            margin: 20px 0;
            display: flex;
            justify-content: space-between;
        }

        .invoice-details div {
            width: 48%;
        }

        .invoice-details p {
            margin: 4px 0;
            color: #333;
        }

        .invoice-details strong {
            display: block;
            margin-bottom: 8px;
            color: #007bff;
        }

        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .invoice-table th,
        .invoice-table td {
            padding: 12px;
            border: 1px solid #dee2e6;
            text-align: center;
        }

        .invoice-table th {
            background-color: #f1f1f1;
            color: #333;
        }

        .invoice-table td {
            color: #555;
        }

        .invoice-total {
            text-align: right;
            margin-top: 20px;
        }

        .invoice-total h3 {
            font-size: 20px;
            color: #007bff;
        }

        .invoice-total p {
            margin: 8px 0;
            color: #555;
        }

        .thank-you {
            text-align: center;
            margin-top: 40px;
            font-size: 16px;
            color: #555;
            border-top: 1px solid #dee2e6;
            padding-top: 10px;
        }

        .note {
            text-align: center;
            color: #aaa;
            font-size: 12px;
            margin-top: 10px;
        }
    </style>
</head>

<body>

    <div class="invoice-container">
        <!-- Header -->
        <div class="invoice-header">
            <h1>HÓA ĐƠN BÁN HÀNG</h1>
        </div>

        <!-- Invoice Details -->
        <div class="invoice-details">
            <div>
                <strong>Thông tin khách hàng</strong>
                <p>Tên: {{ $hoaDon->user->ho . ' ' . $hoaDon->user->ten }}</p>
                <p>Email: {{ $hoaDon->email }}</p>
                <p>Địa chỉ: {{ $hoaDon->dia_chi }}</p>
            </div>
            <div>
                <strong>Thông tin hóa đơn</strong>
                <p>Mã hóa đơn: {{ $hoaDon->id }}</p>
                <p>Ngày đặt hàng: {{ $hoaDon->created_at }}</p>
                <p>Ngày giao hàng: {{ $hoaDon->updated_at }}>/p>
            </div>
        </div>

        <!-- Invoice Table -->
        <table class="invoice-table">
            <thead>
                <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($hoaDon->chiTiets as $item)
                    <tr>
                        <td>Quần jeans</td>
                        <td>1</td>
                        <td>500.000 VND</td>
                        <td>500.000 VND</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Invoice Total -->
        <div class="invoice-total">
            <h3>Tổng cộng: 2.100.000 VND</h3>
            <p>Đã thanh toán: 2.100.000 VND</p>
        </div>

        <!-- Thank You -->
        <div class="thank-you">
            <p>Cảm ơn quý khách đã mua hàng!</p>
        </div>

        <!-- Note -->
        <div class="note">
            <p>Đây là hóa đơn điện tử. Không cần chữ ký.</p>
        </div>
    </div>

</body>

</html>
