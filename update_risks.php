<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Activity;

echo "Updating Risks and Issues in Demo Data...\n";

$act1 = Activity::where('kode_pmo', '094.FG')->first();
if ($act1) {
    $act1->update([
        'resiko_isu' => 'Keterlambatan koordinasi dengan Pemda setempat dikarenakan pergantian kepemimpinan daerah.',
        'solusi' => 'Melakukan pendekatan melalui sekretariat daerah dan menjadwalkan ulang pertemuan advokasi.',
    ]);
}

$act2 = Activity::where('kode_pmo', '091.AA')->first();
if ($act2) {
    $act2->update([
        'resiko_isu' => 'Kurangnya partisipasi dari satuan pendidikan di wilayah 3T dikarenakan kendala jaringan.',
        'solusi' => 'Memberikan subsidi ketersediaan paket data dan modul offline bagi daerah terdampak.',
    ]);
}

echo "Risks and Issues updated Successfully!\n";
