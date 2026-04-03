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

class ProgramImport implements ToCollection, WithStartRow
{
    protected $period = null;
    protected $currentProgram;
    protected $gugusMutuId;

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
            $kode = trim($row[0]);
            $kegiatan = $row[1];
            $indikator = $row[2];
            $hasil = $row[3];
            $mekanisme = $row[4];
            $peserta = $row[6];
            $tempat = $row[7];
            $anggaran = $row[8];
            $start = $row[9];
            $end = $row[10];
            $gm_name = $row[11];

            if (preg_match('#^[A-Z]\.#i', $kode)) {
                $this->currentProgram = $kegiatan;
                continue;
            }

            if (empty($kegiatan)) continue;

            $gm = null;
            if ($this->gugusMutuId) {
                $gm = GugusMutu::find($this->gugusMutuId);
            } elseif ($gm_name) {
                $gm = GugusMutu::where('name', 'like', '%' . $gm_name . '%')->first();
            }

            $userId = null;
            if ($gm) {
                $staff = $gm->users()->whereHas('roles', function($q) {
                    $q->where('name', 'staff');
                })->first();
                if ($staff) {
                    $userId = $staff->id;
                }
            }

            if (!$userId) {
                $fallback = User::whereHas('roles', function($q) {
                    $q->where('name', 'staff');
                })->first();
                $userId = $fallback ? $fallback->id : (User::first() ? User::first()->id : null);
            }

            if (!$userId) continue;

            $submission = ReportSubmission::firstOrCreate([
                'user_id' => $userId,
                'period_id' => $this->period->id,
            ], [
                'form_type' => 'plan',
                'approval_status' => 'Draft',
            ]);

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
                return "2026-$num-01";
            }
        }
        return null;
    }
}
