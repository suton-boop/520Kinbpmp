<?php
$file = 'c:/Users/suton/.gemini/antigravity/brain/Dasboardkin520/routes/web.php';
$content = file_get_contents($file);

// Replace old Route::get('/anggaran') with resource-like routes
$search = "Route::get('/anggaran', [\App\Http\Controllers\AnggaranController::class, 'index'])->name('anggaran');";
$replace = "Route::get('/anggaran', [\App\Http\Controllers\AnggaranController::class, 'index'])->name('anggaran.index');\n"
         . "    Route::post('/anggaran', [\App\Http\Controllers\AnggaranController::class, 'store'])->name('anggaran.store');\n"
         . "    Route::put('/anggaran/{anggaran}', [\App\Http\Controllers\AnggaranController::class, 'update'])->name('anggaran.update');\n"
         . "    Route::delete('/anggaran/{anggaran}', [\App\Http\Controllers\AnggaranController::class, 'destroy'])->name('anggaran.destroy');";

$content = str_replace($search, $replace, $content);
file_put_contents($file, $content);
echo 'Routes updated.';
