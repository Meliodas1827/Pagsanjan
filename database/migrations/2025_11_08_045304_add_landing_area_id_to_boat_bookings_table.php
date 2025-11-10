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
        Schema::table('boat_bookings', function (Blueprint $table) {
            $table->foreignId('landing_area_id')->nullable()->constrained('landing_areas')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('boat_bookings', function (Blueprint $table) {
            $table->dropForeign(['landing_area_id']);
            $table->dropColumn('landing_area_id');
        });
    }
};
