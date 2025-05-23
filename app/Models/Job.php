<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $table = 'service_jobs';

    protected $fillable = [
        'contractor_id',
        'client_id',
        'service_request_id',
        'quote_id',
        'schedule_date',
        'schedule_time',
        'notes',
        'total_price',
        'status'
    ];

    protected $casts = [
        'schedule_date' => 'date',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_ACTIVE = 'active';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_COMPLETED = 'completed';

    const STATUS = [
        self::STATUS_PENDING,
        self::STATUS_ACTIVE,
        self::STATUS_APPROVED,
        self::STATUS_REJECTED,
        self::STATUS_COMPLETED,
    ];

    public function contractor()
    {
        return $this->belongsTo(User::class, 'contractor_id');
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function serviceRequest()
    {
        return $this->belongsTo(ServiceRequest::class);
    }

    public function quote()
    {
        return $this->belongsTo(Quote::class);
    }
}
