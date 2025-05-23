<?php

namespace App\Http\Controllers;

use App\Mail\PricingMail;
use App\Models\BookingQuote;
use App\Models\Client;
use App\Models\Job;
use App\Models\JobPrice;
use App\Models\User;
use App\Models\UserDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class JobController extends Controller
{
    public function index()
    {
        $jobs = Job::with('client')->orderBy('created_at', 'desc')->get();
        $all_count = Job::count();
        $month_count = Job::whereBetween('created_at', [
            Carbon::now()->startOfMonth(), // 1st day of month
            Carbon::now() // current time
        ])->count();
        $week_count = Job::whereBetween('created_at', [
            Carbon::now()->startOfWeek(), // Monday
            Carbon::now() // current time
        ])->count();
        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs,
            'all_count' => $all_count,
            'month_count' => $month_count,
            'week_count' => $week_count,
        ]);
    }

    public function create()
    {
        return Inertia::render('Jobs/Create', [
            // Pass any necessary data for the create form
            'contractors' => User::get(), // where('role', 'contractor')->
            'clients' => Client::get(),
            // Add other necessary data like bookings, quotes if needed
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'service_request_id' => 'required|exists:service_requests,id',
            'schedule_date' => 'required|date',
            'schedule_time' => 'required',
            'notes' => 'nullable|string',
            'total_price' => 'required|numeric',
        ]);
        Job::create($validated);

        return redirect()->route('jobs.index')->with('success', 'Job created successfully.');
    }

    public function show(Job $job)
    {
        $service_request = $job->serviceRequest()->first()->load(['client']);
        $address = explode(', ', $service_request->client->address);
        $city = $address[1];
        $state = $address[2];
        $country = $address[4];
        $user_ids = UserDetail::where([
            'country' => $country,
            'state' => $state,
            'city' => $city,
        ])->get(['user_id'])->toArray();
        $contractors = User::where('role', 'contractor')->whereIn('id', $user_ids)->get();
        $price = JobPrice::where('service_job_id', $job->id)->orderBy('created_at', 'desc')->get();
        return Inertia::render('Jobs/Show', [
            'job' => $job->load(['contractor', 'client', 'serviceRequest', 'quote']),
            'contractors' => $contractors,
            'price' => $price,
        ]);
    }

    public function edit(Job $job)
    {
        return Inertia::render('Jobs/Edit', [
            'job' => $job,
            'contractors' => \App\Models\User::where('role', 'contractor')->get(),
            'clients' => \App\Models\User::where('role', 'client')->get(),
            // Add other necessary data like bookings, quotes if needed
        ]);
    }

    public function update(Request $request, Job $job)
    {
        $validated = $request->validate([
//            'contractor_id' => 'required|exists:users,id',
            'client_id' => 'required|exists:clients,id',
            'service_request_id' => 'required|exists:service_requests,id',
//            'quote_id' => 'required|exists:quotes,id',
            'schedule_date' => 'required|date',
            'schedule_time' => 'required',
            'notes' => 'nullable|string',
            'total_price' => 'required|numeric',
            'status' => 'required|string'
        ]);

        $job->update($validated);

        return redirect()->route('jobs.index')->with('success', 'Job updated successfully.');
    }

    public function destroy(Job $job)
    {
        $job->delete();
        return redirect()->route('jobs.index')->with('success', 'Job deleted successfully.');
    }

    public function priceAdd(Request $request)
    {
        $parts = explode(' - ', $request->get('contractor_name'));
        $contractor_id = $parts[0];
        $contractor_name = $parts[1];
        $contractor_email = $parts[2];

        $job = Job::findOrFail($request['job_id']);
        $job->update([
            'contractor_id' => $contractor_id,
            'status' => Job::STATUS_ACTIVE,
            'job_price' => $request['job_price'],
        ]);

        $price = JobPrice::create([
            'service_request_id' => $request['service_request_id'],
            'service_job_id' => $request['job_id'],
            'job_price' => $request['job_price']
        ]);

        $pricingData = [
            'id' => $price->id,
            'quotation_number' => 'QT-' . date('Ymd') . rand(100, 999),
            'customer_name' => $contractor_name,
            'customer_email' => $contractor_email,
            'total_amount' => number_format($request['job_price'], 2),
            'description' => $request['description'] ?? null,
            'valid_until' => now()->addDays(7)->format('F j, Y'),
        ];

        Mail::to($pricingData['customer_email'])
            ->send(new PricingMail($pricingData));
    }

    public function approve(JobPrice $price, $token)
    {
        $this->validateToken($price->id, 'approve', $token);

        if ($price->is_approved) {
            return redirect()->back()->with('error', 'This price is already approved');
        }

        if ($price->is_rejected) {
            return redirect()->back()->with('error', 'Cannot approve a rejected price');
        }

        $price->approve();

        return view('quotes.response', [
            'message' => 'Price approved successfully!',
            'quote' => $price
        ]);
    }

    public function reject(JobPrice $price, $token)
    {
        $this->validateToken($price->id, 'reject', $token);

        if ($price->is_approved) {
            return redirect()->back()->with('error', 'Cannot reject an approved price');
        }

        if ($price->is_rejected) {
            return redirect()->back()->with('error', 'This price is already rejected');
        }

        $price->reject();

        return view('quotes.response', [
            'message' => 'Price has been rejected.',
            'quote' => $price
        ]);
    }

    protected function validateToken($priceId, $action, $token)
    {
        $validToken = hash_hmac('sha256', $priceId . $action, config('app.key'));

//        \Log::debug("Token validation", [
//            'priceId' => $priceId,
//            'action' => $action,
//            'validToken' => $validToken,
//            'receivedToken' => $token,
//            'app_key' => config('app.key')
//        ]);

        if (!hash_equals($validToken, $token)) {
            abort(403, 'Invalid action token');
        }
    }
}
