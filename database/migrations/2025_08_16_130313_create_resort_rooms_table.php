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
        Schema::create('resort_rooms', function (Blueprint $table) {
            $table->id();
            $table->text('resort_name');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('capacity');
            $table->decimal('price_per_day', 10, 2);
            $table->string('image_url')->nullable();
            $table->string('contact')->nullable();
            $table->string('resort_email')->nullable();
            $table->enum('status', ['available', 'maintenance', 'occupied'])->default('available');
              $table->unsignedSmallInteger('pax'); 
               $table->json('amenities')->nullable();
            $table->timestamps();

        });

           Schema::create('resort_bookings', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('booking_id')->nullable()->constrained()->nullOnDelete()->cascadeOnUpdate();
            $table->foreignId('resort_room_id')->nullable()->constrained()->nullOnDelete()->cascadeOnUpdate();
            $table->timestamps();

        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resort_bookings');
        Schema::dropIfExists('resort_rooms');


    }
};
