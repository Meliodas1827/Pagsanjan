<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class ReservationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reservation_types = ['resort', 'hotel', 'restaurant', 'landing-area'];

        foreach ($reservation_types as $reservation_type) {
           DB::table('reservation_types')->updateOrInsert(
                ['reservation_type' => $reservation_type], 
                  ['created_at' => now()], 
                    ['updated_at' => now()], 
            );
        }
    }
}
