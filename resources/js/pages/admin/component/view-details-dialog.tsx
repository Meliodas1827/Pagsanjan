import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CalendarDays, User, Users, PhilippinePeso, Hotel, DoorOpen, Clock } from "lucide-react"

interface BookingDetails {
  id: number
  reference_id: string
  hotel_name: string
  room_name: string
  guest_name: string
  guest_email: string
  check_in_date: string
  check_out_date: string
  no_of_adults: number
  no_of_children: number
  total_price: string
  booking_status: string
}

const ViewDetailsDialog = ({ booking }: { booking: BookingDetails }) => {
  const [open, setOpen] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateNights = () => {
    const checkIn = new Date(booking.check_in_date)
    const checkOut = new Date(booking.check_out_date)
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'accepted': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'declined': return 'text-red-600 bg-red-50'
      case 'cancelled': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <span
        onClick={() => setOpen(true)}
        className="w-full cursor-pointer"
      >
        View Details
      </span>

      {/* Dialog Content */}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Booking Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Reference & Status */}
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="text-sm text-gray-500">Reference Number</p>
              <p className="text-lg font-semibold">{booking.reference_id}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusColor(booking.booking_status)}`}>
              {booking.booking_status}
            </div>
          </div>

          {/* Hotel & Room Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Hotel className="h-4 w-4" />
                Hotel
              </div>
              <p className="font-medium">{booking.hotel_name}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <DoorOpen className="h-4 w-4" />
                Room
              </div>
              <p className="font-medium">{booking.room_name}</p>
            </div>
          </div>

          {/* Guest Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <User className="h-4 w-4" />
              Guest Information
            </div>
            <div className="space-y-1 ml-6">
              <p className="text-sm"><span className="text-gray-500">Name:</span> <span className="font-medium">{booking.guest_name}</span></p>
              <p className="text-sm"><span className="text-gray-500">Email:</span> <span className="font-medium">{booking.guest_email}</span></p>
            </div>
          </div>

          {/* Check-in/out Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarDays className="h-4 w-4" />
                Check-in
              </div>
              <p className="font-medium text-sm">{formatDate(booking.check_in_date)}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarDays className="h-4 w-4" />
                Check-out
              </div>
              <p className="font-medium text-sm">{formatDate(booking.check_out_date)}</p>
            </div>
          </div>

          {/* Nights & Guests */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                Number of Nights
              </div>
              <p className="font-medium">{calculateNights()} {calculateNights() === 1 ? 'night' : 'nights'}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="h-4 w-4" />
                Guests
              </div>
              <p className="font-medium">{booking.no_of_adults} Adults, {booking.no_of_children} Children</p>
            </div>
          </div>

          {/* Total Price */}
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhilippinePeso className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold text-gray-700">Total Amount</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                ₱{parseFloat(booking.total_price).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2">* 50% deposit required to confirm booking</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={() => setOpen(false)}
            variant="outline"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewDetailsDialog
