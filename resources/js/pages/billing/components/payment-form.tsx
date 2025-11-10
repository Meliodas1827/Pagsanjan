import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  CardPaymentData, 
  EWalletPaymentData, 
  OnlineBankingPaymentData,
  PaymentMethodConfig 
} from "@/utils/store"

interface BaseFormProps<T> {
  data: Partial<T>
  onChange: (field: keyof T, value: string) => void
  errors: Record<string, string>
}

interface CardFormProps extends BaseFormProps<CardPaymentData> {}

export const CardForm: React.FC<CardFormProps> = ({ data, onChange, errors }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="cardNumber">Card Number *</Label>
      <Input
        id="cardNumber"
        placeholder="1234 5678 9012 3456"
        value={data.cardNumber || ''}
        onChange={(e) => onChange('cardNumber', e.target.value)}
        className={errors?.cardNumber ? 'border-red-500' : ''}
      />
      {errors?.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="expiryDate">Expiry Date *</Label>
        <Input
          id="expiryDate"
          placeholder="MM/YY"
          value={data.expiryDate || ''}
          onChange={(e) => onChange('expiryDate', e.target.value)}
          className={errors?.expiryDate ? 'border-red-500' : ''}
        />
        {errors?.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="cvv">CVV *</Label>
        <Input
          id="cvv"
          placeholder="123"
          value={data.cvv || ''}
          onChange={(e) => onChange('cvv', e.target.value)}
          className={errors?.cvv ? 'border-red-500' : ''}
        />
        {errors?.cvv && <p className="text-sm text-red-500">{errors.cvv}</p>}
      </div>
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="cardholderName">Cardholder Name *</Label>
      <Input
        id="cardholderName"
        placeholder="John Doe"
        value={data.cardholderName || ''}
        onChange={(e) => onChange('cardholderName', e.target.value)}
        className={errors?.cardholderName ? 'border-red-500' : ''}
      />
      {errors?.cardholderName && <p className="text-sm text-red-500">{errors.cardholderName}</p>}
    </div>
  </div>
)

interface EWalletFormProps extends BaseFormProps<EWalletPaymentData> {
  method: PaymentMethodConfig
}

export const EWalletForm: React.FC<EWalletFormProps> = ({ method, data, onChange, errors }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="mobileNumber">Mobile Number *</Label>
      <Input
        id="mobileNumber"
        placeholder="+63 912 345 6789"
        value={data.mobileNumber || ''}
        onChange={(e) => onChange('mobileNumber', e.target.value)}
        className={errors?.mobileNumber ? 'border-red-500' : ''}
      />
      {errors?.mobileNumber && <p className="text-sm text-red-500">{errors.mobileNumber}</p>}
    </div>
    
    <div className="p-4 bg-blue-50 rounded-lg">
      <p className="text-sm text-blue-800">
        You will be redirected to {method.name} to complete your payment.
      </p>
    </div>
  </div>
)

interface OnlineBankingFormProps extends BaseFormProps<OnlineBankingPaymentData> {}

export const OnlineBankingForm: React.FC<OnlineBankingFormProps> = ({ data, onChange, errors }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="email">Email Address *</Label>
      <Input
        id="email"
        type="email"
        placeholder="your@email.com"
        value={data.email || ''}
        onChange={(e) => onChange('email', e.target.value)}
        className={errors?.email ? 'border-red-500' : ''}
      />
      {errors?.email && <p className="text-sm text-red-500">{errors.email}</p>}
    </div>
    
    <div className="p-4 bg-orange-50 rounded-lg">
      <p className="text-sm text-orange-800">
        You will be redirected to your selected bank's online banking portal to complete the payment.
      </p>
    </div>
  </div>
)

interface BillEaseFormProps extends BaseFormProps<EWalletPaymentData> {}

export const BillEaseForm: React.FC<BillEaseFormProps> = ({ data, onChange, errors }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="mobileNumber">Mobile Number *</Label>
      <Input
        id="mobileNumber"
        placeholder="+63 912 345 6789"
        value={data.mobileNumber || ''}
        onChange={(e) => onChange('mobileNumber', e.target.value)}
        className={errors?.mobileNumber ? 'border-red-500' : ''}
      />
      {errors?.mobileNumber && <p className="text-sm text-red-500">{errors.mobileNumber}</p>}
    </div>
    
    <div className="p-4 bg-purple-50 rounded-lg">
      <p className="text-sm text-purple-800">
        Complete your purchase now and pay in flexible installments with Billease.
      </p>
    </div>
  </div>
)