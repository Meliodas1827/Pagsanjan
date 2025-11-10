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
        Schema::create('resto_booking', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resto_id')->constrained('resto')->onDelete('cascade');
            $table->foreignId('resto_table_id')->constrained('resto_tables')->onDelete('cascade');
            $table->boolean('is_book_confirmed')->default(0);
            $table->foreignId('confirmed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('user_id_booker')->constrained('users')->onDelete('cascade');
            $table->integer('no_of_guest');
            $table->boolean('deleted')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resto_booking');
    }
};
