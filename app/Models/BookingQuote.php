<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingQuote extends Model
{
    protected $fillable = [
        'booking_id',
        'quote_amount',
        'is_approved',
        'approved_at',
        'is_rejected',
        'rejected_at'
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'approved_at' => 'datetime',
        'quote_amount' => 'decimal:2'
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
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
    public function reject()
    {
        $this->update([
            'is_rejected' => true,
            'rejected_at' => now()
        ]);
    }
}
