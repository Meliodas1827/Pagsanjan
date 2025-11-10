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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();

            // Basic Information
            $table->string('room_name', 100);
            $table->string('room_type', 50)->nullable();
            $table->string('promo_label', 100)->nullable();

            // Description
            $table->text('description')->nullable();
            $table->text('location_details')->nullable();

            // Capacity
            $table->unsignedTinyInteger('max_adults')->default(2);
            $table->unsignedTinyInteger('max_children')->default(2);
            $table->unsignedTinyInteger('children_age_limit')->default(7);

            // Room Specifications
            $table->decimal('room_size_sqm', 5, 2)->nullable();
            $table->unsignedTinyInteger('number_of_beds')->nullable();
            $table->string('bed_type', 50)->nullable();
            $table->string('view_type', 50)->nullable();

            // Bathroom Features
            $table->unsignedTinyInteger('bathroom_sinks')->default(1);
            $table->boolean('has_rain_shower')->default(false);
            $table->boolean('has_premium_toiletries')->default(false);

            // Personal Care Amenities
            $table->boolean('has_algotherm_toiletries')->default(false);

            // Entertainment Amenities
            $table->boolean('has_tv')->default(false);
            $table->boolean('has_movie_channels')->default(false);
            $table->boolean('has_wifi')->default(false);

            // Refreshments
            $table->boolean('has_welcome_drink')->default(false);
            $table->boolean('has_bottled_water')->default(false);
            $table->boolean('has_mini_refrigerator')->default(false);

            // Location
            $table->string('building_name', 100)->nullable();
            $table->unsignedTinyInteger('floor_number')->nullable();
            $table->text('full_address')->nullable();

            // Media
            $table->string('main_image')->nullable();
            $table->json('image_gallery')->nullable();

            // Status
            $table->boolean('is_active')->default(true);
            $table->boolean('is_bookable')->default(true);

            // Timestamps
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('room_type');
            $table->index('is_active');
            $table->index('is_bookable');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
