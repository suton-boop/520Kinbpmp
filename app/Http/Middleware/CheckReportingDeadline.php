<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Carbon;

class CheckReportingDeadline
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Bypass check if user is super-admin
        if ($user && $user->hasRole('super-admin')) {
            return $next($request);
        }

        // Default logic for checking reporting boundaries
        // This middleware can be customized per endpoint (e.g., checking plan vs. realization)
        // 1. Plan submission (deadline: 20th of current month)
        // 2. Realization submission (deadline: 5th of next month)
        
        // This depends on the request payload, so we'll evaluate logic later inside Controller 
        // or extend this Middleware to take parameters.

        return $next($request);
    }
}
