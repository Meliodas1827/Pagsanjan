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
        // Create table for room types
        Schema::create('hotel_room_types', function(Blueprint $table){
            $table->id();
            $table->string('room_type')->unique(); // e.g. Deluxe, Suite
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Update hotel_rooms to reference room types
        Schema::table('hotel_rooms', function (Blueprint $table) {
            $table->foreignId('room_type_id')
                  ->nullable()
                  ->after('hotel_id')
                  ->constrained('hotel_room_types', 'id')
                  ->nullOnDelete()
                  ->cascadeOnUpdate();
            
            // Optional: if you want to remove old columns since they are now in hotel_room_types
            $table->dropColumn(['room_type', 'capacity', 'price_per_night', 'amenities', 'image_url', 'description']);
        });

// hotel rooms images
         Schema::create('hotel_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_room_type_id')->nullable()->constrained('hotel_room_types')
            ->cascadeOnUpdate()->nullOnDelete();
            $table->string('image_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hotel_rooms', function (Blueprint $table) {
            $table->string('room_type')->nullable();
            $table->unsignedSmallInteger('capacity')->default(0);
            $table->decimal('price_per_night', 10, 2)->nullable();
            $table->string('image_url')->nullable();
            $table->string('amenities')->nullable();
            $table->text('description')->nullable();
            $table->dropForeign(['room_type_id']);
            $table->dropColumn('room_type_id');
        });

        Schema::dropIfExists('hotel_room_types');
        Schema::dropIfExists('hotel_images');

    }
};
