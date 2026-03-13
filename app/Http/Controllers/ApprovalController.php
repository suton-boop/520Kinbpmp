<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\ReportSubmission;
use Illuminate\Support\Facades\Auth;

class ApprovalController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $query = ReportSubmission::with(['user.gugusMutu', 'period', 'activities']);

        if ($user->hasRole(['admin', 'super-admin'])) {
            $query->whereIn('approval_status', ['Pending_Admin', 'Approved_Admin', 'Rejected_Admin']);
        } elseif ($user->hasRole('manager')) {
            $query->whereHas('user', function($q) use ($user) {
                $q->where('gugus_mutu_id', $user->gugus_mutu_id);
            });
            $query->whereIn('approval_status', ['Pending_Manager', 'Approved_Manager', 'Pending_Admin', 'Approved_Admin', 'Rejected_Manager']);
        } else {
            $query->where('id', 0);
        }

        $pending_approvals = $query->orderBy('created_at', 'desc')->get();

        return Inertia::render('Approvals/Index', [
            'pending_approvals' => $pending_approvals,
            'userRole' => $user->roles->pluck('name')->first()
        ]);
    }

    public function approveManager(Request $request, $id)
    {
        $report = ReportSubmission::findOrFail($id);
        if (!Auth::user()->hasRole(['manager', 'admin', 'super-admin'])) abort(403);

        $report->update([
            'approval_status' => 'Pending_Admin',
            'manager_id' => Auth::id(),
            'manager_approved_at' => now(),
        ]);

        return back()->with('success', 'Berhasil diverifikasi Manajer, diteruskan ke Admin Pusat.');
    }

    public function approveAdmin(Request $request, $id)
    {
        $report = ReportSubmission::findOrFail($id);
        if (!Auth::user()->hasRole(['admin', 'super-admin'])) abort(403);

        $report->update([
            'approval_status' => 'Approved_Admin',
            'admin_id' => Auth::id(),
            'admin_approved_at' => now(),
        ]);

        return back()->with('success', 'Laporan/Rencana berhasil Disahkan secara final.');
    }

    public function reject(Request $request, $id)
    {
        $request->validate(['reason' => 'required|string']);
        $report = ReportSubmission::findOrFail($id);
        $user = Auth::user();

        if ($user->hasRole(['admin', 'super-admin'])) {
            $status = 'Rejected_Admin';
        } elseif ($user->hasRole('manager')) {
            $status = 'Rejected_Manager';
        } else {
            abort(403);
        }

        $report->update([
            'approval_status' => $status,
            'reviewer_notes' => $request->reason,
        ]);

        return back()->with('success', 'Pengajuan berhasil ditolak.');
    }
}

