<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Check520Rule
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $type 'plan' atau 'report'
     */
    public function handle(Request $request, Closure $next, string $type): Response
    {
        // Pengecualian batas waktu bagi Admin Pusat
        if ($request->user() && $request->user()->hasRole('admin')) {
            return $next($request);
        }

        // Dapatkan tanggal (1-31) hari ini berdasarkan locale timezone
        $currentDay = now()->day;

        if ($type === 'plan') {
            // Perencanaan: Hanya diizinkan sebelum atau sama dengan tanggal 20
            if ($currentDay > 20) {
                return redirect()->back()->with('error', 'Di Tolak: Batas pengajuan Perencanaan (Tgl 20) telah terlewati.');
            }
        } elseif ($type === 'report') {
            // Pelaporan: Hanya diizinkan sebelum atau sama dengan tanggal 5
            if ($currentDay > 5) {
                return redirect()->back()->with('error', 'Di Tolak: Batas pengisian Laporan Akhir (Tgl 5) telah terlewati.');
            }
        }

        return $next($request);
    }
}
