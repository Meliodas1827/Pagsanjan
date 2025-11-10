<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CustomerAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          DB::table('users')->updateOrInsert([
            'name' => 'Customer Chog',
            'email' => 'abcdef@gmail.com',
            'password' => Hash::make('Qwerty#23'),
            'role_id' => 3,
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

           DB::table('guests')->updateOrInsert([
            'user_id' => 5, 
            'first_name' => 'Customer',
            'last_name' => 'Chog',
            'address' => 'Brgy. Dyan Lang Calamba City, Laguna, Philippines 4027',
            'phone' => '09123456791',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
