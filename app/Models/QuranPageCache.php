<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuranPageCache extends Model
{
    protected $table = 'quran_pages_cache';

    protected $primaryKey = 'page_number';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = ['page_number', 'data', 'cached_at'];

    protected function casts(): array
    {
        return [
            'data' => 'array',
            'cached_at' => 'datetime',
        ];
    }
}
