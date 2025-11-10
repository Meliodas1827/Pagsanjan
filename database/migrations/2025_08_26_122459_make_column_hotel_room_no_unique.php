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
     Schema::table('hotel_rooms', function (Blueprint $table){
            $table->string('room_no')->unique()->change();
     });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
       Schema::table('hotel_rooms', function (Blueprint $table){
        $table->dropUnique(['room_no']); // drops the unique constraint
        // If you modified the column in `up()`, you may want to revert that too:
        $table->string('room_no')->change(); // optional, to revert changes
     });
    }
};
