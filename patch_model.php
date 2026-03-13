<?php
$file = 'c:/Users/suton/.gemini/antigravity/brain/Dasboardkin520/app/Models/Anggaran.php';
$content = file_get_contents($file);

$replace = <<<EOT
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Anggaran extends Model
{
    use HasFactory;

    protected \$fillable = [
        'parent_id',
        'urut',
        'kode',
        'tipe',
        'nomenklatur',
        'volume',
        'pelaksanaan',
        'anggaran_alokasi',
        'anggaran_realisasi',
        'kelengkapan',
    ];

    protected \$casts = [
        'pelaksanaan' => 'decimal:2',
        'kelengkapan' => 'array',
    ];

    // Get children
    public function children()
    {
        return \$this->hasMany(Anggaran::class, 'parent_id');
    }

    // Get parent
    public function parent()
    {
        return \$this->belongsTo(Anggaran::class, 'parent_id');
    }
}
EOT;

file_put_contents($file, $replace);
echo 'Model patched globally.';
