<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('service_requests', function (Blueprint $table) {
            $table->enum('status', ['pending', 'active', 'approved'])
                ->default('pending')
                ->after('client_name'); // Optional: place after specific column
            $table->string('quote_amount')->nullable();
        });
    }

    public function down()
    {
        Schema::table('service_requests', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
