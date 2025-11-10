import { useForm } from "@inertiajs/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"
import { mutate } from "swr"
import { BadgeCheck, Check, RotateCcw } from "lucide-react"

interface RefundProps {
  id: number
  transaction_ref: string
  guest_name: string
  booked_place: string
  amount: number
  phone: string;
  status: string;

}

const RefundBtnDialog = ({ id, transaction_ref, guest_name, booked_place, amount, phone, status }: RefundProps) => {
  const [open, setOpen] = useState(false)
  const [confirmation, setConfirmation] = useState("");

  const { data, post, errors, processing, setData } = useForm({
    refund_id: id,
    amount: amount,
  })

    const phrase = 'I approved';


  const handleRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      console.error("Refund ID required")
      return
    }


    if (confirmation !== phrase) {
      toast.error("Confirmation does not match transaction reference")
      return
    }

    console.log(data);

    post(route("refund.completed"), {
      onSuccess: () => {
        toast.success("Refund processed successfully!")
        setOpen(false)
        setConfirmation("")
      },
      onError: () => {
        console.error(errors)
        toast.error("Error: Unable to process refund")
      },
    })
    
  }

  return (
    <>
      {status !== 'completed' ? 

       <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <Button
        size="icon"
        variant="destructive"
        // className="text-red-600 hover:text-red-800"
        onClick={() => setOpen(true)}
      >
        <RotateCcw className="h-5 w-5" />
      </Button>

      {/* Modal */}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-red-600">
            Confirm Refund
          </DialogTitle>
        </DialogHeader>

       
      
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            You are about to issue a refund. The amount will be sent back to the
            customer using their original payment method (via PayMongo).
          </p>

          {/* Transaction Details */}
          <div className="bg-gray-50 p-3 rounded-md border space-y-1">
            <p className="text-sm">
              <span className="font-medium">Transaction Ref:</span>{" "}
              <span className="text-gray-700">{transaction_ref}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Guest:</span>{" "}
              <span className="text-gray-700">{guest_name}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Booked Place:</span>{" "}
              <span className="text-gray-700">{booked_place}</span>
            </p>
            <p className="text-sm">
              <span className="font-medium">Refund Amount:</span>{" "}
              <span className="text-red-600 font-semibold">
                ₱{amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </span>
            </p>
               <p className="text-sm">
              <span className="font-medium">Phone:</span>{" "}
              <span className="text-gray-600 font-semibold">
                {phone}
              </span>
            </p>
          </div>

          {/* Admin Confirmation */}
          
          <div>
            <label className="text-sm font-medium text-gray-700">
              Type <span className="font-bold text-green-600">{phrase}</span> to confirm:
            </label>
            <Input
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="Enter transaction reference"
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
          onClick={handleRefund}
          type="button"
            disabled={processing || confirmation !== phrase}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
          >
            {processing ? "Processing..." : "Refund"}
          </Button>
        </DialogFooter>


      </DialogContent>
    </Dialog>
    : 
    <div className="flex items-center justify-center">
      <BadgeCheck className="text-white bg-green-600 rounded-full"/>
    </div>

    
    }
    </>
   
  )
}

export default RefundBtnDialog
