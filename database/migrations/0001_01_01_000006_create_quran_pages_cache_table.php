<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quran_pages_cache', function (Blueprint $table) {
            $table->smallInteger('page_number')->primary();
            $table->json('data');
            $table->timestamp('cached_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quran_pages_cache');
    }
};
