<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Activity;

echo "Updating Invalid Budget cases in Demo Data...\n";

// Case 1: Over Budget
$act1 = Activity::where('kode_pmo', '094.FD')->first();
if ($act1) {
    $act1->update([
        'anggaran_alokasi' => 50000000,
        'anggaran_realisasi' => 55000000, // OVER BUDGET
    ]);
}

// Case 2: No Allocation
$act2 = Activity::where('kode_pmo', '094.FE')->first();
if ($act2) {
    $act2->update([
        'anggaran_alokasi' => 0,
        'anggaran_realisasi' => 10000000, // NO ALLOCATION
    ]);
}

echo "Invalid Budgets updated Successfully!\n";
