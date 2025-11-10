import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, ArrowLeft } from "lucide-react"
import { usePaymentStore, PaymentMethodConfig, PaymentData } from "@/utils/store"
import { paymentMethods } from "@/config/payment-method"
import { CardForm, EWalletForm, OnlineBankingForm, BillEaseForm } from "./payment-form"
import { CardPaymentData, EWalletPaymentData, OnlineBankingPaymentData } from "@/utils/store"

interface PaymentMethodDialogProps {
    children: React.ReactNode
}

export const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({ children }) => {
    const { setPaymentMethod } = usePaymentStore()
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodConfig | null>(null)
    const [paymentData, setPaymentData] = useState<Partial<PaymentData>>({})
    const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({})

    const handlePaymentDataChange = (field: string, value: string) => {
        setPaymentData(prev => ({
            ...prev,
            [field]: value
        }))
        // Clear error when user starts typing
        if (paymentErrors[field]) {
            setPaymentErrors(prev => ({
                ...prev,
                [field]: ''
            }))
        }
    }

    const validatePaymentData = (method: PaymentMethodConfig, data: Partial<PaymentData>): Record<string, string> => {
        const errors: Record<string, string> = {}

        if (method.id === 'card') {
            const cardData = data as Partial<CardPaymentData>
            if (!cardData.cardNumber) errors.cardNumber = 'Card number is required'
            if (!cardData.expiryDate) errors.expiryDate = 'Expiry date is required'
            if (!cardData.cvv) errors.cvv = 'CVV is required'
            if (!cardData.cardholderName) errors.cardholderName = 'Cardholder name is required'
        } else if (['gcash', 'paymaya', 'grabpay', 'billease'].includes(method.id)) {
            const walletData = data as Partial<EWalletPaymentData>
            if (!walletData.mobileNumber) errors.mobileNumber = 'Mobile number is required'
        } else if (method.id === 'dob') {
            const bankingData = data as Partial<OnlineBankingPaymentData>
            if (!bankingData.email) errors.email = 'Email address is required'
        }

        return errors
    }

    const handlePaymentMethodSelect = (method: PaymentMethodConfig) => {
        setSelectedPaymentMethod(method)
        setPaymentData({})
        setPaymentErrors({})
    }

    const handleSavePaymentMethod = () => {
        if (!selectedPaymentMethod) return

        const errors = validatePaymentData(selectedPaymentMethod, paymentData)

        if (Object.keys(errors).length > 0) {
            setPaymentErrors(errors)
            return
        }

        // Save payment method to store
        setPaymentMethod({
            method: selectedPaymentMethod,
            data: paymentData as PaymentData
        })

        // Reset and close dialog
        setDialogOpen(false)
        setSelectedPaymentMethod(null)
        setPaymentData({})
        setPaymentErrors({})
    }

    const renderPaymentForm = () => {
        if (!selectedPaymentMethod) return null

        const commonProps = {
            data: paymentData,
            onChange: handlePaymentDataChange,
            errors: paymentErrors
        }

        switch (selectedPaymentMethod.id) {
            case 'card':
                return <CardForm {...commonProps} data={paymentData as Partial<CardPaymentData>} />
            case 'gcash':
            case 'paymaya':
            case 'grabpay':
                return <EWalletForm
                    method={selectedPaymentMethod}
                    {...commonProps}
                    data={paymentData as Partial<EWalletPaymentData>}
                />
            case 'billease':
                return <BillEaseForm {...commonProps} data={paymentData as Partial<EWalletPaymentData>} />
            case 'dob':
                return <OnlineBankingForm {...commonProps} data={paymentData as Partial<OnlineBankingPaymentData>} />
            default:
                return null
        }

    }

    const resetDialog = () => {
        setSelectedPaymentMethod(null)
        setPaymentData({})
        setPaymentErrors({})
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetDialog()
        }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {selectedPaymentMethod && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedPaymentMethod(null)}
                                className="p-1"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        {selectedPaymentMethod ? selectedPaymentMethod.name : 'Select Payment Method'}
                    </DialogTitle>
                </DialogHeader>

                {!selectedPaymentMethod ? (
                    <div className="grid grid-cols-2 gap-4 py-4">
                        {paymentMethods.map((method) => {
                            const IconComponent = method.icon
                            return (
                                <div
                                    key={method.id}
                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${method.color}`}
                                    onClick={() => handlePaymentMethodSelect(method)}
                                >
                                    <div className="flex flex-col items-center text-center space-y-2">
                                        <IconComponent className="h-8 w-8" />
                                        <div>
                                            <h4 className="font-medium text-sm">{method.name}</h4>
                                            <p className="text-xs text-gray-600">{method.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="py-4 space-y-4">
                        {renderPaymentForm()}
                        <div className="flex gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setSelectedPaymentMethod(null)}
                                className="flex-1"
                            >
                                Back
                            </Button>
                            <Button
                                onClick={handleSavePaymentMethod}
                                className="flex-1"
                            >
                                Save Payment Method
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default PaymentMethodDialog