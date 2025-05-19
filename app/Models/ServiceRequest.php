<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceRequest extends Model
{
    protected $fillable = [
        'client_name',
        'title',
        'details',
        'preferred_day',
        'alternate_day',
        'arrival_times',
        'assessment_required',
        'cleaning_services',
        'internal_notes',
    ];

    protected $casts = [
        'preferred_day' => 'datetime',
        'alternate_day' => 'datetime',
        'arrival_times' => 'array',
        'cleaning_services' => 'array',
        'assessment_required' => 'boolean',
    ];
}
