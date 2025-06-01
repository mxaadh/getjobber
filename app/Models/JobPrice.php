<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobPrice extends Model
{
    protected $table = 'job_prices';

    protected $fillable = [
        'service_job_id',
        'service_request_id',
        'job_price',
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
        'job_price' => 'decimal:2'
    ];

    public function ServiceJob()
    {
        return $this->belongsTo(Job::class, 'service_job_id');
    }
    public function serviceRequest()
    {
        return $this->belongsTo(ServiceRequest::class);
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
