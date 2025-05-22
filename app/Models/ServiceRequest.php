<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceRequest extends Model
{
    const STATUS_PENDING = 'pending';
    const STATUS_ACTIVE = 'active';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS = [
        self::STATUS_PENDING,
        self::STATUS_ACTIVE,
        self::STATUS_APPROVED,
        self::STATUS_REJECTED,
    ];

    protected $fillable = [
        'client_id',
        'client_name',
        'status',
        'title',
        'details',
        'preferred_day',
        'alternate_day',
        'arrival_times',
        'assessment_required',
        'cleaning_services',
        'internal_notes',
        'quote_amount',
    ];

    protected $casts = [
        'preferred_day' => 'datetime',
        'alternate_day' => 'datetime',
        'arrival_times' => 'array',
        'cleaning_services' => 'array',
        'assessment_required' => 'boolean',
    ];

    // If you created a foreign key relationship
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function quotes()
    {
        return $this->hasMany(BookingQuote::class, 'booking_id');
    }

//    public function getStatusLabelAttribute()
//    {
//        return match ($this->status) {
//            self::STATUS_PENDING => 'Pending',
//            self::STATUS_ACTIVE => 'Active',
//            self::STATUS_APPROVED => 'Approved',
//            default => 'Unknown',
//        };
//    }

    public function getStatusAttribute()
    {
        $latestQuote = $this->quotes()->latest()->first();

        if (!$latestQuote) {
            return self::STATUS_PENDING; // Default status if no quotes exist
        }

        if ($latestQuote->is_approved) {
            return self::STATUS_APPROVED;
        }

        if ($latestQuote->is_rejected) {
            return self::STATUS_REJECTED;
        }

        return self::STATUS_ACTIVE;
    }
}
