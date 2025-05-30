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
        Schema::table('quote_items', function (Blueprint $table) {
            // Drop the foreign key constraint first
            $table->dropForeign(['quote_id']);
        });

        Schema::table('quote_items', function (Blueprint $table) {
            // Optionally, make quote_id just a regular column (still unsignedBigInteger)
            $table->unsignedBigInteger('quote_id')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quote_items', function (Blueprint $table) {
            $table->foreign('quote_id')->references('id')->on('quotes')->onDelete('cascade');
        });
    }
};
