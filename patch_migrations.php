<?php
$file = 'c:/Users/suton/.gemini/antigravity/brain/Dasboardkin520/database/migrations/2026_03_02_214212_create_anggarans_table.php';
$content = file_get_contents($file);
$search = '        Schema::create(\'anggarans\', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });';
$replace = '        Schema::create(\'anggarans\', function (Blueprint $table) {
            $table->id();
            $table->foreignId(\'parent_id\')->nullable()->constrained(\'anggarans\')->onDelete(\'cascade\');
            $table->integer(\'urut\')->nullable();
            $table->string(\'kode\');
            $table->string(\'tipe\')->nullable();
            $table->text(\'nomenklatur\');
            $table->string(\'volume\')->nullable();
            $table->decimal(\'pelaksanaan\', 5, 2)->default(0);
            $table->bigInteger(\'anggaran_alokasi\')->default(0);
            $table->bigInteger(\'anggaran_realisasi\')->default(0);
            $table->json(\'kelengkapan\')->nullable();
            $table->timestamps();
        });';
$content = str_replace($search, $replace, $content);
file_put_contents($file, $content);
echo 'Migration patched successfully.';
