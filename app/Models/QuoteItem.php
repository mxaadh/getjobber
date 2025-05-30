<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteItem extends Model
{
    protected $fillable = [
        'quote_id',
        'name',
        'description',
        'quantity',
        'unit_price',
        'total',
    ];
    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    /**
     * Get the service associated with the quote item.
     */
    public function quote() {
        return $this->belongsTo(Quote::class);
    }
}
