import { useForm } from "@inertiajs/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { mutate } from "swr"

const DeclineBtn = ({ id }: { id: number }) => {
  const [open, setOpen] = useState(false)

  const { data, post, errors, processing } = useForm({
    booking_id: id,
  })

  const handleAccept = () => {
    if (!id) {
      console.error("Booking ID required")
      return
    }

    post(route("admin.booking.decline"), {
      onSuccess: () => {
        mutate('api/reservation')
        toast.success("Declined successfully!")
        setOpen(false)
      },
      onError: () => {
        console.log(errors);
        toast.error("Error: Unable to decline!" )
      },
    })

  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <span 
        onClick={() => setOpen(true)} 
        className="w-full max-w-xs"
      >
        Decline
      </span>

      {/* Dialog Content */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Decline Booking</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600">
          Are you sure you want to decline this booking request?
        </p>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)} 
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAccept} 
            disabled={processing} 
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
          >
            {processing ? "Processing..." : "Decline"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeclineBtn
