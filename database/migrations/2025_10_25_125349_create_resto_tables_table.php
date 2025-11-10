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
        Schema::create('resto_tables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resto_id')->constrained('resto')->onDelete('cascade');
            $table->enum('status', ['reserved', 'available'])->default('available');
            $table->integer('no_of_chairs');
            $table->decimal('price', 10, 2);
            $table->boolean('deleted')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resto_tables');
    }
};
