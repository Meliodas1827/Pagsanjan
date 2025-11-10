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
        Schema::create('landing_areas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('location')->nullable();
            $table->string('address')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('capacity')->nullable()->comment('Maximum number of people that can be picked up');
            $table->string('image')->nullable();
            $table->decimal('price', 10, 2)->nullable()->comment('Additional fee for this landing area');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('landing_areas');
    }
};
