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
        Schema::create('room_inventory', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained()->onDelete('cascade');

            // Room identification
            $table->string('room_number', 20)->unique();
            $table->string('room_code', 20)->nullable()->unique();

            // Status
            $table->enum('status', ['available', 'occupied', 'maintenance', 'reserved', 'blocked'])
                ->default('available');

            // Notes
            $table->text('notes')->nullable();

            // Maintenance tracking
            $table->timestamp('last_maintenance_date')->nullable();
            $table->timestamp('next_maintenance_date')->nullable();

            // Status tracking
            $table->timestamp('status_changed_at')->nullable();
            $table->foreignId('status_changed_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            // Indexes
            $table->index('room_id');
            $table->index('status');
            $table->index('room_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_inventory');
    }
};
