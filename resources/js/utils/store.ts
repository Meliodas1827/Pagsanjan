import { JSX, SVGProps } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

// Payment Method Interfaces
interface PaymentMethodConfig {
  id: string
  name: string
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  description: string
  color: string
}

interface CardPaymentData {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

interface EWalletPaymentData {
  mobileNumber: string
}

interface OnlineBankingPaymentData {
  email: string
}

type PaymentData = CardPaymentData | EWalletPaymentData | OnlineBankingPaymentData

interface PaymentMethod {
  method: PaymentMethodConfig
  data: PaymentData
}

interface PaymentState {
  paymentMethod: PaymentMethod | null
  setPaymentMethod: (paymentMethod: PaymentMethod) => void
  clearPaymentMethod: () => void
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      paymentMethod: null,
      setPaymentMethod: (paymentMethod) =>
        set(() => ({
          paymentMethod,
        })),
      clearPaymentMethod: () =>
        set(() => ({
          paymentMethod: null,
        })),
    }),
    { name: "payment-storage" }
  )
)

// Export types for use in components
export type {
  PaymentMethodConfig,
  CardPaymentData,
  EWalletPaymentData,
  OnlineBankingPaymentData,
  PaymentData,
  PaymentMethod,
  PaymentState
}