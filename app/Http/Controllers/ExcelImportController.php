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

        if (!$user->hasRole(['admin', 'super-admin', 'superadmin'])) {
            $gugusMutuId = $user->gugus_mutu_id;
            
            if (!$gugusMutuId) {
                return redirect()->back()->with('error', 'Anda tidak memiliki Gugus Mutu yang ditugaskan.');
            }

            $gm = GugusMutu::findOrFail($gugusMutuId);
            if (!$gm->allow_import) {
                return redirect()->back()->with('error', 'Fitur import saat ini dinonaktifkan oleh Admin.');
            }
        }

        try {
            $import = new ProgramImport($gugusMutuId);
            Excel::import($import, $request->file('file'));
            
            if ($import->rowCount > 0) {
                return redirect()->back()->with('success', "BERHASIL! {$import->rowCount} DATA KEGIATAN TELAH DIIMPORT.");
            } else {
                return redirect()->back()->with('error', 'TIDAK ADA DATA YANG DIIMPORT. PERIKSA APAKAH FORMAT EXCEL SUDAH SESUAI TABEL.');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'TERJADI KESALAHAN: ' . $e->getMessage());
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
