import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Boat {
    id: number;
    boat_no: string;
    bankero_name: string;
    capacity: number;
    status: string;
}

interface AssignBoatDialogProps {
    requestId: number;
    boats: Boat[];
    currentBoatId?: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AssignBoatDialog({ requestId, boats, currentBoatId, open, onOpenChange }: AssignBoatDialogProps) {
    const [boatId, setBoatId] = useState<string>(currentBoatId ? currentBoatId.toString() : '');
    const [adminNotes, setAdminNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!boatId) {
            toast.error('Please select a boat');
            return;
        }

        setIsSubmitting(true);

        router.post(
            route('ubaap.landing-area-requests.assign-boat', { landingAreaRequest: requestId }),
            {
                boat_id: boatId,
                admin_notes: adminNotes,
            },
            {
                onSuccess: () => {
                    toast.success('Boat assigned successfully');
                    onOpenChange(false);
                    setAdminNotes('');
                    setIsSubmitting(false);
                },
                onError: (errors) => {
                    console.error('Error assigning boat:', errors);
                    toast.error('Failed to assign boat');
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Assign Boat</DialogTitle>
                    <DialogDescription>Assign a boat to this landing area request. This will change the status to "assigned".</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="boat">Boat</Label>
                            <Select value={boatId} onValueChange={setBoatId}>
                                <SelectTrigger id="boat">
                                    <SelectValue placeholder="Select a boat" />
                                </SelectTrigger>
                                <SelectContent>
                                    {boats.map((boat) => (
                                        <SelectItem key={boat.id} value={boat.id.toString()}>
                                            {boat.boat_no} - {boat.bankero_name} (Capacity: {boat.capacity})
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
                            {isSubmitting ? 'Assigning...' : 'Assign Boat'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
