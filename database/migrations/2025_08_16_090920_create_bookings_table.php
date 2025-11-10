<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->uuid('reference_id')->default(DB::raw('UUID()'));
            $table->foreignId('guest_id')->nullable()->constrained()->nullOnDelete()
                ->cascadeOnUpdate();
            $table->foreignId('reservation_type_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete()
                ->cascadeOnUpdate();
            $table->dateTime('requested_date')->default(DB::raw('CURRENT_DATE'));
            $table->date('service_date')->nullable();
            $table->unsignedSmallInteger('no_of_adults');
            $table->unsignedSmallInteger('no_of_children');
            $table->dateTime('check_in_date');
            $table->dateTime('check_out_date');
            $table->decimal('total_price', 10, 2);
            $table->boolean('is_walkin')->default(false);
            $table->enum('booking_status', ['pending', 'accepted', 'declined', 'cancelled', 'expired', 'done'])->default('pending'); //pending, accepted, declined, cancelled
            $table->time('check_in_time')->nullable();
            $table->time('check_out_time')->nullable();
            $table->timestamps();
            $table->dateTime('expired_at')->nullable();
            $table->text('notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
