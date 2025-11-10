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
        Schema::create('room_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained()->onDelete('cascade');

            // Image details
            $table->string('image_path');
            $table->string('image_name')->nullable();
            $table->string('caption')->nullable();
            $table->text('alt_text')->nullable();

            // Image type
            $table->enum('image_type', ['main', 'gallery', 'thumbnail', 'floor_plan'])
                ->default('gallery');

            // Display order
            $table->unsignedInteger('sort_order')->default(0);

            // Image metadata
            $table->string('mime_type', 50)->nullable();
            $table->unsignedInteger('file_size')->nullable(); // in bytes
            $table->unsignedSmallInteger('width')->nullable();
            $table->unsignedSmallInteger('height')->nullable();

            // Status
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            // Indexes
            $table->index('room_id');
            $table->index('image_type');
            $table->index(['room_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_images');
    }
};
