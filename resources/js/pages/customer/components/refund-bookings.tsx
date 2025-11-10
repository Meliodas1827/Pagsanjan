import { useState, useEffect } from "react"
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
import { useForm, usePage } from "@inertiajs/react"
import InputError from "@/components/input-error"
import { CancelationOption } from "@/pages/landing-page/components/bookings-header";

interface RefundProps {
  id?: string | number;
  cancelationOptions: CancelationOption;
  paymentStatus: string;
  onSuccess?: (wasRefunded: boolean) => void;
}

const RefundBookingBtn: React.FC<RefundProps> = ({
  id,
  cancelationOptions,
  paymentStatus,
  onSuccess
}) => {
  const [open, setOpen] = useState(false)
  const [confirmationText, setConfirmationText] = useState("")
  const [showError, setShowError] = useState(false)
  const { props } = usePage<any>()

  const { post, processing } = useForm();

  const requiredPhrase = "I am requesting a refund now"


  const handleRefund = (e: React.FormEvent) => {
    e.preventDefault()

    if (confirmationText !== requiredPhrase) {
      setShowError(true)
      return
    }

    setShowError(false)
    // console.log({reference: id});

    post(route("refund.bookings", { booking_id: id }), {
      onSuccess: (response: any) => {
        console.log("Refund request sent successfully", response)
        setOpen(false)
        setConfirmationText("");

        const wasRefunded = response?.props?.flash?.refund === true ||
          response?.props?.refund === true ||
          (typeof response === 'object' && 'refund' in response && response.refund === true);

        // Call the parent callback
        if (onSuccess) {
          onSuccess(wasRefunded)
        }

      },
      onError: (errors) => {
        console.error("Refund failed:", errors)
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
      <Button variant="default" className="bg-blue-600" onClick={() => setOpen(true)}>
        Request Refund
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refund Request</DialogTitle>
          <DialogDescription>
            You are about to request a refund for this booking.
            {cancelationOptions?.refund_deadline && (
              <span className="block mt-2 text-sm text-muted-foreground">
                Refunds are available until:{" "}
                <strong>{new Date(cancelationOptions.refund_deadline).toLocaleString()}</strong>
              </span>
            )}
            To confirm, please type the phrase below:
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-3" onSubmit={handleRefund}>
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
            className="bg-blue-600 text-white hover:bg-blue-700"
            disabled={confirmationText !== requiredPhrase || processing}
            onClick={handleRefund}
            type="button"
          >
            {processing ? "Processing..." : "Confirm Refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RefundBookingBtn