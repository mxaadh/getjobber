<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingQuote extends Model
{
    protected $table = 'booking_quotes';

    protected $fillable = [
        'booking_id',
        'quote_amount',
        'is_approved',
        'approved_at',
        'is_rejected',
        'rejected_at',
        'reason'
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
        'is_rejected' => 'boolean',
        'rejected_at' => 'datetime',
        'quote_amount' => 'decimal:2'
    ];

    public function booking()
    {
        return $this->belongsTo(ServiceRequest::class, 'booking_id');
    }

    public function items()
    {
        return $this->hasMany(QuoteItem::class, 'quote_id');
    }

    // Helper method to approve the quote
    public function approve()
    {
        $this->update([
            'is_approved' => true,
            'approved_at' => now()
        ]);
    }

    // Helper method to reject the quote
    public function reject($reason)
    {
        $this->update([
            'is_rejected' => true,
            'rejected_at' => now(),
            'reason' => $reason
        ]);
    }
}
