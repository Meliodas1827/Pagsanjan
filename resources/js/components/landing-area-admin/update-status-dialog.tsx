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
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UpdateStatusDialogProps {
    requestId: number;
    currentStatus: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function UpdateStatusDialog({ requestId, currentStatus, open, onOpenChange }: UpdateStatusDialogProps) {
    const [status, setStatus] = useState(currentStatus);
    const [adminNotes, setAdminNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.put(
            route('landing-area.requests.update-status', { landingAreaRequest: requestId }),
            {
                status,
                admin_notes: adminNotes,
            },
            {
                onSuccess: () => {
                    toast.success('Status updated successfully');
                    onOpenChange(false);
                    setAdminNotes('');
                },
                onError: (errors) => {
                    toast.error('Failed to update status');
                    console.error('Update errors:', errors);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Update Request Status</DialogTitle>
                        <DialogDescription>
                            Change the status of this booking request and optionally add notes.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger id="status">
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
                            <Label htmlFor="admin_notes">Admin Notes (Optional)</Label>
                            <Textarea
                                id="admin_notes"
                                placeholder="Add any notes about this status change..."
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                rows={4}
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
