<?php

namespace App\Http\Controllers;

use App\Models\QuoteItem;
use Auth;
use App\Mail\QuotationMail;
use App\Models\BookingQuote;
use App\Models\Client;
use App\Models\Job;
use App\Models\Service;
use App\Models\ServiceRequest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class ServiceRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ServiceRequest::latest();

        if (Auth::user()->isClient()) {
            $client = Client::where('email', Auth::user()->email)->first();
            $query = $query->where('client_id', $client->id);
        }

        // Filter functionality
        if ($request->has('filter') && !empty($request->filter)) {
            // Handle custom filters or fallback
            switch ($request->filter) {
                case 'Approved Requests':
                    $query->where('status', ServiceRequest::STATUS_APPROVED);
                    break;
                case 'Pending Requests':
                    // Special case where status is not approved
                    $query->whereNot('status', ServiceRequest::STATUS_APPROVED);
                    break;
                case 'Weekly Requests':
                    $query->whereBetween('created_at', [
                        Carbon::now()->startOfWeek(), // Monday
                        Carbon::now() // current time
                    ]);
                    break;
                case 'Monthly Requests':
                    // Special case where status is not approved
                    $query->whereBetween('created_at', [
                        Carbon::now()->startOfMonth(), // 1st day of month
                        Carbon::now() // current time
                    ]);
                    break;
                case 'All Requests':
                    $query->latest();
                    break;
                // Add other custom filter cases as needed
            }
        }

        $requests = $query->paginate(10);

        return Inertia::render('Requests/Index')->with([
            'requests' => $requests,
            'requests_count' => $this->stats()['count'] ?? 0,
            'requests_approved_count' => $this->stats()['approved_count'] ?? 0,
            'requests_unapproved_count' => $this->stats()['unapproved_count'] ?? 0,
            'requests_count_month' => $this->stats()['month_count'] ?? 0,
            'requests_count_week' => $this->stats()['week_count'] ?? 0,
        ]);
    }

    public function stats()
    {
        $data = [];
        $data['count'] = ServiceRequest::count();
        $data['approved_count'] = ServiceRequest::where('status', ServiceRequest::STATUS_APPROVED)->count();
        $data['unapproved_count'] = ServiceRequest::whereNot('status', ServiceRequest::STATUS_APPROVED)->count();
        $data['month_count'] = ServiceRequest::whereBetween('created_at', [
            Carbon::now()->startOfMonth(), // 1st day of month
            Carbon::now() // current time
        ])->count();
        $data['week_count'] = ServiceRequest::whereBetween('created_at', [
            Carbon::now()->startOfWeek(), // Monday
            Carbon::now() // current time
        ])->count();

        $client_id = 0;
        if (Auth::user()->isClient()) {
            $client_id = Client::where('email', Auth::user()->email)->first()->id ?? 0;
        }

        if ($client_id > 0) {
            $data['count'] = ServiceRequest::where('client_id', $client_id)->count();
            $data['approved_count'] = ServiceRequest::where('client_id', $client_id)->where('status', ServiceRequest::STATUS_APPROVED)->count();
            $data['unapproved_count'] = ServiceRequest::where('client_id', $client_id)->whereNot('status', ServiceRequest::STATUS_APPROVED)->count();
            $data['month_count'] = ServiceRequest::where('client_id', $client_id)->whereBetween('created_at', [
                Carbon::now()->startOfMonth(), // 1st day of month
                Carbon::now() // current time
            ])->count();
            $data['week_count'] = ServiceRequest::where('client_id', $client_id)->whereBetween('created_at', [
                Carbon::now()->startOfWeek(), // Monday
                Carbon::now() // current time
            ])->count();
        }

        return $data;
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

        return redirect()->route('requests.index')->with('success', 'Request created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        $serviceRequest = ServiceRequest::with('client')->findOrFail($id);
        $quotes = BookingQuote::with('items')->where('booking_id', $id)->orderBy('created_at', 'desc')->get();
        $services = Service::all();

        // check approved quotes is pending
        if ($quotes) {
            $approvedQuotes = $quotes->first()?->is_approved == true;
        }

        $checkQuotePending = false;
        if ($quotes->count() === 0) {
            $checkQuotePending = true;
        } else {
            $checkQuotePending = ($quotes->first()?->is_approved || $quotes->first()?->is_rejected) ? true : false;
        }

        return Inertia::render('Requests/Show', [
            'request' => $serviceRequest,
            'quotes' => $quotes,
            'approvedQuotes' => $approvedQuotes,
            'services' => $services,
            'checkQuotePending' => $checkQuotePending,
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

        return redirect()->route('requests.index')->with('success', 'Request deleted successfully.');
    }

    public function quoteAdd(Request $request)
    {
        $validated = $request->validate([
            'service_request_id' => 'required|integer|exists:service_requests,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email',
            'customer_address' => 'required|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.name' => 'nullable|string',
            'items.*.description' => 'nullable|string',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'tax_rate' => 'nullable|numeric',
            'tax' => 'nullable|numeric',
            'total' => 'required|numeric',
            'deposit_required' => 'nullable|numeric',
            'description' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            $serviceRequest = ServiceRequest::findOrFail($validated['service_request_id']);
            $serviceRequest->update([
                'status' => ServiceRequest::STATUS_ACTIVE,
                'quote_amount' => $validated['total'],
                'deposit_amount' => $validated['deposit_required'] ?? 0,
            ]);

            $quote = BookingQuote::create([
                'booking_id' => $validated['service_request_id'],
                'quote_amount' => $validated['total'],
            ]);

            foreach ($validated['items'] as $item) {
                $items = QuoteItem::create([
                    'quote_id' => $quote->id,
                    'name' => $item['name'] ?? '',
                    'description' => $item['description'] ?? '',
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total' => $item['total'],
                ]);
            }

            $quotationData = [
                'id' => $quote->id,
                'service_request_id' => $serviceRequest->id,
                'quotation_number' => 'QT-' . date('Ymd') . rand(100, 999),
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_address' => $validated['customer_address'],
                'total_amount' => number_format($validated['total'], 2),
                'description' => $validated['description'] ?? null,
                'valid_until' => now()->addDays(30)->format('F j, Y'),
                'items' => $validated['items'],
                'subtotal' => $validated['subtotal'],
                'discount' => $validated['discount'] ?? 0,
                'tax' => $validated['tax'] ?? 0,
                'deposit_required' => $validated['deposit_required'] ?? 0,
                'date_of_issue' => $quote->created_at->format('F j, Y'),
            ];

            Mail::to($quotationData['customer_email'])->send(new QuotationMail($quotationData));

            DB::commit();

            return redirect()->route('requests.show', $validated['service_request_id'])
                ->with('success', 'Quote added successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to save quote: ' . $e->getMessage()]);
        }
    }

    public function approve(BookingQuote $quote)
    {
//        $this->validateToken($quote->id, 'approve', $token);

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

        return redirect()->route('requests.show', $quote->booking_id)->with([
            'message' => 'Quote approved successfully!',
            'quote' => $quote
        ]);
    }

    public function reject(BookingQuote $quote, Request $request)
    {
        if ($quote->is_approved) {
            return redirect()->back()->with('error', 'Cannot reject an approved quote');
        }

        if ($quote->is_rejected) {
            return redirect()->back()->with('error', 'This quote is already rejected');
        }

        $quote->reject($request->reason ?? 'No reason provided');
        $quote->booking->update([
            'status' => ServiceRequest::STATUS_REJECTED,
        ]);

        return redirect()->route('requests.show', $quote->booking_id)->with([
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

    public function checkout(Request $request, $id)
    {
        $service = ServiceRequest::where('id', $id)->first();

        if (isset($service->deposit_amount) && $service->deposit_amount > 0)
            $unit_amount = intval(round(floatval($service->deposit_amount) * 100)); // convert to integer cents
        else
            $unit_amount = intval(round(floatval($service->quote_amount) * 100)); // convert to integer cents

        Stripe::setApiKey(config('services.stripe.secret'));

        $session = Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'aed',
                    'product_data' => [
                        'name' => 'Cleaning Service',
                    ],
                    'unit_amount' => $unit_amount,
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('payment.success'),
            'cancel_url' => route('payment.cancel'),
        ]);

        // Update the service request with the Stripe session ID
        if ($session)
            $service->update([
                'is_paid' => true, // Set to false initially
                'paid_at' => Carbon::now(), // Set to null initially
            ]);

        return Inertia::location($session->url);
    }
}
