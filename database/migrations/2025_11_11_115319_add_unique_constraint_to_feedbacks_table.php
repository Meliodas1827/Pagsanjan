<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('feedbacks', function (Blueprint $table) {
            // Add unique constraint to prevent duplicate feedbacks
            // One user can only submit one feedback per booking
            $table->unique(['user_id', 'category', 'booking_id'], 'unique_user_booking_feedback');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('feedbacks', function (Blueprint $table) {
            $table->dropUnique('unique_user_booking_feedback');
        });
    }
};
