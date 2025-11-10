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
        Schema::table('boats', function (Blueprint $table) {
            $table->string('image')->nullable()->after('boat_no');
            $table->decimal('price_per_adult', 10, 2)->default(0)->after('capacity');
            $table->decimal('price_per_child', 10, 2)->default(0)->after('price_per_adult');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('boats', function (Blueprint $table) {
            $table->dropColumn(['image', 'price_per_adult', 'price_per_child']);
        });
    }
};
