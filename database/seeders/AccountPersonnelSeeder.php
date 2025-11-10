<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AccountPersonnelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          DB::table('users')->updateOrInsert([
            'name' => 'Resort Account',
            'email' => 'resort@gmail.com',
            'password' => Hash::make('Qwerty#23'),
            'role_id' => 4,
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

          DB::table('users')->updateOrInsert([
            'name' => 'Ubaap Account',
            'email' => 'ubaap@gmail.com',
            'password' => Hash::make('Qwerty#23'),
            'role_id' => 5,
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

         DB::table('users')->updateOrInsert([
            'name' => 'Hotel Account',
            'email' => 'hotel@gmail.com',
            'password' => Hash::make('Qwerty#23'),
            'role_id' => 6,
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
