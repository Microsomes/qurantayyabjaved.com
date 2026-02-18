<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class BadgeDefinition extends Model
{
    protected $fillable = ['slug', 'name', 'description', 'icon', 'xp_reward', 'criteria_type', 'criteria_value'];

    public function profiles(): BelongsToMany
    {
        return $this->belongsToMany(Profile::class, 'profile_badges')
            ->withPivot('earned_at')
            ->withTimestamps();
    }
}
