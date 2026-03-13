<?php
$file = 'c:/Users/suton/.gemini/antigravity/brain/Dasboardkin520/database/seeders/DummyDataSeeder.php';
$content = file_get_contents($file);

$search = "        // 1. Data Gugus Mutu\n" .
          "        \$gugusIT = GugusMutu::create(['name' => 'Gugus Mutu IT']);\n" .
          "        \$gugusHR = GugusMutu::create(['name' => 'Gugus Mutu HR']);";

$replace = "        // 1. Data Gugus Mutu\n" .
           "        \$gugusIT = GugusMutu::create(['name' => 'GM1-PAUD']);\n" .
           "        \$gugusHR = GugusMutu::create(['name' => 'GM2-SD']);\n" .
           "        GugusMutu::create(['name' => 'GM3-SMP']);\n" .
           "        GugusMutu::create(['name' => 'GM4-SMA']);\n" .
           "        GugusMutu::create(['name' => 'GM5- UMUM']);";

$content = str_replace($search, $replace, $content);
file_put_contents($file, $content);
echo 'Seeder patched successfully.';
