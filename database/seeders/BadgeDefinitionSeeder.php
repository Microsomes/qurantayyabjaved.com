<?php

namespace Database\Seeders;

use App\Models\BadgeDefinition;
use Illuminate\Database\Seeder;

class BadgeDefinitionSeeder extends Seeder
{
    public function run(): void
    {
        $badges = [
            // Reading milestones
            ['slug' => 'first_page', 'name' => 'First Step', 'description' => 'Read your first page', 'icon' => 'book-open', 'xp_reward' => 50, 'criteria_type' => 'pages_read', 'criteria_value' => 1],
            ['slug' => 'pages_10', 'name' => 'Getting Started', 'description' => 'Read 10 pages', 'icon' => 'book-open', 'xp_reward' => 100, 'criteria_type' => 'pages_read', 'criteria_value' => 10],
            ['slug' => 'pages_50', 'name' => 'Consistent Reader', 'description' => 'Read 50 pages', 'icon' => 'book-open', 'xp_reward' => 200, 'criteria_type' => 'pages_read', 'criteria_value' => 50],
            ['slug' => 'pages_100', 'name' => 'Century Mark', 'description' => 'Read 100 pages', 'icon' => 'star', 'xp_reward' => 300, 'criteria_type' => 'pages_read', 'criteria_value' => 100],
            ['slug' => 'pages_200', 'name' => 'Halfway There', 'description' => 'Read 200 pages', 'icon' => 'star', 'xp_reward' => 400, 'criteria_type' => 'pages_read', 'criteria_value' => 200],
            ['slug' => 'pages_300', 'name' => 'Dedicated Reader', 'description' => 'Read 300 pages', 'icon' => 'star', 'xp_reward' => 500, 'criteria_type' => 'pages_read', 'criteria_value' => 300],
            ['slug' => 'pages_400', 'name' => 'Scholar', 'description' => 'Read 400 pages', 'icon' => 'award', 'xp_reward' => 600, 'criteria_type' => 'pages_read', 'criteria_value' => 400],
            ['slug' => 'pages_500', 'name' => 'Almost There', 'description' => 'Read 500 pages', 'icon' => 'award', 'xp_reward' => 700, 'criteria_type' => 'pages_read', 'criteria_value' => 500],
            ['slug' => 'khatam', 'name' => 'Khatam', 'description' => 'Complete the entire Quran', 'icon' => 'crown', 'xp_reward' => 2000, 'criteria_type' => 'pages_read', 'criteria_value' => 604],

            // Streak badges
            ['slug' => 'streak_3', 'name' => 'Getting Warm', 'description' => '3-day reading streak', 'icon' => 'flame', 'xp_reward' => 50, 'criteria_type' => 'streak', 'criteria_value' => 3],
            ['slug' => 'streak_7', 'name' => 'Week Warrior', 'description' => '7-day reading streak', 'icon' => 'flame', 'xp_reward' => 100, 'criteria_type' => 'streak', 'criteria_value' => 7],
            ['slug' => 'streak_14', 'name' => 'Two Weeks Strong', 'description' => '14-day reading streak', 'icon' => 'flame', 'xp_reward' => 200, 'criteria_type' => 'streak', 'criteria_value' => 14],
            ['slug' => 'streak_30', 'name' => 'Monthly Master', 'description' => '30-day reading streak', 'icon' => 'flame', 'xp_reward' => 500, 'criteria_type' => 'streak', 'criteria_value' => 30],
            ['slug' => 'streak_60', 'name' => 'Unstoppable', 'description' => '60-day reading streak', 'icon' => 'zap', 'xp_reward' => 800, 'criteria_type' => 'streak', 'criteria_value' => 60],
            ['slug' => 'streak_100', 'name' => 'Century Streak', 'description' => '100-day reading streak', 'icon' => 'zap', 'xp_reward' => 1000, 'criteria_type' => 'streak', 'criteria_value' => 100],
            ['slug' => 'streak_365', 'name' => 'Year of Devotion', 'description' => '365-day reading streak', 'icon' => 'trophy', 'xp_reward' => 5000, 'criteria_type' => 'streak', 'criteria_value' => 365],

            // Juz completion
            ['slug' => 'juz_1', 'name' => 'Juz 1 Complete', 'description' => 'Complete Juz Al-Fatihah', 'icon' => 'check-circle', 'xp_reward' => 100, 'criteria_type' => 'juz_complete', 'criteria_value' => 1],
            ['slug' => 'juz_5', 'name' => 'Juz 5 Complete', 'description' => 'Complete Juz 5', 'icon' => 'check-circle', 'xp_reward' => 100, 'criteria_type' => 'juz_complete', 'criteria_value' => 5],
            ['slug' => 'juz_10', 'name' => 'Juz 10 Complete', 'description' => 'Complete Juz 10', 'icon' => 'check-circle', 'xp_reward' => 100, 'criteria_type' => 'juz_complete', 'criteria_value' => 10],
            ['slug' => 'juz_15', 'name' => 'Juz 15 Complete', 'description' => 'Complete Juz 15', 'icon' => 'check-circle', 'xp_reward' => 100, 'criteria_type' => 'juz_complete', 'criteria_value' => 15],
            ['slug' => 'juz_20', 'name' => 'Juz 20 Complete', 'description' => 'Complete Juz 20', 'icon' => 'check-circle', 'xp_reward' => 100, 'criteria_type' => 'juz_complete', 'criteria_value' => 20],
            ['slug' => 'juz_25', 'name' => 'Juz 25 Complete', 'description' => 'Complete Juz 25', 'icon' => 'check-circle', 'xp_reward' => 100, 'criteria_type' => 'juz_complete', 'criteria_value' => 25],
            ['slug' => 'juz_30', 'name' => 'Juz Amma Complete', 'description' => 'Complete Juz Amma', 'icon' => 'check-circle', 'xp_reward' => 200, 'criteria_type' => 'juz_complete', 'criteria_value' => 30],

            // Special achievements
            ['slug' => 'marathon_reader', 'name' => 'Marathon Reader', 'description' => 'Read 20+ pages in a single day', 'icon' => 'rocket', 'xp_reward' => 300, 'criteria_type' => 'daily_pages', 'criteria_value' => 20],
            ['slug' => 'night_owl', 'name' => 'Night Owl', 'description' => 'Read for 60+ minutes in a session', 'icon' => 'moon', 'xp_reward' => 200, 'criteria_type' => 'session_duration', 'criteria_value' => 3600],
            ['slug' => 'speed_reader', 'name' => 'Speed Reader', 'description' => 'Read 50+ pages in a single day', 'icon' => 'rocket', 'xp_reward' => 500, 'criteria_type' => 'daily_pages', 'criteria_value' => 50],
            ['slug' => 'deep_focus', 'name' => 'Deep Focus', 'description' => 'Read for 120+ minutes in a session', 'icon' => 'target', 'xp_reward' => 400, 'criteria_type' => 'session_duration', 'criteria_value' => 7200],
            ['slug' => 'bookworm', 'name' => 'Bookworm', 'description' => 'Read for 30+ minutes in a session', 'icon' => 'book', 'xp_reward' => 100, 'criteria_type' => 'session_duration', 'criteria_value' => 1800],
        ];

        foreach ($badges as $badge) {
            BadgeDefinition::updateOrCreate(
                ['slug' => $badge['slug']],
                $badge,
            );
        }
    }
}
