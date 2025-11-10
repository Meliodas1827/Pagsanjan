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
        Schema::create('landing_area_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('landing_area_id')->constrained('landing_areas')->onDelete('cascade');

            // Customer Information (for walk-in/non-registered customers)
            $table->string('customer_name');
            $table->string('customer_email')->nullable();
            $table->string('customer_phone');

            // Request Details
            $table->date('pickup_date');
            $table->time('pickup_time');
            $table->integer('number_of_adults')->default(1);
            $table->integer('number_of_children')->default(0);

            // Boat Assignment
            $table->foreignId('boat_id')->nullable()->constrained('boats')->onDelete('set null');

            // Pricing
            $table->decimal('total_amount', 10, 2)->nullable();
            $table->decimal('landing_area_fee', 10, 2)->nullable()->comment('Additional fee from landing area');

            // Status and Notes
            $table->enum('status', ['pending', 'confirmed', 'assigned', 'completed', 'cancelled'])->default('pending');
            $table->text('special_requirements')->nullable();
            $table->text('admin_notes')->nullable();

            // Payment
            $table->boolean('is_paid')->default(false);
            $table->string('payment_proof')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('landing_area_requests');
    }
};
