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
        Schema::create('hotels', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('user_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete()
                ->cascadeOnUpdate();
            $table->string('hotel_name');
            $table->string('location');
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->timestamps();
        });


        Schema::create('hotel_rooms', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('hotel_id')->nullable()->constrained('hotels', 'id')->nullOnDelete()->cascadeOnUpdate();
            $table->string('room_no');
            $table->text('description')->nullable();
            $table->string('room_type')->nullable();
            $table->unsignedSmallInteger('capacity')->default(0);
            $table->decimal('price_per_night', 10, 2)->nullable();
            $table->string('image_url')->nullable();
            $table->enum('status', ['available', 'maintenance', 'occupied'])->default('available');
            $table->string('amenities')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_rooms');
    }
};
