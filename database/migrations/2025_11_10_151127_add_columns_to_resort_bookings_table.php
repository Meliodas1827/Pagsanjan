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
        Schema::table('resort_bookings', function (Blueprint $table) {
            $table->unsignedBigInteger('user_booker')->nullable()->after('resort_room_id');
            $table->unsignedBigInteger('resort_id')->nullable()->after('user_booker');
            $table->string('status')->default('pending')->after('resort_id');
            $table->string('payment_proof')->nullable()->after('status');
            $table->date('date_checkin')->nullable()->after('payment_proof');
            $table->date('date_checkout')->nullable()->after('date_checkin');

            // Add foreign key constraints
            $table->foreign('user_booker')->references('id')->on('users')->onDelete('set null');
            $table->foreign('resort_id')->references('id')->on('resorts')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resort_bookings', function (Blueprint $table) {
            $table->dropForeign(['user_booker']);
            $table->dropForeign(['resort_id']);
            $table->dropColumn(['user_booker', 'resort_id', 'status', 'payment_proof', 'date_checkin', 'date_checkout']);
        });
    }
};
