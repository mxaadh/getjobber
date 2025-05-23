<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Property;
use App\Models\User;
use App\Models\UserDetail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        $clients = Client::with('properties')->latest()->get();
        $clients_count = Client::count();
        $clients_count_month = Client::whereBetween('created_at', [
            Carbon::now()->startOfMonth(), // 1st day of month
            Carbon::now() // current time
        ])->count();
        $clients_count_week = Client::whereBetween('created_at', [
            Carbon::now()->startOfWeek(), // Monday
            Carbon::now() // current time
        ])->count();

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'clients_count' => $clients_count,
            'clients_count_month' => $clients_count_month,
            'clients_count_week' => $clients_count_week,
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
            'phone' => 'nullable|string|max:20',
            'email' => 'required|email|unique:clients,email',
            'street1' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'postal_code' => 'required|string|max:255',
            'country' => 'required|string|max:255'
        ]);

        $client = Client::create([
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

        return redirect()->route('clients.index')->with('success', 'Client created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show($id)
    {
        $client = Client::findOrFail($id);

        return Inertia::render('Clients/Show', [
            'client' => $client,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit($id)
    {
        $client = Client::findOrFail($id);

        return Inertia::render('Clients/Edit', [
            'client' => $client,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $client->id,
        ]);

        $client->update($validated);

        return redirect()->route('clients.index')->with('success', 'Client updated successfully.');
    }

    /**
     * Remove the specified user.
     */
    public function destroy($id)
    {
        Client::destroy($id);

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
