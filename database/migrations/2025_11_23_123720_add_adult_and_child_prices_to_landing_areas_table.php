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
        Schema::table('landing_areas', function (Blueprint $table) {
            // Add new price columns for adults and children
            $table->decimal('price_per_adult', 10, 2)->nullable()->after('price')->comment('Price per adult for boat ride');
            $table->decimal('price_per_child', 10, 2)->nullable()->after('price_per_adult')->comment('Price per child for boat ride');

            // Optionally, you can migrate existing price data to price_per_adult
            // and then drop the old price column if you want to replace it completely
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('landing_areas', function (Blueprint $table) {
            $table->dropColumn(['price_per_adult', 'price_per_child']);
        });
    }
};
