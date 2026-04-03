<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ExcelImportController;
use App\Http\Controllers\DashboardController;

Route::get('/', [DashboardController::class, 'publicDashboard'])->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Reports Routes (Perencanaan & Pelaporan)
    Route::resource('Project', \App\Http\Controllers\ReportController::class)->names('reports')->parameter('Project', 'report');
    
    // Gugus Mutu Report
    Route::get('/gugus-mutu-report', [\App\Http\Controllers\GugusMutuReportController::class, 'index'])->name('gugus-mutu-report.index');

    // Rute Submit Plan: terikat aturan tgl 20
    Route::post('Project/{id}/submit-plan', [\App\Http\Controllers\ReportController::class, 'submitPlan'])
        ->middleware(\App\Http\Middleware\Check520Rule::class.':plan')
        ->name('reports.submit_plan');

    // Rute Submit Report: terikat aturan tgl 5
    Route::post('Project/{id}/submit-report', [\App\Http\Controllers\ReportController::class, 'submitReport'])
        ->middleware(\App\Http\Middleware\Check520Rule::class.':report')
        ->name('reports.submit_report');

    // Approvals Routes
    Route::get('/approvals', [\App\Http\Controllers\ApprovalController::class, 'index'])->name('approvals.index');
    Route::post('/approvals/{id}/approve-manager', [\App\Http\Controllers\ApprovalController::class, 'approveManager'])->name('approvals.approve_manager');
    Route::post('/approvals/{id}/approve-admin', [\App\Http\Controllers\ApprovalController::class, 'approveAdmin'])->name('approvals.approve_admin');
    Route::post('/approvals/{id}/reject', [\App\Http\Controllers\ApprovalController::class, 'reject'])->name('approvals.reject');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware(['role:superadmin|admin'])->group(function () {
        // Specific routes MUST come before Resource routes to avoid parameter collision
        Route::get('/users/export-template', [ExcelImportController::class, 'downloadTemplate'])->name('import.template');
        Route::post('/import-program', [ExcelImportController::class, 'importProgram'])->name('import.program');
        
        Route::resource('users', \App\Http\Controllers\UserController::class);
    });

});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/transformasi-organisasi', function () {
        return Inertia::render('Placeholder', ['title' => 'Transformasi Organisasi']);
    })->name('transformasi');

    Route::get('/anggaran', [\App\Http\Controllers\AnggaranController::class, 'index'])->name('anggaran');
    Route::post('/anggaran', [\App\Http\Controllers\AnggaranController::class, 'store'])->name('anggaran.store');
    Route::put('/anggaran/{anggaran}', [\App\Http\Controllers\AnggaranController::class, 'update'])->name('anggaran.update');
    Route::delete('/anggaran/{anggaran}', [\App\Http\Controllers\AnggaranController::class, 'destroy'])->name('anggaran.destroy');
    Route::post('/Project/{id}/activities', [\App\Http\Controllers\ActivityController::class, 'store'])->name('activities.store');
    Route::put('/activities/{activity}', [\App\Http\Controllers\ActivityController::class, 'update'])->name('activities.update');
    Route::delete('/activities/{activity}', [\App\Http\Controllers\ActivityController::class, 'destroy'])->name('activities.destroy');
});

require __DIR__.'/auth.php';
