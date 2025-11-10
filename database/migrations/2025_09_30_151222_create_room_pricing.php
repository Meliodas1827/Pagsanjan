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
        Schema::create('room_pricing', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained()->onDelete('cascade');

            // Pricing details
            $table->string('season', 50)->default('regular'); // regular, peak, promo, off_season
            $table->decimal('price_per_night', 10, 2);
            $table->string('currency', 3)->default('PHP');

            // Validity period
            $table->date('valid_from')->nullable();
            $table->date('valid_to')->nullable();

            // Additional pricing options
            $table->decimal('weekend_price', 10, 2)->nullable();
            $table->decimal('holiday_price', 10, 2)->nullable();

            // Discount options
            $table->decimal('early_bird_discount', 5, 2)->nullable(); // percentage
            $table->unsignedInteger('early_bird_days')->nullable(); // days before check-in
            $table->decimal('extended_stay_discount', 5, 2)->nullable(); // percentage
            $table->unsignedInteger('extended_stay_nights')->nullable(); // minimum nights

            // Extra charges
            $table->decimal('extra_adult_charge', 10, 2)->nullable();
            $table->decimal('extra_child_charge', 10, 2)->nullable();

            // Status
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            // Indexes
            $table->index('room_id');
            $table->index('season');
            $table->index(['valid_from', 'valid_to']);
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_pricing');
    }
};
