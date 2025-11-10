import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UpdateRequestStatusDialogProps {
    requestId: number;
    currentStatus: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function UpdateRequestStatusDialog({ requestId, currentStatus, open, onOpenChange }: UpdateRequestStatusDialogProps) {
    const [status, setStatus] = useState(currentStatus);
    const [adminNotes, setAdminNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.put(
            route('ubaap.landing-area-requests.update-status', { landingAreaRequest: requestId }),
            {
                status,
                admin_notes: adminNotes,
            },
            {
                onSuccess: () => {
                    toast.success('Request status updated successfully');
                    onOpenChange(false);
                    setAdminNotes('');
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    console.error('Error updating status:', errors);
                    toast.error('Failed to update request status');
                    setIsSubmitting(false);
                },
            }
        );
    };

    const statusOptions = [
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'assigned', label: 'Assigned' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Request Status</DialogTitle>
                    <DialogDescription>Change the status of this landing area request.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger id="status">
                                    <SelectValue />
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
                            <Label htmlFor="notes">Admin Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Add any notes for the customer..."
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
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
