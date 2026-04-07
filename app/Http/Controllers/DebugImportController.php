<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Auth;

class DebugImportController extends Controller
{
    public function debug(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv|max:2048',
        ]);

        try {
            $data = Excel::toArray([], $request->file('file'));
            $rows = $data[0] ?? [];
            
            echo "<h1>DEBUG HASIL BACA EXCEL</h1>";
            echo "<p>Halaman ini hanya untuk melihat apa yang dibaca server dari file Anda.</p>";
            echo "<table border='1' style='border-collapse:collapse; font-size:10px;'>";
            foreach (array_slice($rows, 0, 20) as $index => $row) {
                echo "<tr>";
                echo "<td style='background:#eee;'>Row " . ($index + 1) . "</td>";
                foreach ($row as $colIndex => $cell) {
                    echo "<td><strong>Col $colIndex:</strong><br>" . ($cell ?? '[NULL]') . "</td>";
                }
                echo "</tr>";
            }
            echo "</table>";
            echo "<br><a href='/Project'>Kembali ke Dashboard</a>";
            exit;
        } catch (\Exception $e) {
            return "ERROR BACA FILE: " . $e->getMessage();
        }
    }
}
