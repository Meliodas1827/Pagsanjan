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
import { Input } from "@/components/ui/input"
import { useForm } from "@inertiajs/react"
import InputError from "@/components/input-error"

interface CancelBookingBtnProps {
  id?: string;
  onSuccess?: (wasRefunded: boolean) => void;
}

const CancelBookingBtn = ({ id, onSuccess }: CancelBookingBtnProps) => {
  const [open, setOpen] = useState(false)
  const [confirmationText, setConfirmationText] = useState("")
  const [showError, setShowError] = useState(false)

  const { post, processing } = useForm();

  const requiredPhrase = "I am cancelling this now"

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault()

    if (confirmationText !== requiredPhrase) {
      setShowError(true)
      return
    }

    setShowError(false)

    post(route("cancel.bookings", { reference_id: id }), {
      onSuccess: (response: any) => {
        console.log("Cancellation successful:", response)
        
        // Close the dialog
        setOpen(false)
        setConfirmationText("")
        
        // Check if refund was processed - Laravel returns this in the session flash data
        // which gets passed to Inertia as props
        const wasRefunded = response?.props?.flash?.refund === true || 
                           response?.props?.refund === true ||
                           (typeof response === 'object' && 'refund' in response && response.refund === true);
        
        // Call the parent callback
        if (onSuccess) {
          onSuccess(wasRefunded)
        }
      },
      onError: (errors) => {
        console.error("Cancellation failed:", errors)
        setShowError(true)
        
        // Handle validation errors
        if (errors.message) {
          alert(errors.message)
        }
      },
      preserveScroll: true,
      preserveState: true,
    })
  }

  const resetStates = () => {
    setOpen(false)
    setConfirmationText("")
    setShowError(false)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetStates()
      setOpen(isOpen)
    }}>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Cancel Booking
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Booking Cancellation</DialogTitle>
          <DialogDescription>
            To confirm your cancellation, please type the phrase below:
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-2" onSubmit={handleCancel}>
          <p className="text-sm text-muted-foreground">
            Type exactly: <strong>{requiredPhrase}</strong>
          </p>
          <Input
            placeholder="Type here..."
            value={confirmationText}
            onChange={(e) => {
              setConfirmationText(e.target.value)
              setShowError(false)
            }}
            className={showError ? "border-red-500" : ""}
            disabled={processing}
          />
          {showError && (
            <InputError message="The confirmation phrase does not match." />
          )}
        </form>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => resetStates()}
            disabled={processing}
          >
            Close
          </Button>
          <Button
            className="bg-red-700 hover:bg-red-800"
            disabled={confirmationText !== requiredPhrase || processing}
            onClick={handleCancel}
            type="button"
          >
            {processing ? "Cancelling..." : "Cancel now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CancelBookingBtn