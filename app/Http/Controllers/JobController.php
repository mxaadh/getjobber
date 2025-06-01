<?php

namespace App\Http\Controllers;

use App\Mail\PricingMail;
use App\Models\Client;
use App\Models\Job;
use App\Models\JobPhoto;
use App\Models\JobPrice;
use App\Models\QuoteItem;
use App\Models\Service;
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
        $query = Job::with('client')->latest();
        $all_count = Job::count();
        $approved_count = Job::where('status', Job::STATUS_APPROVED)->count();
        $pending_count = Job::whereNot('status', Job::STATUS_APPROVED)->count();
        $month_count = Job::whereBetween('created_at', [
            Carbon::now()->startOfMonth(), // 1st day of month
            Carbon::now() // current time
        ])->count();
        $week_count = Job::whereBetween('created_at', [
            Carbon::now()->startOfWeek(), // Monday
            Carbon::now() // current time
        ])->count();

        $jobs = $query->paginate(10);

        return Inertia::render('Jobs/Index', [
            'jobs' => $jobs,
            'all_count' => $all_count,
            'approved_count' => $approved_count,
            'pending_count' => $pending_count,
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

    public function show(Request $request, Job $job)
    {
//        $service_request = $job->serviceRequest()->first()->load(['client']);
//        $address = explode(', ', $service_request->client->address);
//        $city = $address[1];
//        $state = $address[2];
        $user_ids = [];
        if ($request->has('country') && !empty($request->country)) {
            $country = $request->country;
            $user_ids = UserDetail::where([
                'country' => $country,
            ])->get(['user_id'])->toArray();
        }
        $contractors = User::where('role', 'contractor')->whereIn('id', $user_ids)->get();
        $price = JobPrice::with('items')->where('service_job_id', $job->id)->orderBy('created_at', 'desc')->get();
        $services = Service::all();

        return Inertia::render('Jobs/Show', [
            'job' => $job->load(['contractor', 'client', 'serviceRequest', 'quote']),
            'contractors' => $contractors,
            'price' => $price,
            'services' => $services,
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
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.name' => 'nullable|string',
            'items.*.description' => 'nullable|string',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric',
            'tax_rate' => 'nullable|numeric',
            'total' => 'required|numeric',
        ]);

        $parts = explode(' - ', $request->get('contractor_name'));
        $contractor_id = $parts[0];
        $contractor_name = $parts[1];
        $contractor_email = $parts[2];

        $job = Job::findOrFail($request['job_id']);
        $job->update([
            'contractor_id' => $contractor_id,
            'status' => Job::STATUS_ACTIVE,
            'job_price' => $request['total'],
        ]);

        $price = JobPrice::create([
            'service_request_id' => $request['service_request_id'],
            'service_job_id' => $request['job_id'],
            'job_price' => $request['total']
        ]);

        foreach ($validated['items'] as $item) {
            $items = QuoteItem::create([
                'quote_id' => $price->id,
                'name' => $item['name'] ?? '',
                'description' => $item['description'] ?? '',
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total' => $item['total'],
            ]);
        }

        $pricingData = [
            'id' => $price->id,
            'quotation_number' => 'QT-' . date('Ymd') . rand(100, 999),
            'customer_name' => $contractor_name,
            'customer_email' => $contractor_email,
            'total_amount' => number_format($request['total'], 2),
            'description' => $request['description'] ?? null,
            'valid_until' => now()->addDays(7)->format('F j, Y'),
            'items' => $validated['items'],
            'subtotal' => $validated['subtotal'],
            'tax' => $validated['tax'] ?? 0,
            'date_of_issue' => $price->created_at->format('F j, Y'),
        ];

        Mail::to($pricingData['customer_email'])
            ->send(new PricingMail($pricingData));
    }

    public function approve(JobPrice $price, $token = null)
    {
        if (!is_null($token))
            $this->validateToken($price->id, 'approve', $token);

        if ($price->is_approved) {
            return redirect()->back()->with('error', 'This price is already approved');
        }

        if ($price->is_rejected) {
            return redirect()->back()->with('error', 'Cannot approve a rejected price');
        }

        $price->approve();
        $price->ServiceJob->update([
            'status' => Job::STATUS_APPROVED,
            'total_price' => $price->job_price,
        ]);

        return redirect()->route('jobs.show', $price->service_job_id)->with([
            'message' => 'Price approved successfully!',
            'quote' => $price
        ]);
    }

    public function reject(JobPrice $price, Request $request, $token = null)
    {
        if (!is_null($token))
            $this->validateToken($price->id, 'reject', $token);

        if ($price->is_approved) {
            return redirect()->back()->with('error', 'Cannot reject an approved price');
        }

        if ($price->is_rejected) {
            return redirect()->back()->with('error', 'This price is already rejected');
        }

        $price->reject($request->reason ?? 'No reason provided');
        $price->ServiceJob->update([
            'status' => Job::STATUS_REJECTED,
        ]);

        return redirect()->route('jobs.show', $price->service_job_id)->with([
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

    public function start(Job $job)
    {
        $job->update(['started_at' => now()]);

        $prePhotos = $job->photos()->where('type', 'pre')->get();
        $price = JobPrice::with('items')->where([
            'service_job_id' => $job->id,
            'is_approved' => true,
        ])->orderBy('created_at', 'desc')->first();

        return Inertia::render('Jobs/Start', [
            'job' => $job,
            'prePhotos' => $prePhotos,
            'price' => $price,
        ]);
    }

    public function uploadPrePhotos(Request $request, Job $job)
    {
        $request->validate([
            'pre_photos.*' => 'image|max:5120' // max 5MB
        ]);

        foreach ($request->file('pre_photos', []) as $photo) {
            $path = $photo->store("jobs/{$job->id}/pre", 'public');

            // Save to DB if needed — JobPhoto model etc.
            JobPhoto::create([
                'service_job_id' => $job->id,
                'path' => $path,
                'type' => 'pre',
            ]);
        }

        return redirect()->route('jobs.start', $job)->with('success', 'Pre-photos uploaded.');
    }

    public function complete(Job $job)
    {
        $postPhotos = $job->photos()->where('type', 'post')->get();

        return Inertia::render('Jobs/Complete', [
            'job' => $job,
            'postPhotos' => $postPhotos,
        ]);
    }

    public function uploadPostPhotos(Request $request, Job $job)
    {
        $request->validate([
            'post_photos.*' => 'image|max:5120'
        ]);

        foreach ($request->file('post_photos', []) as $photo) {
            $path = $photo->store("jobs/{$job->id}/post", 'public');

            JobPhoto::create([
                'service_job_id' => $job->id,
                'path' => $path,
                'type' => 'post',
            ]);
        }

        return redirect()->route('jobs.complete', $job)->with('success', 'Post-photos uploaded.');
    }

    public function finish(Job $job)
    {
        $job->update([
            'status' => Job::STATUS_COMPLETED,
            'completed_at' => now(),
        ]);

        return redirect()->route('jobs.index')->with('success', 'Job completed successfully.');
    }
}
