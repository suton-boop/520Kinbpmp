import os
import re

base_dir = 'c:/Users/suton/.gemini/antigravity/brain/Dasboardkin520'

# 1. Update HandleInertiaRequests.php
inertia_req = os.path.join(base_dir, 'app/Http/Middleware/HandleInertiaRequests.php')
with open(inertia_req, 'r') as f:
    content = f.read()
if "'roles' =>" not in content:
    old_code = "'user' => ->user(),"
    new_code = "'user' => ->user() ? array_merge(->user()->toArray(), ['roles' => ->user()->getRoleNames()]) : null,"
    content = content.replace(old_code, new_code)
    with open(inertia_req, 'w') as f:
        f.write(content)

# 2. Update routes/web.php
routes_file = os.path.join(base_dir, 'routes/web.php')
with open(routes_file, 'r') as f:
    rcontent = f.read()

if "Route::resource('users'" not in rcontent:
    new_route = '''
    Route::middleware(['role:superadmin'])->group(function () {
        Route::resource('users', \App\Http\Controllers\UserController::class);
    });
'''
    # insert before the end of the first auth middleware group
    rcontent = rcontent.replace("Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');", "Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');" + new_route)
    with open(routes_file, 'w') as f:
        f.write(rcontent)

# 3. Create UserController
controller_file = os.path.join(base_dir, 'app/Http/Controllers/UserController.php')
controller_code = '''<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\GugusMutu;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    public function index()
    {
         = User::with(['roles', 'gugusMutu'])->latest()->paginate(10);
        return Inertia::render('Users/Index', [
            'users' => 
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create', [
            'roles' => Role::all(),
            'gugusMutus' => GugusMutu::all()
        ]);
    }

    public function store(Request )
    {
        ->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|exists:roles,name',
            'gugus_mutu_id' => 'nullable|exists:gugus_mutu,id',
        ]);

         = User::create([
            'name' => ->name,
            'email' => ->email,
            'password' => Hash::make(->password),
            'gugus_mutu_id' => ->gugus_mutu_id,
        ]);

        ->assignRole(->role);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function edit(User )
    {
        return Inertia::render('Users/Edit', [
            'user' => ->load('roles'),
            'roles' => Role::all(),
            'gugusMutus' => GugusMutu::all()
        ]);
    }

    public function update(Request , User )
    {
        ->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.->id,
            'role' => 'required|exists:roles,name',
            'gugus_mutu_id' => 'nullable|exists:gugus_mutu,id',
        ]);

        ->update([
            'name' => ->name,
            'email' => ->email,
            'gugus_mutu_id' => ->gugus_mutu_id,
        ]);

        if (->filled('password')) {
            ->validate(['password' => ['confirmed', Rules\Password::defaults()]]);
            ->update(['password' => Hash::make(->password)]);
        }

        ->syncRoles([->role]);

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy(User )
    {
        if (->id !== auth()->id()) {
            ->delete();
        }
        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }
}
'''
with open(controller_file, 'w') as f:
    f.write(controller_code)

print("Done phase 1")
