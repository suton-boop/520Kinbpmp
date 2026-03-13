<?php

$base_dir = 'c:/Users/suton/.gemini/antigravity/brain/Dasboardkin520';

// 1. Update HandleInertiaRequests.php
$inertia_req = $base_dir . '/app/Http/Middleware/HandleInertiaRequests.php';
$content = file_get_contents($inertia_req);
if (strpos($content, "'roles' =>") === false) {
    // We add the roles
    $old_code = "'user' => \$request->user(),";
    $new_code = "'user' => \$request->user() ? array_merge(\$request->user()->toArray(), ['roles' => \$request->user()->getRoleNames()]) : null,";
    $content = str_replace($old_code, $new_code, $content);
    file_put_contents($inertia_req, $content);
}

// 2. Update routes/web.php
$routes_file = $base_dir . '/routes/web.php';
$rcontent = file_get_contents($routes_file);

if (strpos($rcontent, "Route::resource('users'") === false) {
    $new_route = "\n    Route::middleware(['role:superadmin'])->group(function () {\n        Route::resource('users', \App\Http\Controllers\UserController::class);\n    });\n";
    $search = "Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');";
    $replace = $search . $new_route;
    $rcontent = str_replace($search, $replace, $rcontent);
    file_put_contents($routes_file, $rcontent);
}

// 3. Create UserController
$controller_file = $base_dir . '/app/Http/Controllers/UserController.php';
$controller_code = "<?php\n\nnamespace App\Http\Controllers;\n\nuse App\Models\User;\nuse App\Models\GugusMutu;\nuse Spatie\Permission\Models\Role;\nuse Illuminate\Http\Request;\nuse Inertia\Inertia;\nuse Illuminate\Support\Facades\Hash;\nuse Illuminate\Validation\Rules;\n\nclass UserController extends Controller\n{\n    public function index()\n    {\n        \$users = User::with(['roles', 'gugusMutu'])->latest()->paginate(10);\n        return Inertia::render('Users/Index', [\n            'users' => \$users\n        ]);\n    }\n\n    public function create()\n    {\n        return Inertia::render('Users/Create', [\n            'roles' => Role::all(),\n            'gugusMutus' => GugusMutu::all()\n        ]);\n    }\n\n    public function store(Request \$request)\n    {\n        \$request->validate([\n            'name' => 'required|string|max:255',\n            'email' => 'required|string|email|max:255|unique:users',\n            'password' => ['required', 'confirmed', Rules\Password::defaults()],\n            'role' => 'required|exists:roles,name',\n            'gugus_mutu_id' => 'nullable|exists:gugus_mutu,id',\n        ]);\n\n        \$user = User::create([\n            'name' => \$request->name,\n            'email' => \$request->email,\n            'password' => Hash::make(\$request->password),\n            'gugus_mutu_id' => \$request->gugus_mutu_id,\n        ]);\n\n        \$user->assignRole(\$request->role);\n\n        return redirect()->route('users.index')->with('success', 'User created successfully.');\n    }\n\n    public function edit(User \$user)\n    {\n        return Inertia::render('Users/Edit', [\n            'user' => \$user->load('roles'),\n            'roles' => Role::all(),\n            'gugusMutus' => GugusMutu::all()\n        ]);\n    }\n\n    public function update(Request \$request, User \$user)\n    {\n        \$request->validate([\n            'name' => 'required|string|max:255',\n            'email' => 'required|string|email|max:255|unique:users,email,'.\$user->id,\n            'role' => 'required|exists:roles,name',\n            'gugus_mutu_id' => 'nullable|exists:gugus_mutu,id',\n        ]);\n\n        \$user->update([\n            'name' => \$request->name,\n            'email' => \$request->email,\n            'gugus_mutu_id' => \$request->gugus_mutu_id,\n        ]);\n\n        if (\$request->filled('password')) {\n            \$request->validate(['password' => ['confirmed', Rules\Password::defaults()]]);\n            \$user->update(['password' => Hash::make(\$request->password)]);\n        }\n\n        \$user->syncRoles([\$request->role]);\n\n        return redirect()->route('users.index')->with('success', 'User updated successfully.');\n    }\n\n    public function destroy(User \$user)\n    {\n        if (\$user->id !== auth()->id()) {\n            \$user->delete();\n        }\n        return redirect()->route('users.index')->with('success', 'User deleted successfully.');\n    }\n}\n";
file_put_contents($controller_file, $controller_code);
echo "Done Phase 1\n";
