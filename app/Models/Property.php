<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $fillable = [
        'client_id',
        'street1',
        'street2',
        'city',
        'state',
        'postal_code',
        'country',
    ];
}
