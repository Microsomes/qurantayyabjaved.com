<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProfileXp extends Model
{
    protected $table = 'profile_xp';

    protected $fillable = ['profile_id', 'total_xp', 'level'];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }
}
