import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface FeedbackDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    bookingId: number;
    category: 'resort' | 'hotel' | 'ubaap' | 'restaurant' | 'landing_area';
    bookingReference?: string;
    existingFeedback?: {
        rating: number;
        comment: string;
    } | null;
}

export function FeedbackDialog({ open, onOpenChange, bookingId, category, bookingReference, existingFeedback }: FeedbackDialogProps) {
    const [rating, setRating] = useState(existingFeedback?.rating || 0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState(existingFeedback?.comment || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        setIsSubmitting(true);

        router.post(
            '/feedbacks',
            {
                category,
                booking_id: bookingId,
                booking_reference: bookingReference,
                rating,
                comment,
            },
            {
                onSuccess: () => {
                    toast.success('Thank you for your feedback!');
                    onOpenChange(false);
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    console.error(errors);
                    toast.error('Failed to submit feedback');
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{existingFeedback ? 'Your Feedback' : 'Leave Feedback'}</DialogTitle>
                    <DialogDescription>
                        {existingFeedback ? 'You have already submitted feedback for this booking.' : 'Share your experience with us'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Star Rating */}
                    <div className="space-y-2">
                        <Label htmlFor="rating">Rating</Label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    disabled={!!existingFeedback}
                                    className="disabled:cursor-not-allowed"
                                    onMouseEnter={() => !existingFeedback && setHoveredRating(star)}
                                    onMouseLeave={() => !existingFeedback && setHoveredRating(0)}
                                    onClick={() => !existingFeedback && setRating(star)}
                                >
                                    <Star
                                        className={`h-8 w-8 ${
                                            star <= (hoveredRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {rating > 0 && `You rated this ${rating} star${rating > 1 ? 's' : ''}`}
                        </p>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <Label htmlFor="comment">Comment</Label>
                        <Textarea
                            id="comment"
                            placeholder="Tell us about your experience..."
                            value={comment}
                            onChange={(e) => !existingFeedback && setComment(e.target.value)}
                            className="min-h-[100px]"
                            maxLength={1000}
                            disabled={!!existingFeedback}
                        />
                        <p className="text-xs text-muted-foreground">{comment.length}/1000 characters</p>
                    </div>
                </div>

                <DialogFooter>
                    {!existingFeedback && (
                        <>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                            </Button>
                        </>
                    )}
                    {existingFeedback && (
                        <Button type="button" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
