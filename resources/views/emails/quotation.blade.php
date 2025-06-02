<!DOCTYPE html>
<html>
<head>
    <title>Quotation #{{ $quotationData['quotation_number'] }}</title>
    <style>
        .quotation-amount {
            font-size: 24px;
            font-weight: bold;
            color: #2d3748;
            margin: 20px 0;
        }
        /* Existing styles... */
        .action-buttons {
            margin: 30px 0;
            text-align: center;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin: 0 10px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
        }
        .btn-approve {
            background-color: #28a745;
            color: white;
        }
        .btn-reject {
            background-color: #dc3545;
            color: white;
        }
    </style>
</head>
<body>
<h2>Quotation #{{ $quotationData['quotation_number'] }}</h2>

<p>Dear {{ $quotationData['customer_name'] }},</p>

<p>Thank you for your inquiry. Here is your quotation summary:</p>

<div class="quotation-amount">
    Total Amount: {{ $quotationData['total_amount'] }} USD
</div>

@if(!empty($quotationData['description']))
    <div class="quotation-details">
        <p><strong>Description:</strong></p>
        <p>{{ $quotationData['description'] }}</p>
    </div>
@endif

<div class="action-buttons">
    <p>Please click below to approve or reject this quotation:</p>

    @if($approveUrl == $rejectUrl)
        <a href="{{ $approveUrl }}" class="btn btn-approve">Approve or Reject Quotation</a>
    @else
        <a href="{{ $approveUrl }}" class="btn btn-approve">Approve Quotation</a>
        <a href="{{ $rejectUrl }}" class="btn btn-reject">Reject Quotation</a>
    @endif

    <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
        Or copy and paste these links in your browser:<br>
        Approve: {{ $approveUrl }}<br>
        Reject: {{ $rejectUrl }}
    </p>
</div>

<p>This quotation is valid until {{ $quotationData['valid_until'] }}.</p>

<p>If you have any questions, please don't hesitate to contact us.</p>

<p>Best regards,<br>
    {{ config('app.name') }}</p>
</body>
</html>
