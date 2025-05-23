<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('service_jobs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('contractor_id')->nullable();
            $table->unsignedBigInteger('client_id');
            $table->unsignedBigInteger('service_request_id');
            $table->unsignedBigInteger('quote_id')->nullable();
            $table->date('schedule_date');
            $table->time('schedule_time');
            $table->text('notes')->nullable();
            $table->decimal('total_price', 10, 2);
            $table->enum('status', [
                'pending',
                'active',
                'approved',
                'rejected',
                'completed'
            ])
                ->default('pending');
            $table->timestamps();

            // Foreign key constraints (optional)
            $table->foreign('contractor_id')->references('id')->on('users');
            $table->foreign('client_id')->references('id')->on('clients');
            $table->foreign('service_request_id')->references('id')->on('service_requests');
            $table->foreign('quote_id')->references('id')->on('quotes');
        });
    }

    public function down()
    {
        Schema::dropIfExists('service_jobs');
    }
};
