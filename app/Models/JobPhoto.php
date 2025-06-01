<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_job_id',
        'path',
        'type',
    ];

    public function job()
    {
        return $this->belongsTo(Job::class);
    }
}
