<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\GugusMutu;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;

$gms = [
    'gm1' => 'GM1- PAUD',
    'gm2' => 'GM2-SD',
    'gm3' => 'GM3-SMP',
    'gm4' => 'GM4-SMA',
    'gm5' => 'GM5- UMUM'
];

$roleManager = Role::firstOrCreate(['name' => 'manager']);
$roleStaff = Role::firstOrCreate(['name' => 'staff']);

foreach ($gms as $prefix => $gmName) {
    $gm = GugusMutu::firstOrCreate(['name' => $gmName]);

    $managerEmail = $prefix . '_admin@admin.com';
    $managerUser = User::updateOrCreate(
        ['email' => $managerEmail],
        [
            'name' => 'Admin ' . $gmName,
            'password' => Hash::make('password'),
            'gugus_mutu_id' => $gm->id
        ]
    );
    if (!$managerUser->hasRole('manager')) {
        $managerUser->assignRole($roleManager);
    }

    $staffEmail = $prefix . '_operator@admin.com';
    $staffUser = User::updateOrCreate(
        ['email' => $staffEmail],
        [
            'name' => 'Operator ' . $gmName,
            'password' => Hash::make('password'),
            'gugus_mutu_id' => $gm->id
        ]
    );
    if (!$staffUser->hasRole('staff')) {
        $staffUser->assignRole($roleStaff);
    }
}
echo "OK\n";
