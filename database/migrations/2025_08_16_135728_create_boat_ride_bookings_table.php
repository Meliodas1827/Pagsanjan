<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::create('boats', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('boat_no')->unique();
            $table->string('bankero_name')->nullable();
            $table->unsignedSmallInteger('capacity');
            $table->enum('status', ['onride', 'booked', 'available'])->default('available');
        });

        Schema::create('boat_bookings', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            // Who booked
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();

            // Booking details
            $table->date('date_of_booking');
            $table->time('ride_time')->nullable();

            // Assignable boat (can be null until assignment)
            $table->foreignId('boat_id')
                ->nullable()
                ->constrained()
                ->cascadeOnUpdate()
                ->nullOnDelete();

            // Pricing + counts
            $table->unsignedSmallInteger('total_amount');
            $table->unsignedSmallInteger('no_of_adults');
            $table->unsignedSmallInteger('no_of_children');

            // Status flags
            $table->boolean('is_walk_in')->default(true);

            // Booking status (instead of just boolean "accepted")
            $table->enum('status', [
                'cancelled',
                'boat_assigned',
                'pending',              // customer requested, waiting for admin
                'completed',            // finished
            ])->default('pending');
             $table->enum('payment_status', [
                'paid',
                'unpaid',
            ])->default('unpaid');
            $table->unsignedSmallInteger('available_slot')->nullable();
            $table->string('created_by')->default(Auth::id());
        });


        Schema::create('boat_pricings', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->decimal('price_per_adult', 10, 2);
            $table->decimal('price_per_child', 10, 2);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('boatride_bookings');
        Schema::dropIfExists('boats');
        Schema::dropIfExists('boat_pricings');
    }
};
