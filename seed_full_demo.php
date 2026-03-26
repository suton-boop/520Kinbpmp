<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Activity;
use App\Models\Anggaran;
use App\Models\Period;
use App\Models\ReportSubmission;
use App\Models\User;
use Carbon\Carbon;

echo "Seeding Full Dashboard Data... (Q1 2026)\n";

$period = Period::firstOrCreate(['month_year' => 'Maret 2026']);
$admin = User::where('email', 'admin@admin.com')->first();

if (!$admin) {
    echo "Admin user not found. Aborting.\n";
    exit(1);
}

// Fixed: Added form_type
$submission = ReportSubmission::firstOrCreate(
    ['user_id' => $admin->id, 'period_id' => $period->id],
    ['approval_status' => 'Approved', 'form_type' => 'Aktivitas']
);

Activity::where('report_submission_id', $submission->id)->delete();

$demoActivities = [
    [
        'kode_pmo' => '091.AA',
        'nama_kegiatan_turunan' => 'PENGEMBANGAN MODUL LITERASI DIGITAL UNTUK GURU DAERAH 3T',
        'indikator_kinerja_kegiatan' => 'Tersedianya 5 Modul Literasi bagi Guru',
        'hasil_kegiatan' => '5 MODUL TELAH DIUNGGAH KE PLATFORM MERDEKA MENGAJAR',
        'rencana_start_date' => '2026-01-05',
        'rencana_end_date' => '2026-01-30',
        'realisasi_start_date' => '2026-01-07',
        'realisasi_end_date' => '2026-01-28',
        'status_akhir' => 'Selesai',
        'kode_rrkl' => '091.LIT'
    ],
    [
        'kode_pmo' => '094.FM',
        'nama_kegiatan_turunan' => 'KONSOLIDASI DAERAH: IMPLEMENTASI KURIKULUM MERDEKA TAHAP II',
        'indikator_kinerja_kegiatan' => '100% Kab/Kota Mengikuti Koordinasi',
        'hasil_kegiatan' => 'BA KESEPAKATAN IMPLEMENTASI DITANDATANGANI 25 PEMDA',
        'rencana_start_date' => '2026-02-01',
        'rencana_end_date' => '2026-02-15',
        'realisasi_start_date' => '2026-02-01',
        'realisasi_end_date' => '2026-02-14',
        'status_akhir' => 'Selesai',
        'kode_rrkl' => '094.MER'
    ],
    [
        'kode_pmo' => '094.FD',
        'nama_kegiatan_turunan' => '[TP-1] KOORDINASI PENINGKATAN AKSES LAYANAN PENDIDIKAN INKLUSIF',
        'indikator_kinerja_kegiatan' => 'Draft Juknis Layanan Inklusif Selesai',
        'hasil_kegiatan' => 'DRAFT MASIH DALAM TAHAP REVISI INTERNAL',
        'rencana_start_date' => '2026-01-10',
        'rencana_end_date' => '2026-02-10', 
        'realisasi_start_date' => '2026-01-15',
        'realisasi_end_date' => null,
        'status_akhir' => 'Sudah (Terlambat)',
        'kode_rrkl' => '094.INK'
    ],
    [
        'kode_pmo' => '094.FG',
        'nama_kegiatan_turunan' => '[TP-1] PENDAMPINGAN PROGRAM REVITALISASI SMK UNGGULAN',
        'indikator_kinerja_kegiatan' => '50 SMK Mendapatkan Pendampingan Teknis',
        'hasil_kegiatan' => 'PROSES PENYESUAIAN JADWAL DENGAN KEPALA SEKOLAH',
        'rencana_start_date' => '2026-02-10',
        'rencana_end_date' => '2026-03-10', 
        'realisasi_start_date' => '2026-02-15',
        'realisasi_end_date' => null,
        'status_akhir' => 'Proses',
        'kode_rrkl' => '094.REV',
        'resiko_isu' => 'KETERLAMBATAN KOORDINASI KARENA PERGANTIAN KEPEMIMPINAN DAERAH',
        'solusi' => 'MELAKUKAN PENDEKATAN MELALUI SEKRETARIAT DAERAH DAN RE-SCHEDULING'
    ],
    [
        'kode_pmo' => '091.AA',
        'nama_kegiatan_turunan' => 'DISEMINASI PENILAIAN BERBASIS KOMPUTER UNTUK SD-SMP',
        'indikator_kinerja_kegiatan' => '1000 Guru Terlatih Menggunakan Aplikasi Penilaian',
        'hasil_kegiatan' => 'PELATIHAN TAHAP 1 SELESAI UNTUK 300 GURU',
        'rencana_start_date' => '2026-03-01',
        'rencana_end_date' => '2026-04-15',
        'realisasi_start_date' => '2026-03-05',
        'realisasi_end_date' => null,
        'status_akhir' => 'Proses',
        'kode_rrkl' => '091.PEN',
        'resiko_isu' => 'KURANGNYA PARTISIPASI GURU DI WILAYAH 3T KARENA KENDALA JARINGAN',
        'solusi' => 'SUBSIDI PAKET DATA DAN PENYEDIAAN MODUL OFFLINE (USB DRIVE)'
    ],
    [
        'kode_pmo' => '094.FE',
        'nama_kegiatan_turunan' => 'PENGAWASAN TENAGA AHLI LAPANGAN PADA PROGRAM PEMBANGUNAN GEDUNG',
        'indikator_kinerja_kegiatan' => 'Laporan Pengawasan Mingguan Tersedia',
        'hasil_kegiatan' => 'PROSES PENGAWASAN AREA KALIMANTAN SELESAI',
        'rencana_start_date' => '2026-01-01',
        'rencana_end_date' => '2026-03-31',
        'realisasi_start_date' => '2026-01-05',
        'realisasi_end_date' => null,
        'status_akhir' => 'Proses',
        'kode_rrkl' => 'ERR-001' 
    ],
    [
        'kode_pmo' => '094.FF',
        'nama_kegiatan_turunan' => 'MONEV PELAKSANAAN REVITALISASI SEKOLAH MENENGAH PERTAMA (SMP)',
        'indikator_kinerja_kegiatan' => 'Data Real-time Fisik Tersedia',
        'hasil_kegiatan' => 'LAPORAN MONEV BULAN FEBRUARI TERKIRIM',
        'rencana_start_date' => '2026-02-01',
        'rencana_end_date' => '2026-10-31',
        'realisasi_start_date' => '2026-02-05',
        'realisasi_end_date' => null,
        'status_akhir' => 'Proses',
        'kode_rrkl' => '094.MON'
    ]
];

foreach ($demoActivities as $data) {
    Activity::create(array_merge($data, [
        'report_submission_id' => $submission->id,
        'deskripsi_kegiatan' => 'Kegiatan rutin dalam rangka pencapaian target kerja Triwulan 1 Tahun 2026.',
        'mekanisme_kegiatan' => 'Luring / Daring gabungan',
        'peserta_sasaran' => 'Satuan Pendidikan dan Dinas Pendidikan',
        'tempat_kegiatan' => 'Wilayah Kerja BPMP',
        'rincian_ketersediaan_anggaran' => 'Tersedia dalam DIPA 2026'
    ]));
}

$demoBudgets = [
    ['kode' => '091.LIT', 'nomenklatur' => 'MODUL LITERASI', 'anggaran_alokasi' => 500000000, 'anggaran_realisasi' => 485000000],
    ['kode' => '094.MER', 'nomenklatur' => 'KURIKULUM MERDEKA', 'anggaran_alokasi' => 750000000, 'anggaran_realisasi' => 120000000],
    ['kode' => '094.INK', 'nomenklatur' => 'LAYANAN INKLUSIF', 'anggaran_alokasi' => 300000000, 'anggaran_realisasi' => 315000000],
    ['kode' => '094.MON', 'nomenklatur' => 'MONEV SMP', 'anggaran_alokasi' => 0, 'anggaran_realisasi' => 45000000],
    ['kode' => '091.PEN', 'nomenklatur' => 'PENILAIAN DIGITAL', 'anggaran_alokasi' => 850000000, 'anggaran_realisasi' => 150000000]
];

foreach ($demoBudgets as $bData) {
    Anggaran::updateOrCreate(['kode' => $bData['kode']], $bData);
}

echo "Successfully Seeded Full Demo Data!\n";
