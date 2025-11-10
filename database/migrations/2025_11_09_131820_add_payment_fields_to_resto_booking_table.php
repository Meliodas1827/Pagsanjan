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
        Schema::table('resto_booking', function (Blueprint $table) {
            $table->boolean('is_paid')->default(false)->after('is_book_confirmed');
            $table->string('payment_proof')->nullable()->after('is_paid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resto_booking', function (Blueprint $table) {
            $table->dropColumn(['is_paid', 'payment_proof']);
        });
    }
};
