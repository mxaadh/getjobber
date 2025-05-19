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
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->string('client_name');
            $table->string('title');
            $table->date('requested_on')->default(now());
            $table->json('cleaning_services');
            $table->text('details')->nullable();
            $table->date('preferred_day')->nullable();
            $table->date('alternate_day')->nullable();
            $table->json('arrival_times')->nullable();
            $table->boolean('assessment_required')->default(false);
            $table->text('internal_notes')->nullable();
            $table->string('internal_file')->nullable();
            $table->json('linked_to')->nullable(); // quotes, jobs, invoices
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};
