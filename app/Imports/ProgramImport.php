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

    public function __construct($gugusMutuId = null)
    {
        $this->gugusMutuId = $gugusMutuId;
        // Default period jika tidak ditentukan
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
            $anggaran = $row[8] ?? '';
            $start = $row[9] ?? '';
            $end = $row[10] ?? '';
            $gm_name = trim($row[11] ?? '');

            // Deteksi Judul Program (A. , B. , dst)
            if (preg_match('/^[A-Z]\./i', $kode)) {
                $this->currentProgram = $kegiatan;
                continue;
            }

            if (empty($kegiatan)) continue;

            // 1. Cari Gugus Mutu - PRIORITAS: Kolom di Excel dulu, baru dropdown
            $gm = null;
            if (!empty($gm_name)) {
                $gm = GugusMutu::where('name', 'like', '%' . $gm_name . '%')->first();
            }

            // Jika di Excel kosong atau tidak ditemukan, baru gunakan pilihan dari UI
            if (!$gm && $this->gugusMutuId) {
                $gm = GugusMutu::find($this->gugusMutuId);
            }

            // 2. Cari User (Operator/User) di Gugus Mutu tersebut
            $userId = null;
            if ($gm) {
                // Cari user dengan role 'user' (Operator) di GM ini
                $operator = $gm->users()->whereHas('roles', function($q) {
                    $q->where('name', 'user');
                })->first();
                
                if ($operator) {
                    $userId = $operator->id;
                } else {
                    // Fallback ke manager jika operator tidak ada
                    $manager = $gm->users()->whereHas('roles', function($q) {
                        $q->where('name', 'manager');
                    })->first();
                    if ($manager) {
                        $userId = $manager->id;
                    }
                }
            }

            // 3. Last Fallback jika GM tidak ditemukan atau tidak ada user
            if (!$userId) {
                $fallbackUser = User::whereHas('roles', function($q) {
                    $q->where('name', 'user');
                })->first();
                $userId = $fallbackUser ? $fallbackUser->id : ($gm ? ($gm->users()->first() ? $gm->users()->first()->id : (User::first() ? User::first()->id : null)) : (User::first() ? User::first()->id : null));
            }

            if (!$userId) continue;

            // 4. Pastikan ReportSubmission ada untuk User tersebut
            // Kita anggap import admin ini membuat 'Rencana' yang sudah 'Approved' agar bisa diproses langsung
            $submission = ReportSubmission::firstOrCreate([
                'user_id' => $userId,
                'period_id' => $this->period->id,
                'form_type' => 'Rencana',
            ], [
                'approval_status' => 'Approved',
            ]);

            // 5. Buat Activity
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
        }
    }

    private function parseDate($val)
    {
        if (empty($val)) return null;
        $map = [
            'januari' => '01', 'februari' => '02', 'maret' => '03', 'april' => '04',
            'mei' => '05', 'juni' => '06', 'juli' => '07', 'agustus' => '08',
            'september' => '09', 'oktober' => '10', 'november' => '11', 'desember' => '12',
            'jan' => '01', 'feb' => '02', 'mar' => '03', 'apr' => '04', 'may' => '05',
            'jun' => '06', 'jul' => '07', 'aug' => '08', 'sep' => '09', 'oct' => '10',
            'nov' => '11', 'dec' => '12'
        ];

        $lower = strtolower($val);
        foreach ($map as $m => $num) {
            if (str_contains($lower, $m)) {
                return date('Y') . "-$num-01";
            }
        }
        return null; // Fallback ke null jika format tidak dikenal
    }
}
