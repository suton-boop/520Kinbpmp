<?php

namespace App\Http\Controllers;

use App\Models\Anggaran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnggaranController extends Controller
{
    public function index()
    {
        $data = Anggaran::whereNull('parent_id')->with('children')->orderBy('id')->get();
        // Calculate percent
        $data->transform(function ($parent) {
            $parent->anggaran_persen = $parent->anggaran_alokasi > 0 
                ? round(($parent->anggaran_realisasi / $parent->anggaran_alokasi) * 100, 1) 
                : 0;
            
            if (!$parent->kelengkapan) {
                 $parent->kelengkapan = array_fill(0, 12, true);
            }
                
            $parent->children->transform(function ($child) {
                $child->anggaran_persen = $child->anggaran_alokasi > 0 
                    ? round(($child->anggaran_realisasi / $child->anggaran_alokasi) * 100, 1) 
                    : 0;
                if (!$child->kelengkapan) {
                    $child->kelengkapan = array_fill(0, 12, true);
                }
                return $child;
            });
            return $parent;
        });

        return Inertia::render('Anggaran/Index', [
            'anggaranData' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:anggarans,id',
            'urut' => 'nullable|integer',
            'kode' => 'required|string|max:255',
            'tipe' => 'nullable|string|max:255',
            'nomenklatur' => 'required|string',
            'volume' => 'required|string',
            'pelaksanaan' => 'required|numeric',
            'anggaran_alokasi' => 'required|numeric',
            'anggaran_realisasi' => 'required|numeric',
            'kelengkapan' => 'nullable|array',
        ]);

        if (empty($validated['kelengkapan'])) {
            $validated['kelengkapan'] = array_fill(0, 12, false);
        }

        Anggaran::create($validated);

        return redirect()->back()->with('success', 'Data Anggaran berhasil ditambahkan.');
    }

    public function update(Request $request, Anggaran $anggaran)
    {
        $validated = $request->validate([
            'parent_id' => 'nullable|exists:anggarans,id',
            'urut' => 'nullable|integer',
            'kode' => 'required|string|max:255',
            'tipe' => 'nullable|string|max:255',
            'nomenklatur' => 'required|string',
            'volume' => 'required|string',
            'pelaksanaan' => 'required|numeric',
            'anggaran_alokasi' => 'required|numeric',
            'anggaran_realisasi' => 'required|numeric',
            'kelengkapan' => 'nullable|array',
        ]);
        
        if (empty($validated['kelengkapan'])) {
            $validated['kelengkapan'] = $anggaran->kelengkapan ?? array_fill(0, 12, false);
        }

        $anggaran->update($validated);

        return redirect()->back()->with('success', 'Data Anggaran berhasil diperbarui.');
    }

    public function destroy(Anggaran $anggaran)
    {
        $anggaran->delete();
        return redirect()->back()->with('success', 'Data Anggaran berhasil dihapus.');
    }
}