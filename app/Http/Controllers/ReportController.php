<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ReportSubmission;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        $query = ReportSubmission::with(['period', 'activities', 'user.gugusMutu']);

        if ($user->hasRole(['admin', 'super-admin'])) {
            //
        } elseif ($user->hasRole(['manager', 'staff', 'user'])) {
            if ($user->gugus_mutu_id) {
                $query->whereHas('user', function($q) use ($user) {
                    $q->where('gugus_mutu_id', $user->gugus_mutu_id);
                });
            } else {
                $query->where('user_id', $user->id);
            }
        }

        $reports = $query->orderBy('created_at', 'desc')->get();
        $allowImport = false;
        if ($user->gugus_mutu_id) {
            $allowImport = (bool) \App\Models\GugusMutu::find($user->gugus_mutu_id)->allow_import;
        } elseif ($user->hasRole(['admin', 'super-admin'])) {
            $allowImport = true;
        }
                    
        return Inertia::render('Reports/Index', [
            'reports' => $reports,
            'userRole' => $user->roles->pluck('name')->first(),
            'allowImport' => $allowImport,
        ]);
    }

    public function store(Request $request)
    {
        $period = \App\Models\Period::firstOrCreate(
            ['month_year' => '01-2026'], 
            ['start_date' => '2026-01-01', 'end_date' => '2026-12-31']
        );
        $report = ReportSubmission::firstOrCreate([
            'user_id' => Auth::id(),
            'period_id' => $period->id,
        ], ['form_type' => 'plan', 'approval_status' => 'Draft']);
        return redirect()->route('reports.show', $report->id)->with('success', 'Rencana Pekerjaan Baru Berhasil Disiapkan.');
    }

    public function show($id)
    {
        $user = Auth::user();
        $report = ReportSubmission::with(['activities', 'period', 'user'])->findOrFail($id);
        
        $allowImport = false;
        if ($user->gugus_mutu_id) {
            $allowImport = (bool) \App\Models\GugusMutu::find($user->gugus_mutu_id)->allow_import;
        } elseif ($user->hasRole(['admin', 'super-admin'])) {
            $allowImport = true;
        }

        return Inertia::render('Reports/Show', [
            'report' => $report,
            'userRole' => $user->roles->pluck('name')->first(),
            'allowImport' => $allowImport,
        ]);
    }

    public function submitPlan(Request $request, $id)
    {
        $report = ReportSubmission::findOrFail($id);
        if (!Auth::user()->hasRole(['admin', 'super-admin']) && $report->user_id !== Auth::id()) abort(403);
        $report->update(['approval_status' => 'Pending_Manager']);
        return back()->with('success', 'Perencanaan diajukan ke Manajer (Tahap 1).');
    }

    public function submitReport(Request $request, $id)
    {
        $report = ReportSubmission::findOrFail($id);
        if (!Auth::user()->hasRole('admin') && $report->user_id !== Auth::id()) abort(403);
        $report->update(['approval_status' => 'Pending_Manager']);
        return back()->with('success', 'Pelaporan Kinerja diajukan ke Manajer (Tahap 1).');
    }
}