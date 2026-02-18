<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profile_xp', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->unique()->constrained()->cascadeOnDelete();
            $table->bigInteger('total_xp')->default(0);
            $table->smallInteger('level')->default(1);
            $table->timestamps();
        });

        Schema::create('streaks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->unique()->constrained()->cascadeOnDelete();
            $table->integer('current_streak')->default(0);
            $table->integer('longest_streak')->default(0);
            $table->date('last_read_date')->nullable();
            $table->tinyInteger('freeze_count')->default(0);
            $table->boolean('freeze_used_today')->default(false);
            $table->timestamps();
        });

        Schema::create('badge_definitions', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('description');
            $table->string('icon');
            $table->integer('xp_reward')->default(0);
            $table->string('criteria_type');
            $table->integer('criteria_value');
            $table->timestamps();
        });

        Schema::create('profile_badges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('badge_definition_id')->constrained()->cascadeOnDelete();
            $table->timestamp('earned_at');
            $table->timestamps();

            $table->unique(['profile_id', 'badge_definition_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profile_badges');
        Schema::dropIfExists('badge_definitions');
        Schema::dropIfExists('streaks');
        Schema::dropIfExists('profile_xp');
    }
};
