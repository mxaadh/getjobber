<?php

namespace App\Http\Controllers;

use App\Mail\QuotationMail;
use App\Models\BookingQuote;
use App\Models\Client;
use App\Models\Job;
use App\Models\ServiceRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ServiceRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $requests = ServiceRequest::latest()->get();
        $requests_count = ServiceRequest::count();
        $requests_approved_count = ServiceRequest::where('status', ServiceRequest::STATUS_APPROVED)->count();
        $requests_unapproved_count = ServiceRequest::whereNot('status', ServiceRequest::STATUS_APPROVED)->count();
        $requests_count = ServiceRequest::count();
        $requests_count_month = ServiceRequest::whereBetween('created_at', [
            Carbon::now()->startOfMonth(), // 1st day of month
            Carbon::now() // current time
        ])->count();
        $requests_count_week = ServiceRequest::whereBetween('created_at', [
            Carbon::now()->startOfWeek(), // Monday
            Carbon::now() // current time
        ])->count();

//        $requests = $query->paginate(10);

        return Inertia::render('Requests/Index')->with([
            'requests' => $requests,
            'requests_count' => $requests_count,
            'requests_approved_count' => $requests_approved_count,
            'requests_unapproved_count' => $requests_unapproved_count,
            'requests_count_month' => $requests_count_month,
            'requests_count_week' => $requests_count_week,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Requests/Create', [
            'clients' => Client::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_name' => ['required', 'string', 'max:255'],
//            'title' => ['required', 'string', 'max:255'],
            'details' => ['nullable', 'string'],
            'preferred_day' => ['required', 'date'],
            'alternate_day' => ['nullable', 'date'],
            'arrival_times' => ['required', 'array'],
            'arrival_times.*' => ['in:Any time,Morning,Afternoon,Evening'],
//            'assessment_required' => ['required', 'boolean'],
            'cleaning_services' => ['required', 'array'],
            'cleaning_services.*' => ['in:End of lease / Bond Cleaning,Carpet Steam Cleaning,Deep Cleaning,Move in Cleaning,Weekly / Fortnightly Cleaning'],
            'internal_notes' => ['nullable', 'string'],
        ]);

        $parts = explode(' - ', $request->get('client_name'));
        $client_id = $parts[0];
        $client_name = $parts[1];

        // You can now use $validated to create a model or do further processing
        ServiceRequest::create([
            'client_id' => $client_id,
            'client_name' => $client_name,
            'title' => $validated['title'] ?? 'null',
            'details' => $validated['details'],
            'preferred_day' => $validated['preferred_day'],
            'alternate_day' => $validated['alternate_day'],
            'arrival_times' => $validated['arrival_times'],
            'assessment_required' => false,
            'cleaning_services' => $validated['cleaning_services'],
            'internal_notes' => $validated['internal_notes'],
        ])->save();

        return redirect()->route('bookings.index')->with('success', 'Request created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        $serviceRequest = ServiceRequest::with('client')->findOrFail($id);
        $quotes = BookingQuote::where('booking_id', $id)->orderBy('created_at', 'desc')->get();
        // check approved quotes is pending
        if ($quotes)
            $approvedQuotes = $quotes->first()?->is_approved == true;

        return Inertia::render('Requests/Show', [
            'request' => $serviceRequest,
            'quotes' => $quotes,
            'approvedQuotes' => $approvedQuotes,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, $id)
    {
        $serviceRequest = ServiceRequest::with('client')->findOrFail($id);
        return Inertia::render('Requests/Edit', [
            'clients' => Client::all(),
            'request' => $serviceRequest,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ServiceRequest $serviceRequest)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        $serviceRequest = ServiceRequest::findOrFail($id);
        $serviceRequest->delete();

        return redirect()->route('bookings.index')->with('success', 'Request deleted successfully.');
    }

    public function quoteAdd(Request $request)
    {
        $serviceRequest = ServiceRequest::findOrFail($request['service_request_id']);
        $serviceRequest->update([
            'status' => ServiceRequest::STATUS_ACTIVE,
            'quote_amount' => $request['quote_amount'],
        ]);

        $quote = BookingQuote::create([
            'booking_id' => $request['service_request_id'],
            'quote_amount' => $request['quote_amount']
        ]);

        $quotationData = [
            'id' => $quote->id,
            'quotation_number' => 'QT-' . date('Ymd') . rand(100, 999),
            'customer_name' => $request['customer_name'],
            'customer_email' => $request['customer_email'],
            'total_amount' => number_format($request['quote_amount'], 2),
            'description' => $request['description'] ?? null,
            'valid_until' => now()->addDays(30)->format('F j, Y'),
        ];

        Mail::to($quotationData['customer_email'])
            ->send(new QuotationMail($quotationData));

        return redirect()->route('bookings.show', $request['service_request_id'])->with('success', 'Quote added successfully.');
    }

    public function approve(BookingQuote $quote, $token)
    {
        $this->validateToken($quote->id, 'approve', $token);

        if ($quote->is_approved) {
            return redirect()->back()->with('error', 'This quote is already approved');
        }

        if ($quote->is_rejected) {
            return redirect()->back()->with('error', 'Cannot approve a rejected quote');
        }


        $quote->approve();
        $quote->booking->update([
            'status' => ServiceRequest::STATUS_APPROVED,
            'quote_amount' => $quote->quote_amount,
        ]);
        $data = [
            'client_id' => $quote->booking->client_id,
            'service_request_id' => $quote->booking_id,
            'schedule_date' => $quote->booking->preferred_day,
            'schedule_time' => '0:00',
            'notes' => $quote->booking->details,
            'total_price' => 0,
        ];
        Job::create($data);

        return view('quotes.response', [
            'message' => 'Quote approved successfully!',
            'quote' => $quote
        ]);
    }

    public function reject(BookingQuote $quote, $token)
    {
        $this->validateToken($quote->id, 'reject', $token);

        if ($quote->is_approved) {
            return redirect()->back()->with('error', 'Cannot reject an approved quote');
        }

        if ($quote->is_rejected) {
            return redirect()->back()->with('error', 'This quote is already rejected');
        }

        $quote->reject();
        $quote->booking->update([
            'status' => ServiceRequest::STATUS_REJECTED,
        ]);

        return view('quotes.response', [
            'message' => 'Quote has been rejected.',
            'quote' => $quote
        ]);
    }

    protected function validateToken($quoteId, $action, $token)
    {
        $validToken = hash_hmac('sha256', $quoteId . $action, config('app.key'));

        if (!hash_equals($validToken, $token)) {
            abort(403, 'Invalid action token');
        }
    }
}
