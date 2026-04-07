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
    protected $reportId;
    public $rowCount = 0;

    public function __construct($gugusMutuId = null, $reportId = null)
    {
        $this->gugusMutuId = $gugusMutuId;
        $this->reportId = $reportId;
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
            $bulan = $row[9] ?? '';    
            $gm_name_raw = trim($row[11] ?? '');

            if (preg_match('/^[A-Z](\.)?$/i', $kode) || preg_match('/^[A-Z]\./i', $kode)) {
                $this->currentProgram = $kegiatan;
                continue;
            }

            if (empty($kegiatan)) continue;

            $submission = null;
            if ($this->reportId) {
                $submission = ReportSubmission::find($this->reportId);
            }

            if (!$submission) {
                $gm = null;
                if (!empty($gm_name_raw)) {
                    $clean_gm_name = preg_replace('/[^A-Za-z0-9]/', '', $gm_name_raw);
                    
                    $allGMs = GugusMutu::all();
                    foreach ($allGMs as $g) {
                        $clean_db_name = preg_replace('/[^A-Za-z0-9]/', '', $g->name);
                        if (stripos($clean_db_name, $clean_gm_name) !== false || stripos($clean_gm_name, $clean_db_name) !== false) {
                            $gm = $g;
                            break;
                        }
                    }
                }

                if (!$gm && $this->gugusMutuId) {
                    $gm = GugusMutu::find($this->gugusMutuId);
                }
                
                $userId = null;
                if ($gm) {
                    $operator = $gm->users()->whereHas('roles', function($q) {
                        $q->whereIn('name', ['user', 'staff']);
                    })->first();
                    $userId = $operator ? $operator->id : $gm->users()->first()?->id;
                }
                
                if (!$userId) $userId = auth()->id();

                $submission = ReportSubmission::firstOrCreate([
                    'user_id' => $userId,
                    'period_id' => $this->period->id,
                    'form_type' => 'plan',
                ], [
                    'approval_status' => 'Draft',
                ]);
            }

            if (!$submission) continue;

            Activity::create([
                'report_submission_id' => $submission->id,
                'kode_pmo' => $kode,
                'nama_kegiatan_turunan' => $kegiatan,
                'deskripsi_kegiatan' => $indikator,
                'hasil_kegiatan' => $hasil, 
                'mekanisme_kegiatan' => $mekanisme,
                'peserta_sasaran' => $peserta,
                'tempat_kegiatan' => $tempat,
                'jumlah_target' => 1,
                'kode_rrkl' => $anggaran,
                'rencana_start_date' => $this->parseDate($bulan),
                'rencana_end_date' => $this->parseDate($bulan),
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
            if (str_contains($lower, $m)) return date('Y') . "-$num-01";
        }
        return null;
    }
}
