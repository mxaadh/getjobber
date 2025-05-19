<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteItem extends Model
{
    public function quote() {
        return $this->belongsTo(Quote::class);
    }
}
