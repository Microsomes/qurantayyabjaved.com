<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Profile extends Model
{
    protected $fillable = ['name', 'pin_hash'];

    protected $hidden = ['pin_hash'];

    public function readingProgress(): HasOne
    {
        return $this->hasOne(ReadingProgress::class);
    }

    public function xp(): HasOne
    {
        return $this->hasOne(ProfileXp::class);
    }

    public function streak(): HasOne
    {
        return $this->hasOne(Streak::class);
    }

    public function readingSessions(): HasMany
    {
        return $this->hasMany(ReadingSession::class);
    }

    public function badges(): BelongsToMany
    {
        return $this->belongsToMany(BadgeDefinition::class, 'profile_badges')
            ->withPivot('earned_at')
            ->withTimestamps();
    }
}
