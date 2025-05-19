<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $requests = ServiceRequest::latest()->get();

        return Inertia::render('Requests/Index', [
            'requests' => $requests,
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
            'title' => ['required', 'string', 'max:255'],
            'details' => ['nullable', 'string'],
            'preferred_day' => ['required', 'date'],
            'alternate_day' => ['nullable', 'date'],
            'arrival_times' => ['required', 'array'],
            'arrival_times.*' => ['in:Any time,Morning,Afternoon,Evening'],
            'assessment_required' => ['required', 'boolean'],
            'cleaning_services' => ['required', 'array'],
            'cleaning_services.*' => ['in:End of lease / Bond Cleaning,Carpet Steam Cleaning,Deep Cleaning,Move in Cleaning,Weekly / Fortnightly Cleaning'],
            'internal_notes' => ['nullable', 'string'],
        ]);

        // You can now use $validated to create a model or do further processing
        ServiceRequest::create($validated);

        return redirect()->route('requests.index')->with('success', 'Request created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ServiceRequest $serviceRequest)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ServiceRequest $serviceRequest)
    {
        //
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
    public function destroy(ServiceRequest $serviceRequest)
    {
        //
    }
}
