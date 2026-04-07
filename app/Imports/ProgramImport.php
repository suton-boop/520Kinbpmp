<?php

namespace App\Imports;

use App\Models\Activity;
use App\Models\ReportSubmission;
use App\Models\GugusMutu;
use App\Models\Period;
use App\Models\User;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Illuminate\Support\Facades\Log;

class ProgramImport implements ToCollection, WithStartRow
{
    protected $period = null;
    protected $currentProgram;
    protected $gugusMutuId;
    public $rowCount = 0;

    public function __construct($gugusMutuId = null)
    {
        $this->gugusMutuId = $gugusMutuId;
        $this->period = Period::firstOrCreate(
            ['month_year' => '01-2026'],
            ['start_date' => '2026-01-01', 'end_date' => '2026-12-31']
        );
    }

    public function startRow(): int
    {
        return 2;
    }

    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $kode = trim($row[0] ?? '');
            $kegiatan = $row[1] ?? '';
            $indikator = $row[2] ?? '';
            $hasil = $row[3] ?? '';
            $mekanisme = $row[4] ?? '';
            $peserta = $row[6] ?? '';
            $tempat = $row[7] ?? '';
            
            // J (Index 9) = Anggaran, K (Index 10) = Bulan, L (Index 11) = GM
            $anggaran = $row[9] ?? ''; 
            $start = $row[10] ?? '';
            $end = $row[10] ?? '';
            $gm_name = trim($row[11] ?? '');

            if (preg_match('/^[A-Z](\.)?$/i', $kode) || preg_match('/^[A-Z]\./i', $kode)) {
                $this->currentProgram = $kegiatan;
                continue;
            }

            if (empty($kegiatan)) continue;

            // 1. Cari Gugus Mutu
            $gm = null;
            if (!empty($gm_name)) {
                $gm = GugusMutu::where('name', 'like', '%' . $gm_name . '%')->first();
            }

            if (!$gm && $this->gugusMutuId) {
                $gm = GugusMutu::find($this->gugusMutuId);
            }

            // Jika GM tidak ketemu, skip baris ini
            if (!$gm) {
                Log::warning("Import Skip: Gugus Mutu tidak ditemukan untuk nama: $gm_name");
                continue;
            }

            // 2. Cari User yang akan menampung data (Utamakan Operator, lalu Admin GM/Manager)
            $userId = null;
            
            // Cari operator (staff/user)
            $operator = $gm->users()->whereHas('roles', function($q) {
                $q->whereIn('name', ['user', 'staff']);
            })->first();
            
            if ($operator) {
                $userId = $operator->id;
            } else {
                // Jika tidak ada operator, cari Manager (Admin GM)
                $manager = $gm->users()->whereHas('roles', function($q) {
                    $q->whereIn('name', ['manager', 'admin']);
                })->first();
                if ($manager) {
                    $userId = $manager->id;
                } else {
                    // Terakhir, ambil user pertama yang ada di GM tersebut
                    $anyUser = $gm->users()->first();
                    $userId = $anyUser ? $anyUser->id : null;
                }
            }

            // Fallback terakhir ke user yang sedang login jika benar-benar buntu
            if (!$userId) {
                $userId = auth()->id();
            }

            if (!$userId) {
                Log::error("Import Gagal: Tidak ada user target untuk GM: " . $gm->name);
                continue;
            }

            // 3. Buat/Ambil ReportSubmission (Pastikan form_type seragam: plan)
            $submission = ReportSubmission::firstOrCreate([
                'user_id' => $userId,
                'period_id' => $this->period->id,
                'form_type' => 'plan', // Disamakan dengan sistem (sebelumnya 'Rencana')
            ], [
                'approval_status' => 'Draft', // Gunakan Draft agar bisa diedit dulu
            ]);

            // 4. Activity
            Activity::create([
                'report_submission_id' => $submission->id,
                'kode_pmo' => $kode,
                'nama_kegiatan_turunan' => $kegiatan,
                'deskripsi_kegiatan' => $indikator,
                'hasil_kegiatan' => $hasil,
                'mekanisme_kegiatan' => $mekanisme,
                'peserta_sasaran' => $peserta,
                'tempat_kegiatan' => $tempat,
                'rincian_ketersediaan_anggaran' => $anggaran,
                'rencana_start_date' => $this->parseDate($start),
                'rencana_end_date' => $this->parseDate($end),
                'nama_kegiatan_di_dipa' => $this->currentProgram,
                'status_akhir' => 'Belum',
            ]);
            
            $this->rowCount++;
        }
    }

    private function parseDate($val)
    {
        if (empty($val)) return null;
        $map = [
            'januari' => '01', 'februari' => '02', 'maret' => '03', 'april' => '04',
            'mei' => '05', 'juni' => '06', 'juli' => '07', 'agustus' => '08',
            'september' => '09', 'oktober' => '10', 'november' => '11', 'desember' => '12'
        ];

        $lower = strtolower($val);
        foreach ($map as $m => $num) {
            if (str_contains($lower, $m)) {
                return date('Y') . "-$num-01";
            }
        }
        return null;
    }
}
