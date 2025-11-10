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
        Schema::create('room_features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained()->onDelete('cascade');

            // Feature categorization
            $table->string('category', 50); // personal_care, entertainment, refreshments, etc.
            $table->string('feature_name', 100);
            $table->string('feature_value')->nullable();
            $table->text('description')->nullable();

            // Display order
            $table->unsignedInteger('sort_order')->default(0);

            // Icon or image for the feature
            $table->string('icon')->nullable();

            $table->timestamps();

            // Indexes
            $table->index('room_id');
            $table->index('category');
            $table->index(['room_id', 'category']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_features');
    }
};
