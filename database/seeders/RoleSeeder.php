<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = ['staff', 'customer', 'resort', 'ubaap', 'hotel'];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['role_name' => $role], // condition (check by role_name)
                [
                    'created_at' => now(),
                    'updated_at' => now(),
                ] // update values
            );
        }
    }
}
