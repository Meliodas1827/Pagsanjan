import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

const BillingWarning = () => {
  return (
     <Alert className="mb-6 border-orange-200 bg-orange-50">
                        <AlertDescription className="text-orange-800">
                            <div className="flex items-center justify-between gap-20">
                                <div>
                                    <p className="font-medium mb-1 flex items-center gap-2">
                                        <AlertTriangle size={16} />

                                        Billing Phase Warning</p>
                                    <p className="text-sm">Your booking request needs to be verified and accepted first before you proceed to the billing phase.</p>
                                </div>
                               
                            </div>
                        </AlertDescription>
                    </Alert>
  )
}

export default BillingWarning