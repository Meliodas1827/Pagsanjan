<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Insert landing area admin role
        DB::table('roles')->insert([
            'id' => 8,
            'role_name' => 'landing_area',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Add landing_area_id column to users table
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('landing_area_id')->nullable()->constrained('landing_areas')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove landing_area_id column from users table
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['landing_area_id']);
            $table->dropColumn('landing_area_id');
        });

        // Delete landing area admin role
        DB::table('roles')->where('id', 8)->delete();
    }
};
