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
        Schema::create('booking_quotes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('booking_id');
            $table->decimal('quote_amount', 10, 2); // Allows values up to 99,999,999.99
            $table->boolean('is_approved')->default(false);
            $table->timestamp('approved_at')->nullable();
            $table->boolean('is_rejected')->default(false);
            $table->timestamp('rejected_at')->nullable();
            $table->timestamps();

            // Foreign key constraint
            $table->foreign('booking_id')
                ->references('id')
                ->on('service_requests')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_quotes');
    }
};
