import { useForm } from "@inertiajs/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"
import { mutate } from "swr";

const AcceptBtnDialog = ({ id }: { id: number }) => {
  const [open, setOpen] = useState(false)

  const { data, post, errors, processing } = useForm({
    booking_id: id,
  })

  const handleAccept = () => {
    if (!id) {
      console.error("Booking ID required")
      return
    }

    post(route("admin.booking.accept"), {
      onSuccess: () => {
        mutate('api/reservation');
        toast.success("Booking accepted!")
        setOpen(false)
      },
      onError: () => {
        console.log(errors);
        toast.error("Error: Unable to Accept!" )
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
        Accept
      </span>

      {/* Dialog Content */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Accept Booking</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600">
          Are you sure you want to accept this booking request?
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
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
          >
            {processing ? "Processing..." : "Accept"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AcceptBtnDialog
