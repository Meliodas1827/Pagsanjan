<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeedbackController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Determine category based on user role
        $category = match($user->role) {
            'landing_area' => 'landing_area',
            'resort' => 'resort',
            'restaurant' => 'restaurant',
            'hotel' => 'hotel',
            'ubaap' => 'ubaap',
            'admin' => null, // Admin can see all
            default => null,
        };

        // Build query
        $query = Feedback::with('user')->orderBy('created_at', 'desc');

        // Filter by category if not admin
        if ($category) {
            $query->forCategory($category);
        }

        $feedbacks = $query->paginate(20);

        // Calculate statistics
        $totalFeedbacks = $category ?
            Feedback::forCategory($category)->count() :
            Feedback::count();

        $averageRating = $category ?
            Feedback::forCategory($category)->avg('rating') :
            Feedback::avg('rating');

        $ratingDistribution = $category ?
            Feedback::forCategory($category)
                ->selectRaw('rating, COUNT(*) as count')
                ->groupBy('rating')
                ->pluck('count', 'rating')
                ->toArray() :
            Feedback::selectRaw('rating, COUNT(*) as count')
                ->groupBy('rating')
                ->pluck('count', 'rating')
                ->toArray();

        return Inertia::render('Feedbacks', [
            'feedbacks' => $feedbacks,
            'statistics' => [
                'total' => $totalFeedbacks,
                'average_rating' => round($averageRating ?? 0, 1),
                'distribution' => $ratingDistribution,
            ],
            'category' => $category,
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

        $feedback = Feedback::create([
            'user_id' => auth()->id(),
            'category' => $validated['category'],
            'booking_id' => $validated['booking_id'] ?? null,
            'booking_reference' => $validated['booking_reference'] ?? null,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return back()->with('success', 'Thank you for your feedback!');
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
