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
        Schema::create('scqr_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained('activities')->cascadeOnDelete();
            $table->enum('schedule', ['terlambat', 'sedikit_terlambat', 'tepat_waktu']);
            $table->enum('cost', ['melebihi', 'sedikit_melebihi', 'sesuai']);
            $table->enum('quality', ['banyak_tidak_sesuai', 'beberapa_tidak_sesuai', 'memenuhi']);
            $table->enum('risk', ['tinggi', 'sedang', 'rendah']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scqr_metrics');
    }
};
