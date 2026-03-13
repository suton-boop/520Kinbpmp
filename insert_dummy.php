use App\Models\User;
use App\Models\ReportSubmission;
use App\Models\Activity;
use App\Models\Period;
use Illuminate\Support\Str;

// Ambil user admin
$user = User::where('email', 'admin@admin.com')->first();
if(!$user) return 'Admin user not found';

// Buat Period untuk tahun 2026 jika belum ada
$periodStr = 'Januari 2026';
$period = Period::firstOrCreate(
    ['month_year' => $periodStr],
    [
        'start_date' => '2026-01-01',
        'end_date' => '2026-01-31',
        'is_active' => true,
    ]
);

// Hapus data lama (opsional, agar tidak duplikat berkali-kali jika dijalankan ulang)
ReportSubmission::where('user_id', $user->id)->where('period_id', $period->id)->delete();

// Buat ReportSubmission
$submission = ReportSubmission::create([
    'user_id' => $user->id,
    'period_id' => $period->id,
    'approval_status' => 'Approved',
    'submitted_at' => now(),
    'approved_at' => now(),
    'reviewer_notes' => 'Disetujui otomatis untuk keperluan demo',
]);

// Buat Activities dummy ala PDM/TP
$dummyActivities = [
    [
        'kode_pmo' => 'TP-01',
        'nama_kegiatan_turunan' => '[TP-01-1] 100% satuan pendidikan pelaksana PSP mengalami peningkatan kualitas',
        'detail_aktivitas' => 'transformasi satdik (a&b)',
        'rencana_start_date' => '2026-01-01',
        'rencana_end_date' => '2026-12-31',
        'realisasi_start_date' => '2026-01-01',
        'realisasi_end_date' => '2026-08-31',
        'is_target_finished' => true,
    ],
    [
        'kode_pmo' => 'TP-02',
        'nama_kegiatan_turunan' => '[TP-02-1] 75% Satuan Pendidikan pelaksana Kurikulum Merdeka Menunjukkan peningkatan kualitas',
        'detail_aktivitas' => 'pemanfaatan PMM melalui progres belajar...',
        'rencana_start_date' => '2026-02-01',
        'rencana_end_date' => '2026-05-31',
        'realisasi_start_date' => null,
        'realisasi_end_date' => null,
        'is_target_finished' => false,
    ],
    [
        'kode_pmo' => 'TP-03A',
        'nama_kegiatan_turunan' => 'Pelaksanaan Asesmen Nasional',
        'detail_aktivitas' => 'Persiapan dan pelaksanaan ANBK',
        'rencana_start_date' => '2026-02-01',
        'rencana_end_date' => '2026-09-30',
        'realisasi_start_date' => null,
        'realisasi_end_date' => null,
        'is_target_finished' => false,
    ],
     [
        'kode_pmo' => 'TP-03B',
        'nama_kegiatan_turunan' => 'Tindak Lanjut Hasil AN',
        'detail_aktivitas' => 'Penyusunan RKT dan RKAS berdasarkan Rapor Pendidikan',
        'rencana_start_date' => '2026-09-01',
        'rencana_end_date' => '2026-12-31',
        'realisasi_start_date' => null,
        'realisasi_end_date' => null,
        'is_target_finished' => false,
    ],
    [
        'kode_pmo' => 'TP-04A',
        'nama_kegiatan_turunan' => 'Pendampingan Daerah',
        'detail_aktivitas' => 'Advokasi kebijakan pendidikan',
        'rencana_start_date' => '2026-04-01',
        'rencana_end_date' => '2026-08-15',
        'realisasi_start_date' => '2026-04-01',
        'realisasi_end_date' => '2026-08-10',
        'is_target_finished' => true,
    ],
    [
        'kode_pmo' => 'TP-04B',
        'nama_kegiatan_turunan' => 'Kemitraan Daerah',
        'detail_aktivitas' => 'MoU dengan Pemda',
        'rencana_start_date' => '2026-03-01',
        'rencana_end_date' => '2026-11-30',
        'realisasi_start_date' => '2026-03-01',
        'realisasi_end_date' => '2026-10-15',
        'is_target_finished' => true,
    ]
];

foreach($dummyActivities as $act) {
    Activity::create(array_merge($act, [
        'report_submission_id' => $submission->id,
        'indikator_kinerja_kegiatan' => 'Indikator Dummy',
        'satuan' => 'Dokumen',
        'rincian_jumlah_target' => 1,
        'rencana_anggaran' => 10000000,
        'sumber_anggaran' => 'APBN',
        'penanggung_jawab' => 'PIC 1',
    ]));
}

echo "Berhasil memasukkan data dummy kegiatan TP untuk admin@admin.com di Tahun 2026";
