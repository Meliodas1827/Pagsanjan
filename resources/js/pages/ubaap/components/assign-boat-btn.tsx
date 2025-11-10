import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useForm, usePage } from "@inertiajs/react"
import { Sailboat } from "lucide-react"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export interface AssignBoatProps {
    bookingId: string | number
    availableBoats: { id: string | number; boat_no: string; capacity: number }[]
}


const AssignBoatModal: React.FC<AssignBoatProps> = ({
    bookingId,
    availableBoats,
}) => {
    const [open, setOpen] = useState(false)
    const [boatId, setBoatId] = useState<string | number | null>(null);

    const { post, processing } = useForm()

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault()

        if (!boatId) return

        post(route("assign.boat", { boatBookingId: bookingId, boat_id: Number(boatId) }), {
            onSuccess: () => {
                setOpen(false)
                setBoatId(null);
                toast.success('Boat Assigned Successfully!');
            },
            onError: (errors) => {
                console.error("Boat assignment failed:", errors)
                toast.error("Failed to assign boat. Please try again.")
            },
            preserveScroll: true,
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant={null}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                            onClick={() => setOpen(true)}
                        >
                            <Sailboat className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Assign Boat</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>






            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Boat</DialogTitle>
                    <DialogDescription>
                        Select an available boat for this booking.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleAssign} className="space-y-4">
                    <RadioGroup
                        onValueChange={(val) => setBoatId(val)}
                        value={boatId?.toString()}
                    >
                        {availableBoats.length > 0 ? (
                            availableBoats.map((boat) => (
                                <div
                                    key={boat.id}
                                    className="flex items-center space-x-2 border p-2 rounded-lg hover:bg-gray-50"
                                >
                                    <RadioGroupItem value={boat.id.toString()} id={`boat-${boat.id}`} />
                                    <Label htmlFor={`boat-${boat.id}`}>
                                        {boat.boat_no} — Capacity: {boat.capacity}
                                    </Label>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No boats available.</p>
                        )}
                    </RadioGroup>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-green-600 text-white hover:bg-green-700"
                            disabled={!boatId || processing}
                        >
                            {processing ? "Assigning..." : "Confirm Assignment"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AssignBoatModal
