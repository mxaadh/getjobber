<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Property;
use App\Models\User;
use App\Models\UserDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use App\Mail\WelcomeEmail;
use Illuminate\Support\Facades\Mail;

class ClientController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $query = Client::with('properties')->latest();
        $clients_count = Client::count();
        $clients_count_month = Client::whereBetween('created_at', [
            Carbon::now()->startOfMonth(), // 1st day of month
            Carbon::now() // current time
        ])->count();
        $clients_count_week = Client::whereBetween('created_at', [
            Carbon::now()->startOfWeek(), // Monday
            Carbon::now() // current time
        ])->count();

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->where('first_name', 'like', "%{$searchTerm}%")
                    ->orWhere('last_name', 'like', "%{$searchTerm}%")
                    ->orWhere('company_name', 'like', "%{$searchTerm}%")
                    ->orWhere('email', 'like', "%{$searchTerm}%")
                    ->orWhere('phone', 'like', "%{$searchTerm}%");
            });
        }

        $clients = $query->paginate(10);

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'clients_count' => $clients_count,
            'clients_count_month' => $clients_count_month,
            'clients_count_week' => $clients_count_week,
            'searchQuery' => $request->search,
        ]);
    }

    public function create()
    {
        return Inertia::render('Clients/Create');
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:clients,email|unique:users,email',
            'street1' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
            'country' => 'required|string|max:255'
        ]);

        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make('password'), // Default password
            'role' => 'client',
        ]);

        UserDetail::create([
            'user_id' => $user->id,
            'phone' => $validated['phone'],
            'country' => $validated['country'],
            'state' => $validated['state'],
            'city' => $validated['city'],
        ]);

        $client = Client::create([
            'user_id' => $user->id,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'company_name' => $validated['company_name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
        ]);

        // Optionally, you can create a property record here
        Property::create([
            'client_id' => $client->id,
            'street1' => $validated['street1'],
            'street2' => $request->get('street2'),
            'city' => $validated['city'],
            'state' => $validated['state'],
            'postal_code' => $validated['postal_code'],
            'country' => $validated['country'],
        ]);

        // Send welcome email
        Mail::to($user->email)->send(new WelcomeEmail($user));

        return redirect()->route('clients.index')->with('success', 'Client created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show($id)
    {
        $client = Client::with('properties', 'serviceRequests')->findOrFail($id);
        return Inertia::render('Clients/Show', [
            'client' => $client,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit($id)
    {
        $client = Client::with('properties')->findOrFail($id);

        return Inertia::render('Clients/Edit', [
            'client' => $client,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, Client $client)
    {
//        $client = Client::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => [
                'required',
                'email',
                Rule::unique('clients', 'email')->ignore($client->id),
            ],
            'street1' => 'required|string|max:255',
            'street2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
            'country' => 'required|string|max:255'
        ]);

//        $client->update($validated);
        // Update the client details
        $client->update([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'company_name' => $validated['company_name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
        ]);

        // Optionally, you can create a property record here
        $client->properties()->first()->update([
            'client_id' => $client->id,
            'street1' => $validated['street1'],
            'street2' => $request->get('street2'),
            'city' => $validated['city'],
            'state' => $validated['state'],
            'postal_code' => $validated['postal_code'],
            'country' => $validated['country'],
        ]);

        return redirect()->route('clients.index')->with('success', 'Client updated successfully.');
    }

    /**
     * Remove the specified user.
     */
    public function destroy($id)
    {
        Client::destroy($id);

        return redirect()->route('clients.index')->with('success', 'User deleted successfully.');
    }
}
