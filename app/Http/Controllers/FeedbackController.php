<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // For admin, allow category filtering via query parameter
        if ($user->role_id === 1) {
            $category = $request->query('category');
            // Validate category if provided
            if ($category && !in_array($category, ['landing_area', 'resort', 'restaurant', 'hotel', 'ubaap'])) {
                $category = null;
            }
        } else {
            // Determine category based on user role
            $category = match($user->role_id) {
                8 => 'landing_area',
                4 => 'resort',
                7 => 'restaurant',
                6 => 'hotel',
                5 => 'ubaap',
                default => null,
            };
        }

        // Build query with business-specific filtering
        $query = Feedback::with('user')->orderBy('feedbacks.created_at', 'desc');

        // Filter by specific business if not admin
        if ($category && $user->role_id !== 1) {
            switch ($category) {
                case 'resort':
                    // Join with resort_bookings and filter by user's resort_id
                    $query->join('resort_bookings', function($join) use ($user) {
                        $join->on('feedbacks.booking_id', '=', 'resort_bookings.id')
                             ->where('feedbacks.category', '=', 'resort')
                             ->where('resort_bookings.resort_id', '=', $user->resort_id);
                    });
                    break;

                case 'hotel':
                    // Join with bookings and filter by user's hotelid
                    $query->join('bookings', function($join) use ($user) {
                        $join->on('feedbacks.booking_id', '=', 'bookings.id')
                             ->where('feedbacks.category', '=', 'hotel')
                             ->where('bookings.hotelid', '=', $user->hotelid);
                    });
                    break;

                case 'restaurant':
                    // Join with resto_bookings and filter by user's restoid
                    $query->join('resto_bookings', function($join) use ($user) {
                        $join->on('feedbacks.booking_id', '=', 'resto_bookings.id')
                             ->where('feedbacks.category', '=', 'restaurant')
                             ->where('resto_bookings.resto_id', '=', $user->restoid);
                    });
                    break;

                case 'landing_area':
                    // Join with landing_area_requests and filter by user's landing_area_id
                    $query->join('landing_area_requests', function($join) use ($user) {
                        $join->on('feedbacks.booking_id', '=', 'landing_area_requests.id')
                             ->where('feedbacks.category', '=', 'landing_area')
                             ->where('landing_area_requests.landing_area_id', '=', $user->landing_area_id);
                    });
                    break;

                case 'ubaap':
                    // For boat/ubaap, just filter by category (all boat bookings)
                    $query->forCategory($category);
                    break;
            }

            // Select only feedback columns to avoid conflicts
            $query->select('feedbacks.*');
        } elseif ($category) {
            // Admin with category filter
            $query->forCategory($category);
        }

        $feedbacks = $query->paginate(20);

        // Calculate statistics with same filtering
        $statsQuery = Feedback::query();
        if ($category && $user->role_id !== 1) {
            switch ($category) {
                case 'resort':
                    $statsQuery->join('resort_bookings', function($join) use ($user) {
                        $join->on('feedbacks.booking_id', '=', 'resort_bookings.id')
                             ->where('feedbacks.category', '=', 'resort')
                             ->where('resort_bookings.resort_id', '=', $user->resort_id);
                    });
                    break;
                case 'hotel':
                    $statsQuery->join('bookings', function($join) use ($user) {
                        $join->on('feedbacks.booking_id', '=', 'bookings.id')
                             ->where('feedbacks.category', '=', 'hotel')
                             ->where('bookings.hotelid', '=', $user->hotelid);
                    });
                    break;
                case 'restaurant':
                    $statsQuery->join('resto_bookings', function($join) use ($user) {
                        $join->on('feedbacks.booking_id', '=', 'resto_bookings.id')
                             ->where('feedbacks.category', '=', 'restaurant')
                             ->where('resto_bookings.resto_id', '=', $user->restoid);
                    });
                    break;
                case 'landing_area':
                    $statsQuery->join('landing_area_requests', function($join) use ($user) {
                        $join->on('feedbacks.booking_id', '=', 'landing_area_requests.id')
                             ->where('feedbacks.category', '=', 'landing_area')
                             ->where('landing_area_requests.landing_area_id', '=', $user->landing_area_id);
                    });
                    break;
                case 'ubaap':
                    $statsQuery->forCategory($category);
                    break;
            }
        } elseif ($category) {
            $statsQuery->forCategory($category);
        }

        $totalFeedbacks = $statsQuery->count();
        $averageRating = $statsQuery->avg('feedbacks.rating');

        $ratingDistribution = (clone $statsQuery)
            ->selectRaw('feedbacks.rating, COUNT(*) as count')
            ->groupBy('feedbacks.rating')
            ->pluck('count', 'feedbacks.rating')
            ->toArray();

        return Inertia::render('Feedbacks', [
            'feedbacks' => $feedbacks,
            'statistics' => [
                'total' => $totalFeedbacks,
                'average_rating' => round($averageRating ?? 0, 1),
                'distribution' => $ratingDistribution,
            ],
            'category' => $category,
            'isAdmin' => $user->role_id === 1,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => ['required', 'in:landing_area,resort,restaurant,hotel,ubaap'],
            'booking_id' => ['nullable', 'integer'],
            'booking_reference' => ['nullable', 'string'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'max:1000'],
        ]);

        // Check if feedback already exists
        $existingFeedback = Feedback::where('user_id', auth()->id())
            ->where('category', $validated['category'])
            ->where('booking_id', $validated['booking_id'])
            ->first();

        if ($existingFeedback) {
            return back()->with('error', 'You have already submitted feedback for this booking.');
        }

        try {
            $feedback = Feedback::create([
                'user_id' => auth()->id(),
                'category' => $validated['category'],
                'booking_id' => $validated['booking_id'] ?? null,
                'booking_reference' => $validated['booking_reference'] ?? null,
                'rating' => $validated['rating'],
                'comment' => $validated['comment'],
            ]);

            return back()->with('success', 'Thank you for your feedback!');
        } catch (\Illuminate\Database\QueryException $e) {
            // Handle unique constraint violation
            if ($e->getCode() == 23000) {
                return back()->with('error', 'You have already submitted feedback for this booking.');
            }

            return back()->with('error', 'Failed to submit feedback. Please try again.');
        }
    }

    public function destroy(Feedback $feedback)
    {
        // Only admin can delete feedback
        if (auth()->user()->role !== 'admin') {
            return back()->with('error', 'Unauthorized action');
        }

        $feedback->delete();

        return back()->with('success', 'Feedback deleted successfully');
    }
}
