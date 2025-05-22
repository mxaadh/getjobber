<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ServiceRequestController;
use App\Http\Controllers\QuoteController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('users', UserController::class);
    Route::resource('clients', ClientController::class);
    Route::resource('bookings', ServiceRequestController::class);
    Route::post('bookings/quote-add', [ServiceRequestController::class, 'quoteAdd'])->name('bookings.quote-add');
    Route::resource('quotes', QuoteController::class);
});

Route::get('/quotes/{quote}/approve/{token}', [ServiceRequestController::class, 'approve'])
    ->name('quotes.approve');
Route::get('/quotes/{quote}/reject/{token}', [ServiceRequestController::class, 'reject'])
    ->name('quotes.reject');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
