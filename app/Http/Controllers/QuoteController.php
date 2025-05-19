<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $quotes = Quote::latest()->get();

        return Inertia::render('Quotes/Index', [
            'quotes' => $quotes,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Quotes/Create', [
            'clients' => Client::all()
        ]);
    }

    public function store(Request $request)
    {
        // Step 1: Validate main quote data
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'job_title' => 'required|string|max:255',
            'quote_number' => 'required|string|max:50|unique:quotes,quote_number',
            'quote_date' => 'required|date',
            'rate_opportunity' => 'nullable|integer|min:1|max:5',
            'client_message' => 'nullable|string',
            'contract' => 'nullable|string',
            'internal_notes' => 'nullable|string',
            'subtotal' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'tax' => 'nullable|numeric',
            'total' => 'required|numeric',
            'deposit_required' => 'nullable|numeric',
            'items' => 'required|array|min:1',
            'items..name' => 'required|string',
            'items..description' => 'nullable|string',
            'items..quantity' => 'required|integer|min:1',
            'items..unit_price'=> 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
        ]);

        // Step 2: Create the main quote
        $quote = Quote::create([
            'client_id'         => $validated['client_id'],
            'job_title'         => $validated['job_title'],
            'quote_number'      => $validated['quote_number'],
            'quote_date'        => $validated['quote_date'],
            'rate_opportunity'  => $validated['rate_opportunity'] ?? null,
            'client_message'    => $validated['client_message'] ?? null,
            'contract'          => $validated['contract'] ?? null,
            'internal_notes'    => $validated['internal_notes'] ?? null,
            'subtotal'          => $validated['subtotal'],
            'discount'          => $validated['discount'] ?? 0,
            'tax'               => $validated['tax'] ?? 0,
            'total'             => $validated['total'],
            'deposit_required'  => $validated['deposit_required'] ?? 0,
        ]);

        // Step 3: Create line items
        foreach ($validated['items'] as $item) {
            QuoteItem::create([
                'quote_id'   => $quote->id,
                'name'       => $item['name'],
                'description'=> $item['description'] ?? null,
                'quantity'   => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total'      => $item['total'],
            ]);
        }

        // Step 4: Return response
        return response()->json([
            'message' => 'Quote created successfully.',
            'quote_id' => $quote->id,
        ], 201);

    }
}
