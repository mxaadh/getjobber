<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('service_requests', function (Blueprint $table) {
            $table->boolean('is_paid')->default(false)->after('deposit_amount')->comment('Indicates if the service request has been paid for');
            $table->timestamp('paid_at')->nullable()->after('is_paid')->comment('Timestamp when the service request was paid');
        });
    }

    public function down(): void
    {
        Schema::table('service_requests', function (Blueprint $table) {
            $table->dropColumn(['is_paid', 'paid_at']);
        });
    }
};
