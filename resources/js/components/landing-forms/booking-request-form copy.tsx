import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MoveRight } from "lucide-react"
import { FormData } from "./resort-form"
import { useForm } from "@inertiajs/react"
import { SuccessDialog } from "../toast/success-card-dialog"
import { useState, useEffect } from "react"

interface Props {
  formData: FormData
}

export default function RequestBookingDialog({ formData }: Props) {
  // customer data will be retrieve via props
  const { data, setData, post, processing, errors, reset } = useForm({
    firstName: "",
    lastName: "",
    country: "",
    state: "",
    street: "",
    city: "",
    zip: "",
    phone: "",
    check_in_date: formData?.check_in_date || "",
    check_out_date: formData?.check_out_date || "",
    resort_room_id: formData?.resort_room_id || null,
    no_of_adults: formData?.no_of_adults || 0,
    no_of_children: formData?.no_of_children || 0,
    price_per_day: formData?.price_per_day || 0
  })

  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  // Sync form data when formData prop changes
  useEffect(() => {
    setData(prevData => ({
      ...prevData,
      check_in_date: formData?.check_in_date || "",
      check_out_date: formData?.check_out_date || "",
      resort_room_id: formData?.resort_room_id || null,
      no_of_adults: formData?.no_of_adults || 0,
      no_of_children: formData?.no_of_children || 0,
      price_per_day: formData?.price_per_day || 0
    }))
  }, [formData, setData])

  // Check if FormData has incomplete fields (no_of_children is optional)
  const isFormDataIncomplete = () => {
    return (
      !formData?.resort_room_id ||
      !formData?.check_in_date ||
      !formData?.check_out_date ||
      !formData?.no_of_adults ||
      formData.no_of_adults <= 0
    )
  }

  // Check if booking form has incomplete fields
  const isBookingFormIncomplete = () => {
    return (
      !data.firstName.trim() ||
      !data.lastName.trim() ||
      !data.country.trim() ||
      !data.state.trim() ||
      !data.street.trim() ||
      !data.city.trim() ||
      !data.zip.trim() ||
      !data.phone.trim()
    )
  }

  const disabled = isFormDataIncomplete() || isBookingFormIncomplete() || processing

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData(e.target.id as keyof typeof data, e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting data:", data);

    post(route("resort.request.book"), {
      preserveScroll: true,
      onSuccess: () => { 
        setDialogOpen(true)
        setBookingDialogOpen(false)
        reset()
      },
      onError: () => console.log("Submission errors:", errors)
    })
  }

  return (
    <>
      <SuccessDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        title={'Request Submitted Successfully!'} 
        description={'Wait for the verification and we will contact you soon.'} 
        link={true}
        linkString="my-bookings"
        buttonTitle="Go to bookings"
      />

      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="w-full">
            Request Booking <MoveRight className="ml-2" />
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Booking Request</DialogTitle>
          </DialogHeader>

          {isFormDataIncomplete() && (
            <Alert variant="destructive">
              <AlertDescription>
                Incomplete field in booking accommodation. Please go back to proceed to the request.
              </AlertDescription>
            </Alert>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={data.firstName}
                  onChange={handleChange}
                  required
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={data.lastName}
                  onChange={handleChange}
                  required
                />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country / Region</Label>
                <Input
                  id="country"
                  type="text"
                  placeholder="Enter your country"
                  value={data.country}
                  onChange={handleChange}
                  required
                />
                {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
              </div>

              <div>
                <Label htmlFor="state">State / Province</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="Enter your state / province"
                  value={data.state}
                  onChange={handleChange}
                  required
                />
                {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  type="text"
                  placeholder="Street address"
                  value={data.street}
                  onChange={handleChange}
                  required
                />
                {errors.street && <p className="text-sm text-red-500">{errors.street}</p>}
              </div>

              <div>
                <Label htmlFor="city">Town / City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Enter your city"
                  value={data.city}
                  onChange={handleChange}
                  required
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zip">Postcode / ZIP</Label>
                <Input
                  id="zip"
                  type="text"
                  placeholder="Enter your ZIP code"
                  value={data.zip}
                  onChange={handleChange}
                  required
                />
                {errors.zip && <p className="text-sm text-red-500">{errors.zip}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={data.phone}
                  onChange={handleChange}
                  required
                />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={disabled}>
              {processing ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}