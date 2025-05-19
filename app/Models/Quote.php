<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    public function client() {
        return $this->belongsTo(Client::class);
    }

    public function items() {
        return $this->hasMany(QuoteItem::class);
    }
}
