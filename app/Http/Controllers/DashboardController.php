<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Activity;
use App\Models\ReportSubmission;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $year = $request->input('year', date('Y'));

        $reportQuery = ReportSubmission::with(['user.gugusMutu', 'period'])
            ->whereHas('period', function ($q) use ($year) {
                $q->where('month_year', 'like', "%{$year}%");
            });

        if ($user->hasRole('staff') && $user->gugus_mutu_id) {
            $reportQuery->where('user_id', $user->id);
        } elseif ($user->hasRole('manager') && $user->gugus_mutu_id) {
            $reportQuery->whereHas('user', function($q) use ($user) {
                $q->where('gugus_mutu_id', $user->gugus_mutu_id);
            });
        }

        $submissions = $reportQuery->get();
        $submissionIds = $submissions->pluck('id');

        $totalTerkirim = $submissions->whereIn('approval_status', ['Draft', 'Pending'])->count();
        $totalDisetujui = $submissions->where('approval_status', 'Approved')->count();
        $totalDitolak = $submissions->where('approval_status', 'Rejected')->count();

        $activities = Activity::whereIn('report_submission_id', $submissionIds)
            ->orderBy('kode_pmo', 'asc')
            ->get();

        $monthlyStats = [];
        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        foreach ($months as $m) {
            $monthlyStats[$m] = [
                'name' => $m,
                'target' => 0,
                'realisasi' => 0,
                'count' => 0 
            ];
        }

        foreach ($activities as $activity) {
            if (!empty($activity->rencana_end_date)) {
                $targetMonthNum = date('n', strtotime($activity->rencana_end_date));
                $mIdx = $months[$targetMonthNum - 1];
                $monthlyStats[$mIdx]['target'] += 100; 
                $monthlyStats[$mIdx]['count'] += 1;
            }

            if (!empty($activity->realisasi_end_date)) {
                $realMonthNum = date('n', strtotime($activity->realisasi_end_date));
                $mIdx = $months[$realMonthNum - 1];
                $monthlyStats[$mIdx]['realisasi'] += 100;
            }
        }

        $finalMonthlyStats = [];
        foreach ($months as $m) {
            $count = $monthlyStats[$m]['count'] ?: 1; 
            $finalMonthlyStats[] = [
                'name' => $m,
                'target' => round($monthlyStats[$m]['target'] / $count),
                'realisasi' => round($monthlyStats[$m]['realisasi'] / $count),
            ];
        }

        return Inertia::render('Dashboard', [
            'metrics' => [
                'total_terkirim' => $totalTerkirim,
                'total_disetujui' => $totalDisetujui,
                'total_ditolak' => $totalDitolak,
            ],
            'recent_submissions' => $submissions->take(5),
            'activities' => $activities,        
            'monthlyStats' => $finalMonthlyStats, 
            'selectedYear' => $year             
        ]);
    }
}


