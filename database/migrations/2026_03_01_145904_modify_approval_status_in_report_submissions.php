<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Ubah Tipe Enum menjadi Varchar menggunakan Raw Query agar aman 
        DB::statement("ALTER TABLE report_submissions MODIFY COLUMN approval_status VARCHAR(255) DEFAULT 'Draft'");
        
        Schema::table('report_submissions', function (Blueprint $table) {
            $table->foreignId('manager_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('admin_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('manager_approved_at')->nullable();
            $table->timestamp('admin_approved_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('report_submissions', function (Blueprint $table) {
            $table->dropForeign(['manager_id']);
            $table->dropForeign(['admin_id']);
            $table->dropColumn(['manager_id', 'admin_id', 'manager_approved_at', 'admin_approved_at']);
        });

        // Kembalikan tipe menjadi ENUM
        DB::statement("ALTER TABLE report_submissions MODIFY COLUMN approval_status ENUM('Draft', 'Approved', 'Rejected') DEFAULT 'Draft'");
    }
};
