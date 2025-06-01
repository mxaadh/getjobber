<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #333;
        }

        .container {
            padding: 20px;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }

        .logo-placeholder {
            width: 150px;
            height: 100px;
            background-color: #ddd;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #777;
        }

        .status {
            color: red;
            font-weight: bold;
        }

        .details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        h3 {
            margin-bottom: 5px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }

        th, td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
        }

        .totals {
            text-align: right;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #777;
        }

        .company-info, .payment-info {
            width: 48%;
        }

        .info-row {
            display: flex;
            justify-content: space-between;
        }
    </style>
</head>

<body>
<div class="container">
    <div class="header">
        <div class="logo-placeholder"><img src="public/logo.jpg"></div>
        <div class="status">Status: Unpaid</div>
    </div>

    <div class="details">
        <div>
            <h3>Issued to</h3>
            <p>{{ $quotationData['customer_name'] }}</p>
            <p>{{ $quotationData['customer_email'] }}</p>
            @isset($quotationData['customer_address'])
                <p>{{ $quotationData['customer_address'] }}</p>
            @endisset
        </div>
        <div style="text-align:right;">
            <h3>Quotation Details</h3>
            <p><strong>Quotation #</strong> {{ $quotationData['quotation_number'] }}</p>
            <p><strong>Date of Issue</strong> {{ $quotationData['date_of_issue'] }}</p>
            <p><strong>Due Date</strong> {{ $quotationData['valid_until'] }}</p>
        </div>
    </div>

    <h3>Quotation Summary</h3>
    <table>
        <thead>
        <tr>
            <th>Service</th>
            <th>Description</th>
            <th>Price</th>
            <th>Amount</th>
        </tr>
        </thead>
        <tbody>
        @foreach ($quotationData['items'] as $item)
            <tr>
                <td>{{ $item['name'] }}</td>
                <td>{{ $item['description'] }}</td>
                <td>${{ number_format($item['unit_price'], 2) }}</td>
                <td>${{ number_format($item['total'], 2) }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <p class="totals"><strong>Sub Total:</strong> ${{ number_format($quotationData['subtotal'], 2) }}</p>
    <p class="totals"><strong>GST (10%):</strong> ${{ number_format($quotationData['tax'], 2) }}</p>
    <p class="totals"><strong>Total Due:</strong> ${{ number_format($quotationData['total_amount'], 2) }}</p>

    <div class="info-row">
        <div class="company-info">
            <h3>Company Info</h3>
            <p><strong>Serene Facility Group</strong><br>
                ABN: 37 679 720 391<br>
                Phone: 1300 123 734<br>
                Email: info@serenefacilitygroup.com.au<br>
                Website: www.serenefacilitygroup.com.au</p>
        </div>
        <div class="payment-info" style="text-align:right;">
            <h3>PLEASE MAKE A PAYMENT TO</h3>
            <p><strong>Account Name:</strong> Serene Facility Group</p>
            <p><strong>BSB:</strong> 034 093</p>
            <p><strong>Account Number:</strong> 913 137</p>
            <p>Thank you for your business!</p>
        </div>
    </div>

    <div class="footer">
        © Serene Facility Group – All rights reserved.
    </div>
</div>
</body>

</html>
