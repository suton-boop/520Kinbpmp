<?php

namespace App\Http\Controllers;

use App\Models\GugusMutu;
use Illuminate\Http\Request;

class GugusMutuController extends Controller
{
    public function toggleImport(GugusMutu $gugusMutu)
    {
        $gugusMutu->update([
            'allow_import' => !$gugusMutu->allow_import
        ]);

        return redirect()->back()->with('success', 'Status import berhasil diperbarui.');
    }
}
