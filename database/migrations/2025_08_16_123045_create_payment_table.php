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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->nullable()->nullOnDelete()->cascadeOnUpdate();
            // Transaction Id/reference
            $table->string('transaction_ref')->unique();
            $table->decimal('amount_paid', 10, 2)->default(0);
            $table->dateTime('payment_date')->nullable();
            $table->string('payment_method')->nullable(); //cash, gcash, paymaya, bpi etc.
            $table->enum('payment_type', ['remaining_balance', 'full_payment', 'down_payment'])->nullable();//remaining_balance, full_payment,
            $table->enum('payment_status', ['pending', 'completed', 'refunded'])->default('pending'); //pending, completed, refunded
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
