<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_submission_id',
        'kode_pmo',
        'kode_rrkl',
        'jumlah_target',
        'jumlah_capaian',
        'resiko_isu',
        'solusi',
        'nama_kegiatan_turunan',
        'deskripsi_kegiatan',
        'hasil_kegiatan',
        'nama_kegiatan_di_dipa',
        'rencana_start_date',
        'rencana_end_date',
        'mekanisme_kegiatan',
        'peserta_sasaran',
        'tempat_kegiatan',
        'rincian_ketersediaan_anggaran',
        'persiapan',
        'realisasi_start_date',
        'realisasi_end_date',
        'laporan',
        'status_akhir',
    ];

    public function reportSubmission()
    {
        return $this->belongsTo(ReportSubmission::class);
    }
}
