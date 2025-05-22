<!DOCTYPE html>
<html>
<head>
    <title>Quote Action</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .message { font-size: 1.5em; margin-bottom: 20px; }
        .quote-info { margin: 20px 0; padding: 20px; background: #f8f9fa; }
    </style>
</head>
<body>
<div class="message">{{ $message }}</div>

<div class="quote-info">
    <p>Quote #{{ $quote->id }}</p>
    <p>Amount: {{ number_format($quote->quote_amount, 2) }} USD</p>
    <p>Status: {{ $quote->is_approved ? 'Approved' : 'Rejected' }}</p>
</div>

<p><a href="{{ url('/') }}">Return to homepage</a></p>
</body>
</html>
