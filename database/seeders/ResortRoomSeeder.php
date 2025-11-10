<?php

namespace Database\Seeders;

use App\Models\ResortRoom;
use Database\Factories\ResortFactory;
use Illuminate\Database\Seeder;

class ResortRoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ResortRoom::factory()->count(8)->create();
    }
}
