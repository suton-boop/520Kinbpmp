use App\Models\User;
use App\Models\GugusMutu;
use Illuminate\Support\Facades\Hash;

// Pastikan ada Gugus Mutu
$gugusPaud = GugusMutu::firstOrCreate(['name' => 'PAUD']);
$gugusSD = GugusMutu::firstOrCreate(['name' => 'SD']);
$gugusSMP = GugusMutu::firstOrCreate(['name' => 'SMP']);

// Buat User Staff Pelapor
$staffPaud = User::firstOrCreate(
    ['email' => 'staff_paud@admin.com'],
    [
        'name' => 'Staff PAUD',
        'password' => Hash::make('password'),
        'gugus_mutu_id' => $gugusPaud->id
    ]
);
$staffPaud->assignRole('staff');

$staffSD = User::firstOrCreate(
    ['email' => 'staff_sd@admin.com'],
    [
        'name' => 'Staff SD',
        'password' => Hash::make('password'),
        'gugus_mutu_id' => $gugusSD->id
    ]
);
$staffSD->assignRole('staff');

// Buat User Manager
$managerPaud = User::firstOrCreate(
    ['email' => 'manager_paud@admin.com'],
    [
        'name' => 'Manager PAUD',
        'password' => Hash::make('password'),
        'gugus_mutu_id' => $gugusPaud->id
    ]
);
$managerPaud->assignRole('manager');

$managerSD = User::firstOrCreate(
    ['email' => 'manager_sd@admin.com'],
    [
        'name' => 'Manager SD',
        'password' => Hash::make('password'),
        'gugus_mutu_id' => $gugusSD->id
    ]
);
$managerSD->assignRole('manager');

echo "Berhasil membuat 4 user dummy baru: Staf dan Manager Gugus PAUD/SD (password: 'password').\n";
