<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];

    protected $appends = ['address'];

    protected $casts = [
        'role' => 'string',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    const ROLE_ADMIN = 'admin';
    const ROLE_CONTRACTOR = 'contractor';
    const ROLE_EMPLOYEE = 'employee';
    const ROLE_CLIENT = 'client';

    const ROLES = [
        self::ROLE_ADMIN,
        self::ROLE_CONTRACTOR,
        self::ROLE_EMPLOYEE,
        self::ROLE_CLIENT
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Helper methods for checking roles
    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isContractor(): bool
    {
        return $this->role === self::ROLE_CONTRACTOR;
    }

    public function isEmployee(): bool
    {
        return $this->role === self::ROLE_EMPLOYEE;
    }

    public function isClient(): bool
    {
        return $this->role === self::ROLE_CLIENT;
    }

    public function userDetail()
    {
        return $this->hasOne(UserDetail::class);
    }

    public function getAddressAttribute()
    {
        $address = $this->userDetail()->first();
        if (!$address) {
            return 'No address found';
        }

        return "{$address->street1}, {$address->city}, {$address->state}, {$address->country}";
    }
}
