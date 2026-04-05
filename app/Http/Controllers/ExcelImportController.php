<?php

namespace App\Http\Controllers;

use App\Imports\ProgramImport;
use App\Models\GugusMutu;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\TemplateExport;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ExcelImportController extends Controller
{
    public function importProgram(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048',
            'gugus_mutu_id' => 'nullable|exists:gugus_mutus,id',
        ]);

        $user = Auth::user();
        $gugusMutuId = $request->gugus_mutu_id;

        // If not admin, force them to use their assigned GM and check if enabled
        if (!$user->hasRole(['admin', 'super-admin'])) {
            $gugusMutuId = $user->gugus_mutu_id;
            
            if (!$gugusMutuId) {
                return redirect()->back()->with('error', 'Anda tidak memiliki Gugus Mutu yang ditugaskan.');
            }

            $gm = GugusMutu::findOrFail($gugusMutuId);
            if (!$gm->allow_import) {
                return redirect()->back()->with('error', 'Fitur import saat ini dinonaktifkan oleh Admin.');
            }
        } else {
            // For admin, if GM id is provided, verify it exists and is allowed (optional for admin, admin can do everything)
            if ($gugusMutuId) {
                 $gm = GugusMutu::findOrFail($gugusMutuId);
                 // Admins can import even if it is not "allowed" globally for others, 
                 // but let's keep it simple: admin is god.
            }
        }

        try {
            Excel::import(new ProgramImport($gugusMutuId), $request->file('file'));
            return redirect()->back()->with('success', 'Data Program berhasil diimport.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    public function downloadTemplate()
    {
        $fileName = 'template_import_kin520.xlsx';
        
        if (ob_get_level()) {
            ob_end_clean();
        }

        return Excel::download(new TemplateExport, $fileName, \Maatwebsite\Excel\Excel::XLSX, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ]);
    }
}
