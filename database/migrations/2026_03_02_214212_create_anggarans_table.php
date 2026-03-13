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
        Schema::create('anggarans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('anggarans')->onDelete('cascade');
            $table->integer('urut')->nullable();
            $table->string('kode');
            $table->string('tipe')->nullable();
            $table->text('nomenklatur');
            $table->string('volume')->nullable();
            $table->decimal('pelaksanaan', 5, 2)->default(0);
            $table->bigInteger('anggaran_alokasi')->default(0);
            $table->bigInteger('anggaran_realisasi')->default(0);
            $table->json('kelengkapan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anggarans');
    }
};
