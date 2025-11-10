<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;


class DefaultRoleAndAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('roles')->updateOrInsert(
            ['role_name' => 'admin'],
            ['created_at' => now(), 'updated_at' => now()]
        );

        $roleId = DB::table('roles')->where('role_name', 'admin')->value('id');

        // Create default admin user if not exists
        DB::table('users')->updateOrInsert([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'), // change later for security
            'role_id' => $roleId,
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
