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
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('category'); // 'landing_area', 'resort', 'restaurant', 'hotel', 'ubaap'
            $table->unsignedBigInteger('booking_id')->nullable(); // Reference to the booking
            $table->string('booking_reference')->nullable(); // Booking reference number
            $table->integer('rating'); // 1-5 stars
            $table->text('comment');
            $table->timestamps();

            // Indexes
            $table->index('category');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('feedbacks');
    }
};
