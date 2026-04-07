<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->date('rencana_start_date')->nullable()->change();
            $table->date('rencana_end_date')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->date('rencana_start_date')->nullable(false)->change();
            $table->date('rencana_end_date')->nullable(false)->change();
        });
    }
};
