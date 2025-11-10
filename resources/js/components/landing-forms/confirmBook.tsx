import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function CheckoutForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "Philippines",
    street: "",
    apartment: "",
    city: "",
    province: "",
    zip: "",
    phone: "",
    email: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
    // proceed to next step
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Billing Details */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <Label htmlFor="country">Country / Region *</Label>
              <Input id="country" name="country" value={formData.country} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="street">Street address *</Label>
              <Input id="street" name="street" value={formData.street} onChange={handleChange} required />
              <Input id="apartment" name="apartment" placeholder="Apartment, suite, unit, etc. (optional)" value={formData.apartment} onChange={handleChange} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="city">Town / City *</Label>
              <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="province">Province *</Label>
              <Input id="province" name="province" value={formData.province} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="zip">Postcode / ZIP *</Label>
              <Input id="zip" name="zip" value={formData.zip} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <Button type="submit" className="mt-4 w-full">Next</Button>
          </form>
        </CardContent>
      </Card>

      {/* Price Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Price Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between border-b pb-2">
            <span>Product</span>
            <span>Subtotal</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Reservation</span>
            <span>₱27,800.00</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-bold">
            <span>Total</span>
            <span>₱27,800.00</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
