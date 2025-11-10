import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UpdateBookingStatusDialogProps {
    bookingId: number;
    currentStatus: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UpdateBookingStatusDialog({
    bookingId,
    currentStatus,
    open,
    onOpenChange,
}: UpdateBookingStatusDialogProps) {
    const [status, setStatus] = useState(currentStatus);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.put(
            route('hotel.bookings.update-status', { booking: bookingId }),
            {
                status,
                notes,
            },
            {
                onSuccess: () => {
                    toast.success('Booking status updated successfully');
                    onOpenChange(false);
                    setNotes('');
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    console.error('Error updating status:', errors);
                    toast.error('Failed to update booking status');
                    setIsSubmitting(false);
                },
            }
        );
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'declined', label: 'Declined' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'done', label: 'Done' },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Update Booking Status</DialogTitle>
                        <DialogDescription>
                            Change the booking status and add optional notes.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any notes or comments..."
                                className="min-h-[100px]"
                                maxLength={1000}
                            />
                            <p className="text-xs text-muted-foreground">
                                {notes.length}/1000 characters
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Updating...' : 'Update Status'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
