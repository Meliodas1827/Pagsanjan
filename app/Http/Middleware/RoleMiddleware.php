<?php

namespace App\Http\Middleware;

use App\Models\Role;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
         $roleIds = array_map(function ($roleName) {
            return Role::ROLE_NAMES[$roleName] ?? null;
        }, $roles);

          if (!Auth::check() || !in_array(Auth::user()->role_id, $roleIds, true)) {
            abort(403, 'Unauthorized');
        }
        return $next($request);
    }
}
