<?php
require __DIR__."/vendor/autoload.php";
$app = require_once __DIR__."/bootstrap/app.php";
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\GugusMutu;

$mapping = [
    "PAUD"      => "GM1- PAUD",
    "GM1-PAUD"  => "GM1- PAUD",
    "SD"        => "GM2-SD",
    "SMP"       => "GM3-SMP",
    "SMA"       => "GM4-SMA",
    "Umum"      => "GM5- UMUM",
    "UMUM"      => "GM5- UMUM",
    "GM5-UMUM"  => "GM5- UMUM",
];

$gugusList = GugusMutu::all();
foreach ($gugusList as $g) {
    if (isset($mapping[$g->name])) {
        $oldId = $g->id;
        $newName = $mapping[$g->name];
        
        $target = GugusMutu::where("name", $newName)->where("id", "!=", $oldId)->first();
        if ($target) {
            \App\Models\User::where("gugus_mutu_id", $oldId)->update(["gugus_mutu_id" => $target->id]);
            $g->delete();
        } else {
            $g->name = $newName;
            $g->save();
        }
    }
}

$wanted = [
    "GM1- PAUD",
    "GM2-SD",
    "GM3-SMP",
    "GM4-SMA",
    "GM5- UMUM"
];

foreach ($wanted as $w) {
    GugusMutu::firstOrCreate(["name" => $w]);
}

echo "OK\n";
