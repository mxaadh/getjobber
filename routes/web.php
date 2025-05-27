<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ServiceRequestController;
//use App\Http\Controllers\QuoteController;
use App\Http\Controllers\JobController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::resource('users', UserController::class);
    Route::resource('clients', ClientController::class);
    Route::resource('requests', ServiceRequestController::class);
    Route::post('bookings/quote-add', [ServiceRequestController::class, 'quoteAdd'])->name('bookings.quote-add');
//    Route::resource('quotes', QuoteController::class);
    Route::resource('jobs', JobController::class);
    Route::post('jobs/price-add', [JobController::class, 'priceAdd'])->name('jobs.price-add');
});

Route::get('/quotes/{quote}/approve/{token}', [ServiceRequestController::class, 'approve'])
    ->name('quotes.approve');
Route::get('/quotes/{quote}/reject/{token}', [ServiceRequestController::class, 'reject'])
    ->name('quotes.reject');

Route::get('/prices/{price}/approve/{token}', [JobController::class, 'approve'])
    ->name('prices.approve');
Route::get('/prices/{price}/reject/{token}', [JobController::class, 'reject'])
    ->name('prices.reject');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
