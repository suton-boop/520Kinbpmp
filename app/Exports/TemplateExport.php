<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;
use Illuminate\Support\Collection;

class TemplateExport implements FromCollection, WithHeadings, WithTitle
{
    public function title(): string
    {
        return 'Import Program';
    }

    public function headings(): array
    {
        return [
            'KODE PMO', 
            'NAMA KEGIATAN', 
            'INDIKATOR KINERJA', 
            'HASIL KEGIATAN', 
            'MEKANISME', 
            'EMPTY', 
            'PESERTA SASARAN', 
            'TEMPAT KEGIATAN', 
            'ANGGARAN', 
            'RENCANA MULAI', 
            'RENCANA SELESAI', 
            'KELOMPOK KERJA'
        ];
    }

    public function collection()
    {
        return new Collection([
            [
                '1.1', 
                'Contoh Kegiatan SD', 
                'Indikator Target', 
                'Hasil Laporan', 
                'Workshop', 
                '', 
                'GURU', 
                'JAKARTA', 
                'Rp 10.000.000', 
                'Januari', 
                'Februari', 
                'SD'
            ]
        ]);
    }
}
