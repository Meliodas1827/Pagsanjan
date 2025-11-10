<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
         $this->call(DefaultRoleAndAdminSeeder::class);
         $this->call(RoleSeeder::class);
         $this->call(ReservationTypeSeeder::class);
         $this->call(BoatSeeder::class);
         $this->call(AccountPersonnelSeeder::class);
         $this->call(CustomerAccountSeeder::class);
         $this->call(ResortRoomSeeder::class);






    }
}
