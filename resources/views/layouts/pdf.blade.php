@php
    use Illuminate\Support\Facades\App;
@endphp
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quotation</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            margin: 40px;
            background: #fff;
            color: #333;
        }

        .container {
            max-width: 700px;
            margin: auto;
            padding: 30px;
            border: 1px solid #ccc;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        .logo-placeholder,
        .status {
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: bold;
        }

        .logo-placeholder {
            width: 40%;
            background-color: #ddd;
            color: #777;
        }

        .status {
            width: 40%;
            text-align: right;
            color: red;
        }

        .details-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }

        .details-left,
        .details-right {
            width: 48%;
        }

        h3 {
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: bold;
        }

        .flotRight {
            float: right;
        }

        .details-right p {
            margin: 5px 0;
            text-align: right;
        }

        .details-right span {
            font-weight: bold;
        }

        .section {
            margin-bottom: 30px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        th,
        td {
            padding: 12px;
            border: 1px solid #ccc;
            text-align: left;
        }

        .totals {
            text-align: right;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
            gap: 30px;
        }

        .company-info,
        .payment-info {
            width: 48%;
        }

        .payment-info p {
            display: block;
            width: 100%;
            float: right;
            text-align: right;
            margin-bottom: 0;
        }

        .footer {
            text-align: center;
            font-size: 13px;
            color: #555;
        }
    </style>
</head>

<body>
<div class="container">
    @yield('content')
</div>
</body>

</html>
