<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
//        employee_count, contractor_count, client_count
        $query = User::latest();
        $employee_count = User::where('role', User::ROLE_EMPLOYEE)->count();
        $contractor_count = User::where('role', User::ROLE_CONTRACTOR)->count();
        $client_count = User::where('role', User::ROLE_CLIENT)->count();

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhereHas('userDetail', function($r) use ($search) {
                      $r->where('phone', 'like', "%{$search}%")
                        ->orWhere('country', 'like', "%{$search}%")
                        ->orWhere('state', 'like', "%{$search}%")
                        ->orWhere('city', 'like', "%{$search}%");
                  });
            });
        }

        $users = $query->paginate(10);

        return Inertia::render('Users/Index', [
            'users' => $users,
            'employee_count' => $employee_count,
            'contractor_count' => $contractor_count,
            'client_count' => $client_count,
            'searchQuery' => $request->search,
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,contractor,employee',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        // Optionally, you can create a user detail record here
        UserDetail::create([
            'user_id' => $user->id,
            'phone' => $request->input('phone'),
            'country' => $request->input('country'),
            'state' => $request->input('state'),
            'city' => $request->input('city'),
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $user->load('userDetail');

        return Inertia::render('Users/Edit', [
            'record' => $user,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user.
     */
    public function destroy($id)
    {
        User::destroy($id);

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
