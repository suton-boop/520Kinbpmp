<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use App\Models\GugusMutu;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Buat Role Baku
        $roleStaff = Role::firstOrCreate(['name' => 'staff']);
        $roleManager = Role::firstOrCreate(['name' => 'manager']);
        $roleAdmin = Role::firstOrCreate(['name' => 'admin']);

        // 2. Gugus Mutu Ensure
        $gugusPaud = GugusMutu::firstOrCreate(['name' => 'GM1- PAUD']);
        $gugusSD = GugusMutu::firstOrCreate(['name' => 'GM2-SD']);
        
        // 3. User Dummies
        $admin = User::firstOrCreate(
            ['email' => 'admin@admin.com'],
            ['name' => 'Admin Pusat', 'password' => Hash::make('password')]
        );
        $admin->assignRole($roleAdmin);

        $managerPaud = User::firstOrCreate(
            ['email' => 'manager_paud@admin.com'],
            ['name' => 'Manajer PAUD', 'password' => Hash::make('password'), 'gugus_mutu_id' => $gugusPaud->id]
        );
        $managerPaud->assignRole($roleManager);

        $managerSD = User::firstOrCreate(
            ['email' => 'manager@manager.com'],
            ['name' => 'Manajer SD Lama', 'password' => Hash::make('password'), 'gugus_mutu_id' => $gugusSD->id]
        );
        $managerSD->assignRole($roleManager);

        $staffPaud = User::firstOrCreate(
            ['email' => 'staff_paud@admin.com'],
            ['name' => 'Staf Pelapor PAUD', 'password' => Hash::make('password'), 'gugus_mutu_id' => $gugusPaud->id]
        );
        $staffPaud->assignRole($roleStaff);

        $staffSD = User::firstOrCreate(
            ['email' => 'user@user.com'],
            ['name' => 'Staf Pelapor SD Lama', 'password' => Hash::make('password'), 'gugus_mutu_id' => $gugusSD->id]
        );
        $staffSD->assignRole($roleStaff);

        echo "Seeder Roles & Permissions berhasil dijalankan dilengkapi user Dummy terikat.\n";
    }
}
