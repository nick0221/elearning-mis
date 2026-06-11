<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('course_modules')->cascadeOnDelete();
            $table->string('title');
            $table->longText('content')->nullable();
            $table->enum('type', ['text', 'video', 'audio'])->default('text');
            $table->string('video_url')->nullable();
            $table->integer('sort_order')->default(0);
            $table->integer('duration_minutes')->nullable();
            $table->timestamps();

            $table->index(['module_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
