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
            $table->unsignedInteger('adults')->default(0)->after('date_checkout');
            $table->unsignedInteger('children')->default(0)->after('adults');
            $table->unsignedInteger('pwd')->default(0)->after('children');
            $table->unsignedInteger('senior')->default(0)->after('pwd');
            $table->decimal('amount', 10, 2)->default(0)->after('senior');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('resort_bookings', function (Blueprint $table) {
            $table->dropColumn(['adults', 'children', 'pwd', 'senior', 'amount']);
        });
    }
};
