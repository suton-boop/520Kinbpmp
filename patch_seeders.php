<?php
$f = 'database/seeders/DummyDataSeeder.php';
$c = file_get_contents($f);
$c = str_replace("GugusMutu::create(['name' => 'GM1-PAUD']);", "GugusMutu::firstOrCreate(['name' => 'GM1- PAUD']);", $c);
$c = str_replace("GugusMutu::create(['name' => 'GM2-SD']);", "GugusMutu::firstOrCreate(['name' => 'GM2-SD']);", $c);
$c = str_replace("GugusMutu::create(['name' => 'GM3-SMP']);", "GugusMutu::firstOrCreate(['name' => 'GM3-SMP']);", $c);
$c = str_replace("GugusMutu::create(['name' => 'GM4-SMA']);", "GugusMutu::firstOrCreate(['name' => 'GM4-SMA']);", $c);
$c = str_replace("GugusMutu::create(['name' => 'GM5- UMUM']);", "GugusMutu::firstOrCreate(['name' => 'GM5- UMUM']);", $c);
file_put_contents($f, $c);

$f = 'database/seeders/RolePermissionSeeder.php';
$c = file_get_contents($f);
$c = str_replace("GugusMutu::firstOrCreate(['name' => 'PAUD']);", "GugusMutu::firstOrCreate(['name' => 'GM1- PAUD']);", $c);
$c = str_replace("GugusMutu::firstOrCreate(['name' => 'SD']);", "GugusMutu::firstOrCreate(['name' => 'GM2-SD']);", $c);
file_put_contents($f, $c);
echo "OK\n";
