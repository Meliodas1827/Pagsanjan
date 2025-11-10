import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CircleAlert, MoveRight, ArrowLeft, ArrowRight } from "lucide-react"
import { FormData } from "./resort-form"
import { useForm, usePage } from "@inertiajs/react"
import { SuccessDialog } from "../toast/success-card-dialog"
import { useState, useEffect } from "react"
import BoatRideForm from "./boat-ride-form"
import { boatRideProp } from "./boat-ride-form"

interface Props {
  formData: FormData
}

interface Guest {
  id: number
  first_name: string
  last_name: string
  address: string
  phone: string
  email: string
}

export interface BoatPricing {
    price_per_adult: number;
    price_per_child: number ;
}

interface GuestPageProps {
  guest_data: Guest
  auth: {
    user: {
      email: string
    }
  }
  [key: string]: any
  boat_pricing: BoatPricing
}

export default function RequestBookingDialog({ formData }: Props) {
  const { props } = usePage<GuestPageProps>()
  const guest = props.guest_data;
  const boat_pricing = props.boat_pricing;

  useEffect(() => {
    setData(formData);
  }, [formData]);

  const { data, setData, post, errors, reset } = useForm({
    check_in_date: formData.check_in_date || "",
    check_out_date: formData.check_out_date || "",
    resort_room_id: formData.resort_room_id || null,
    no_of_adults: formData.no_of_adults || 0,
    no_of_children: formData.no_of_children || 0,
    price_per_day: formData.price_per_day || 0,
    boat_ride_data: null as any
  })

  const [acceptTerms, setAcceptTerms] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)

  // Step management
  const [currentStep, setCurrentStep] = useState(1)
  const [boatRideData, setBoatRideData] = useState<boatRideProp | null>(null);

  const handleBoatRideDataChange = (data: any) => {
    setBoatRideData(data);
    setData('boat_ride_data', data);

  }

  const handleNextStep = () => {
    setCurrentStep(2);
  }

  const handleSkipBoatRide = () => {
    setBoatRideData(null);
    setData('boat_ride_data', null);
    setCurrentStep(2);
  }

  const handleBackStep = () => {
    setCurrentStep(1);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log(data);
    post(route("resort.request.book"), {
      preserveScroll: true,
      onSuccess: () => {
        setDialogOpen(true)
        setBookingDialogOpen(false)
        setCurrentStep(1) // Reset to first step
        setBoatRideData(null)
        setAcceptTerms(false)
        reset()
      },
      onError: () => console.log(errors)
    })


  }

  const handleDialogClose = (open: boolean) => {
    setBookingDialogOpen(open);
    if (!open) {
      // Reset dialog state when closed
      setCurrentStep(1);
      setBoatRideData(null);
      setAcceptTerms(false);
    }
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


      <Dialog open={bookingDialogOpen} onOpenChange={handleDialogClose}>
        <DialogTrigger asChild>
          <Button variant="default" className="w-full">
            Request Booking <MoveRight className="ml-2" />
          </Button>
        </DialogTrigger>


        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {currentStep === 1 ? "Optional Boat Ride" : "Booking Request"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of 2
            </p>
          </DialogHeader>

          {currentStep === 1 && (
            <>
              {/* Step 1: Boat Ride Form */}
              <div className="space-y-4">
                <Alert>
                  <CircleAlert className="h-4 w-4" />
                  <AlertDescription className="text-black">
                    You can add a boat ride to your booking or skip this step. You can always book boat rides later after your resort booking is confirmed.
                  </AlertDescription>
                </Alert>

                <BoatRideForm onDataChange={handleBoatRideDataChange} boat_pricing={boat_pricing}/>

                {/* Step 1 Footer */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleSkipBoatRide}
                  >
                    Skip Boat Ride
                  </Button>
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={handleNextStep}
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              {/* Step 2: Booking Request Details */}
              <div className="space-y-4">
                {/* Info Alert */}
                <Button
                  variant="outline"
                  onClick={handleBackStep}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Alert>
                  <CircleAlert className="h-4 w-4" />
                  <AlertDescription className="text-blue-800">
                    You can update your information in the Account Module. Please check and verify your information.
                  </AlertDescription>
                </Alert>

                {/* Boat Ride Summary (if added) */}
                {boatRideData && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4">
                      <CardTitle className="text-green-800 text-sm mb-2">
                        ✓ Boat Ride Added
                      </CardTitle>
                      <div className="text-sm text-green-700 space-y-1">
                        <p><strong>Date:</strong> {boatRideData.date_of_booking}</p>
                        {/* <p><strong>Time:</strong> {boatRideData.time}</p> */}
                        <p><strong>Adults:</strong> {boatRideData.no_of_adults}</p>
                        <p><strong>Children:</strong> {boatRideData.no_of_children}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Guest Info Card */}
                <Card>
                  <CardContent className="pt-4">
                    <CardTitle className="mb-4">Recipient Information</CardTitle>
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {guest.first_name} {guest.last_name}</p>
                      <p><strong>Address:</strong> {guest.address}</p>
                      <p><strong>Phone:</strong> {guest.phone}</p>
                      <p><strong>Email:</strong> {props.auth.user.email}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Terms Checkbox */}
                <div className="flex items-center">
                  <Checkbox
                    id="accept_terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(!!checked)}
                  />
                  <Label htmlFor="accept_terms" className="ml-2">
                    I agree to the terms and policy
                  </Label>
                </div>

                {/* Step 2 Footer */}
                <div className="flex gap-2 pt-4">

                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={handleSubmit}
                    disabled={!acceptTerms}
                  >
                    Submit Request
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </>
  )
}