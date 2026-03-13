<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->string('kode_rrkl')->nullable()->after('kode_pmo');
            $table->string('jumlah_target')->nullable()->after('hasil_kegiatan');
            $table->string('jumlah_capaian')->nullable()->after('jumlah_target');
            $table->text('resiko_isu')->nullable()->after('jumlah_capaian');
            $table->text('solusi')->nullable()->after('resiko_isu');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->dropColumn(['kode_rrkl', 'jumlah_target', 'jumlah_capaian', 'resiko_isu', 'solusi']);
        });
    }
};