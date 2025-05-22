<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $appends = ['full_name', 'address'];
    protected $fillable = ['first_name', 'last_name', 'company_name', 'phone', 'email'];

    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function getAddressAttribute()
    {
        $property = $this->properties()->first();
        if (!$property) {
            return 'No address found';
        }

        return "{$property->street1}, {$property->city}, {$property->state}, {$property->postal_code}, {$property->country}";
    }


}
