<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

foreach(\App\Models\Anggaran::all() as $a) {
    echo "KODE: {$a->kode}, A: {$a->anggaran_alokasi}, R: {$a->anggaran_realisasi}\n";
}
