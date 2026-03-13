<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_submission_id')->constrained('report_submissions')->cascadeOnDelete();
            $table->string('kode_pmo')->nullable()->comment('Contoh: PDM-01, dst');
            $table->text('nama_kegiatan_turunan')->nullable();
            $table->longText('deskripsi_kegiatan')->nullable();
            $table->text('hasil_kegiatan')->nullable();
            $table->text('nama_kegiatan_di_dipa')->nullable();
            $table->date('rencana_start_date')->nullable();
            $table->date('rencana_end_date')->nullable();
            $table->string('mekanisme_kegiatan')->nullable()->comment('Misal: Fullboard');
            $table->text('peserta_sasaran')->nullable();
            $table->string('tempat_kegiatan')->nullable();
            $table->text('rincian_ketersediaan_anggaran')->nullable();
            $table->text('persiapan')->nullable();
            $table->date('realisasi_start_date')->nullable();
            $table->date('realisasi_end_date')->nullable();
            $table->string('laporan')->nullable();
            $table->string('status_akhir')->nullable()->comment('Belum, Sudah, Skip');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
