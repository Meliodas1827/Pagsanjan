import { CreditCard, Smartphone, Building2, Wallet } from "lucide-react"
import { PaymentMethodConfig } from "@/utils/store"

export const paymentMethods: PaymentMethodConfig[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, JCB',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
  },
  {
    id: 'gcash',
    name: 'GCash',
    icon: Smartphone,
    description: 'Pay with GCash wallet',
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
  },
  {
    id: 'paymaya',
    name: 'PayMaya',
    icon: Wallet,
    description: 'Pay with PayMaya wallet',
    color: 'bg-green-50 border-green-200 hover:bg-green-100'
  },
  {
    id: 'grabpay',
    name: 'GrabPay',
    icon: Smartphone,
    description: 'Pay with GrabPay wallet',
    color: 'bg-green-50 border-green-200 hover:bg-green-100'
  },
  {
    id: 'billease',
    name: 'Billease',
    icon: Building2,
    description: 'Buy now, pay later',
    color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
  },
  {
    id: 'dob',
    name: 'DragonPay Online Banking',
    icon: Building2,
    description: 'Online banking payment',
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
  }
]