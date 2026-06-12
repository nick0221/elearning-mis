<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->text('prerequisites')->nullable()->after('description');
            $table->text('learning_outcomes')->nullable()->after('prerequisites');
            $table->string('target_audience')->nullable()->after('learning_outcomes');
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['prerequisites', 'learning_outcomes', 'target_audience']);
        });
    }
};
