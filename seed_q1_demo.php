<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Period;
use App\Models\ReportSubmission;
use App\Models\Activity;

echo "Seeding Q1 Demo Data...\n";

$admin = User::where('email', 'admin@admin.com')->first();
$periodJan = Period::firstOrCreate(['month_year' => '01-2026']);

// Create a main submission for Admin to hold these activities
$submission = ReportSubmission::updateOrCreate(
    ['user_id' => $admin->id, 'period_id' => $periodJan->id],
    ['form_type' => 'Rencana', 'approval_status' => 'Approved']
);

// Delete old demo activities to avoid duplicates
Activity::where('report_submission_id', $submission->id)->delete();

$activities = [
    [
        'kode_pmo' => '094.FM',
        'nama_kegiatan_turunan' => 'Konsolidasi Daerah Kebijakan Pendidikan Tahun 2026',
        'rencana_start_date' => '2026-02-01',
        'rencana_end_date' => '2026-02-28',
        'realisasi_start_date' => '2026-02-05',
        'realisasi_end_date' => '2026-02-27',
        'status_akhir' => 'Selesai',
    ],
    [
        'kode_pmo' => '091.AA',
        'nama_kegiatan_turunan' => 'Diseminasi Pembelajaran dan Penilaian ke Pemda dan Satuan Pendidikan',
        'rencana_start_date' => '2026-03-01',
        'rencana_end_date' => '2026-04-30',
        'realisasi_start_date' => '2026-03-10',
        'realisasi_end_date' => null,
        'status_akhir' => 'Proses',
    ],
    [
        'kode_pmo' => '094.FD',
        'nama_kegiatan_turunan' => '[TP - 1] Koordinasi dengan Pemda Dalam Peningkatan Akses Layanan',
        'rencana_start_date' => '2026-01-01',
        'rencana_end_date' => '2026-10-31',
        'realisasi_start_date' => '2026-01-15',
        'realisasi_end_date' => null,
        'status_akhir' => 'Proses',
    ],
    [
        'kode_pmo' => '094.FE',
        'nama_kegiatan_turunan' => '[TP - 1] Pengawasan Tenaga Ahli Lapangan dalam Program Revitalisasi',
        'rencana_start_date' => '2026-01-01',
        'rencana_end_date' => '2026-09-30',
        'realisasi_start_date' => '2026-01-20',
        'realisasi_end_date' => null,
        'status_akhir' => 'Proses',
    ],
    [
        'kode_pmo' => '094.FF',
        'nama_kegiatan_turunan' => '[TP - 1] Monitoring dan Evaluasi Pelaksanaan Revitalisasi Sekolah',
        'rencana_start_date' => '2026-01-01',
        'rencana_end_date' => '2026-09-30',
        'realisasi_start_date' => '2026-01-25',
        'realisasi_end_date' => null,
        'status_akhir' => 'Proses',
    ],
    [
        'kode_pmo' => '094.FG',
        'nama_kegiatan_turunan' => '[TP - 1] Pendampingan Pelaksanaan Program Revitalisasi',
        'rencana_start_date' => '2026-01-01',
        'rencana_end_date' => '2026-02-15', // LATE (Tenggat waktu sudah lewat)
        'realisasi_start_date' => '2026-01-10',
        'realisasi_end_date' => null,
        'status_akhir' => 'Belum Selesai',
    ]
];

foreach ($activities as $act) {
    Activity::create(array_merge($act, [
        'report_submission_id' => $submission->id,
        'deskripsi_kegiatan' => 'Demo data untuk visualisasi dashboard.',
        'indikator_kinerja_kegiatan' => 'Terlaksananya kegiatan ' . $act['kode_pmo'],
        'satuan' => 'Dokumen',
        'rincian_jumlah_target' => 1,
    ]));
}

echo "Q1 Demo Data Seeded Successfully!\n";
