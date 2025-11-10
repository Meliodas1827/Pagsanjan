<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BoatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('boats')->insert([
            [
                'boat_no' => 'B001',
                'bankero_name' => 'Juan Dela Cruz',
                'capacity' => 10,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'boat_no' => 'B002',
                'bankero_name' => 'Pedro Santos',
                'capacity' => 8,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'boat_no' => 'B003',
                'bankero_name' => 'Maria Lopez',
                'capacity' => 12,
                'status' => 'available',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);


        DB::table('boat_pricings')->updateOrInsert([
              'created_at' => now(),
              'updated_at' => now(),
              'price_per_adult' => 250,
              'price_per_child' => 150,
        ]);

    //     BoatPricing::updateOrCreate(
    // ['id' => 1], // condition
    // [
    //     'price_per_adult' => 250,
    //     'price_per_child' => 150,
    // ]
    }
}
