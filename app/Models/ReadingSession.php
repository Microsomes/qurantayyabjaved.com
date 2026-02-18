<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReadingSession extends Model
{
    protected $fillable = ['profile_id', 'date', 'pages_read', 'xp_earned', 'duration_seconds'];

    protected $attributes = [
        'pages_read' => '[]',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'pages_read' => 'array',
        ];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
