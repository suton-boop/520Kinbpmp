<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Activity;
use App\Models\Anggaran;

echo "Linking Activities to Anggarans...\n";

// Ensure '094.FM' activity is linked to existing 094.FM budget
Activity::where('kode_pmo', '094.FM')->update(['kode_rrkl' => '094.FM']);

// Create an OVER BUDGET case for 091.AA
Anggaran::updateOrCreate(
    ['kode' => '091.AA'],
    ['nomenklatur' => 'Budget Diseminasi', 'anggaran_alokasi' => 1000000, 'anggaran_realisasi' => 1200000] // OVER BUDGET
);
Activity::where('kode_pmo', '091.AA')->update(['kode_rrkl' => '091.AA']);

// Case: Activity with invalid/missing link (NO ALLOCATION)
Activity::where('kode_pmo', '094.FE')->update(['kode_rrkl' => 'INVALID_CODE']);

echo "Done!\n";
