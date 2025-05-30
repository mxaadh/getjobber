<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ServiceRequestController;
//use App\Http\Controllers\QuoteController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StripeWebhookController;

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
    Route::post('requests/quote-add', [ServiceRequestController::class, 'quoteAdd'])->name('bookings.quote-add');
    Route::get('requests/approve/{quote}', [ServiceRequestController::class, 'approve'])->name('requests.approve');
    Route::get('requests/reject/{quote}', [ServiceRequestController::class, 'reject'])->name('requests.reject');
    Route::get('requests/checkout/{request}', [ServiceRequestController::class, 'checkout'])->name('requests.checkout');

//    Route::resource('quotes', QuoteController::class);
    Route::resource('jobs', JobController::class);
    Route::post('jobs/price-add', [JobController::class, 'priceAdd'])->name('jobs.price-add');
    Route::resource('services',ServiceController::class);


//    Route::get('/checkout', [PaymentController::class, 'checkout'])->name('checkout');
    Route::get('/payment/success', [PaymentController::class, 'success'])->name('payment.success');
    Route::get('/payment/cancel', [PaymentController::class, 'cancel'])->name('payment.cancel');
});

Route::post('/stripe/webhook', [StripeWebhookController::class, 'handleWebhook'])->name('stripe.webhook');
//    ->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);

Route::get('/prices/{price}/approve/{token}', [JobController::class, 'approve'])
    ->name('prices.approve');
Route::get('/prices/{price}/reject/{token}', [JobController::class, 'reject'])
    ->name('prices.reject');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
