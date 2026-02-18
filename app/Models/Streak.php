<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Streak extends Model
{
    protected $fillable = [
        'profile_id',
        'current_streak',
        'longest_streak',
        'last_read_date',
        'freeze_count',
        'freeze_used_today',
    ];

    protected function casts(): array
    {
        return [
            'last_read_date' => 'date',
            'freeze_used_today' => 'boolean',
        ];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
