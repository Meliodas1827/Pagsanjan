<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FeedbackReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Feedback::with('user')->orderBy('created_at', 'desc');

        // Category filter
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Rating filter
        if ($request->has('rating') && $request->rating) {
            $query->where('rating', $request->rating);
        }

        // Date range filter
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search filter (by user name, email, or comment)
        if ($request->has('search') && $request->search) {
            $searchTerm = $request->search;
            $query->where(function($q) use ($searchTerm) {
                $q->whereHas('user', function($userQuery) use ($searchTerm) {
                    $userQuery->where('name', 'like', "%{$searchTerm}%")
                              ->orWhere('email', 'like', "%{$searchTerm}%");
                })
                ->orWhere('comment', 'like', "%{$searchTerm}%");
            });
        }

        $feedbacks = $query->paginate(15);

        // Overall statistics
        $totalFeedbacks = Feedback::count();
        $averageRating = Feedback::avg('rating');

        // Statistics by category
        $categoryStats = Feedback::select('category', DB::raw('COUNT(*) as count'), DB::raw('AVG(rating) as avg_rating'))
            ->groupBy('category')
            ->get()
            ->keyBy('category');

        // Rating distribution
        $ratingDistribution = Feedback::select('rating', DB::raw('COUNT(*) as count'))
            ->groupBy('rating')
            ->orderBy('rating', 'desc')
            ->pluck('count', 'rating')
            ->toArray();

        // Recent feedbacks trend (last 7 days)
        $recentTrend = Feedback::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as count'),
            DB::raw('AVG(rating) as avg_rating')
        )
        ->where('created_at', '>=', now()->subDays(7))
        ->groupBy('date')
        ->orderBy('date', 'asc')
        ->get();

        // Top rated categories
        $topRatedCategories = Feedback::select('category', DB::raw('AVG(rating) as avg_rating'), DB::raw('COUNT(*) as count'))
            ->groupBy('category')
            ->having('count', '>=', 1)
            ->orderBy('avg_rating', 'desc')
            ->get();

        // Latest feedbacks
        $latestFeedbacks = Feedback::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('admin/Feedback', [
            'feedbacks' => $feedbacks,
            'filters' => [
                'category' => $request->category,
                'rating' => $request->rating,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to,
                'search' => $request->search,
            ],
            'statistics' => [
                'total' => $totalFeedbacks,
                'average_rating' => round($averageRating ?? 0, 2),
                'category_stats' => $categoryStats,
                'rating_distribution' => $ratingDistribution,
                'recent_trend' => $recentTrend,
                'top_rated_categories' => $topRatedCategories,
                'latest_feedbacks' => $latestFeedbacks,
            ],
        ]);
    }
}
