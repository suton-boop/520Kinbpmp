<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('gugus_mutus', function (Blueprint $table) {
            $table->boolean('allow_import')->default(false)->after('name');
        });
    }

    public function down(): void
    {
        Schema::table('gugus_mutus', function (Blueprint $table) {
            $table->dropColumn('allow_import');
        });
    }
};
