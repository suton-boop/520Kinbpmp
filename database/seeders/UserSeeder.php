<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\GugusMutu;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
         = [" GM1- PAUD\, \GM2-SD\, \GM3-SMP\, \GM4-SMA\, \GM5- UMUM\];
 foreach (\ as \) { GugusMutu::firstOrCreate([\name\ => \]); }

 \ = [
 [\name\ => \Administrator\, \email\ => \admin@admin.com\, \role\ => \admin\, \gugus\ => null],
 [\name\ => \Manager\, \email\ => \manager@manager.com\, \role\ => \manager\, \gugus\ => \GM1- PAUD\],
 [\name\ => \Manajer PAUD\, \email\ => \manager_paud@admin.com\, \role\ => \manager\, \gugus\ => \GM1- PAUD\],
 [\name\ => \Staf Pelapor PAUD\, \email\ => \staff_paud@admin.com\, \role\ => \user\, \gugus\ => \GM1- PAUD\],
 [\name\ => \Sofianur\, \email\ => \sofianur@gmail.com\, \role\ => \user\, \gugus\ => \GM1- PAUD\],
 [\name\ => \Admin GM1- PAUD\, \email\ => \gm1_admin@admin.com\, \role\ => \admin\, \gugus\ => \GM1- PAUD\],
 [\name\ => \Operator GM1- PAUD\, \email\ => \gm1_operator@admin.com\, \role\ => \user\, \gugus\ => \GM1- PAUD\],
 [\name\ => \Admin GM2-SD\, \email\ => \gm2_admin@admin.com\, \role\ => \admin\, \gugus\ => \GM2-SD\],
 [\name\ => \Operator GM2-SD\, \email\ => \gm2_operator@admin.com\, \role\ => \user\, \gugus\ => \GM2-SD\],
 [\name\ => \Admin GM3-SMP\, \email\ => \gm3_admin@admin.com\, \role\ => \admin\, \gugus\ => \GM3-SMP\],
 [\name\ => \Operator GM3-SMP\, \email\ => \gm3_operator@admin.com\, \role\ => \user\, \gugus\ => \GM3-SMP\],
 [\name\ => \Admin GM4-SMA\, \email\ => \gm4_admin@admin.com\, \role\ => \admin\, \gugus\ => \GM4-SMA\],
 [\name\ => \Operator GM4-SMA\, \email\ => \gm4_operator@admin.com\, \role\ => \user\, \gugus\ => \GM4-SMA\],
 [\name\ => \Admin GM5- UMUM\, \email\ => \gm5_admin@admin.com\, \role\ => \admin\, \gugus\ => \GM5- UMUM\],
 [\name\ => \Operator GM5- UMUM\, \email\ => \gm5_operator@admin.com\, \role\ => \user\, \gugus\ => \GM5- UMUM\],
 [\name\ => \Pegawai IT\, \email\ => \user_it@user.com\, \role\ => \user\, \gugus\ => \GM1- PAUD\],
 [\name\ => \Pegawai HR\, \email\ => \user_hr@user.com\, \role\ => \user\, \gugus\ => \GM2-SD\],
 ];

 foreach (\ as \) {
 \ = null;
 if (\[\gugus\]) {
 \ = GugusMutu::where(\name\, \[\gugus\])->first();
 \ = \ ? \->id : null;
 }
 \ = User::firstOrCreate([\email\ => \[\email\]], [\name\ => \[\name\], \password\ => Hash::make(\password\), \gugus_mutu_id\ => \]);
 \->assignRole(\[\role\]);
 }
 }
}
