  import React, { useState } from "react"
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Link, usePage } from "@inertiajs/react"
  import RequestBookingDialog from "./booking-request-form"
import { Button } from "../ui/button"

  interface Resort {
    id: number
    resort_name: string
    description: string
    price_per_day: number
    image_url: string
    pax: number
    amenities: string
  }

  interface ResortPageProps {
    data: Resort[]
    [key: string]: any
  }



  export interface FormData {
    resort_room_id: number
    check_in_date: string
    check_out_date: string
    no_of_adults: number
    no_of_children: number
    price_per_day: number
    boat_ride_data: any
  }

  export default function ResortForm() {
    const { props } = usePage<ResortPageProps>();
    const resorts = props.data;

    const [selectedId, setSelectedId] = useState<number>(resorts[0]?.id || 1)

    const [formData, setFormData] = useState<FormData>({
      resort_room_id: resorts[0]?.id || 1,
      check_in_date: "",
      check_out_date: "",
      no_of_adults: 1, // Set default to 1 
      no_of_children: 0,
      price_per_day:  Number(resorts[0]?.price_per_day),
      boat_ride_data: null
    })

    // Separate state for boat ride UI only (not passed to dialog)
    const [boatRide, setBoatRide] = useState({
      time: "",
      no_of_adults: "",
      no_of_children: ""
    })

    // Create a helper function to get the current resort
    const getCurrentResort = () => {
      return resorts.find((resort) => resort.id === selectedId) || resorts[0]
    }

    const selectedItem = getCurrentResort()

    const handleResortSelect = (resortId: number) => {
      const resort = resorts.find((r) => r.id === resortId)
      if (resort) {
        setSelectedId(resortId)
        setFormData(prev => ({
          ...prev,
          resort_room_id: resort.id,
          price_per_day: Number(selectedItem.price_per_day)
        }))
      }
    }

    // Updated handleInputChange with proper type conversion
    const handleInputChange = (field: keyof FormData, value: string) => {
      let convertedValue: string | number = value

      // Convert numeric fields to numbers
      if (field === 'no_of_adults' || field === 'no_of_children' || field === 'resort_room_id') {
        convertedValue = value === '' ? 0 : parseInt(value, 10)
        // Ensure minimum values
        if (field === 'no_of_adults' && convertedValue < 1) {
          convertedValue = 1
        }
        if (field === 'no_of_children' && convertedValue < 0) {
          convertedValue = 0
        }
      }

      setFormData(prev => ({
        ...prev,
        [field]: convertedValue
      }))

      // Debug log to see what's being set
      // console.log(`Setting ${field} to:`, convertedValue, 'Type:', typeof convertedValue)
      // console.log('Updated formData will be:', { ...formData, [field]: convertedValue })
    }

    const handleBoatChange = (field: keyof typeof boatRide, value: string) => {
      setBoatRide(prev => ({
        ...prev,
        [field]: value
      }))
    }


    // Guard clause if no resorts or selectedItem
    if (!resorts || resorts.length === 0 || !selectedItem) {
      return <div>Loading...</div>
    }

    return (
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-8">
          {/* LEFT: Images */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main image */}
            <Card className="overflow-hidden">
              <img
                src={selectedItem.image_url}
                alt={selectedItem.resort_name}
                className="w-full h-64 object-cover"
              />
            </Card>

            {/* Resort Details */}
            <Card>
              <CardHeader>
                <CardTitle>{selectedItem.resort_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-2">{selectedItem.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Max Pax: {selectedItem.pax}</span>
                  <span>
                    Amenities: {Array.isArray(selectedItem.amenities)
                      ? selectedItem.amenities.join(", ")
                      : JSON.parse(selectedItem.amenities)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Resort Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {resorts.map((resort) => (
                <Card
                  key={resort.id}
                  onClick={() => handleResortSelect(resort.id)}
                  className={`overflow-hidden cursor-pointer border-2 ${selectedId === resort.id ? "border-green-600" : "border-transparent"
                    }`}
                >
                  <img
                    src={resort.image_url}
                    alt={resort.resort_name}
                    className="h-28 w-full object-cover"
                  />
                  <div className="p-2 text-center text-sm">{resort.resort_name}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* RIGHT: Booking Form */}
          <div className="col-span-2">

          <div className="sticky top-6 space-y-6 ">
            {/* Price */}
            <Card>
              <CardContent className="p-6 text-center">
              <CardTitle>Price</CardTitle>

                <div className="text-3xl font-bold text-green-800">
                  ₱{selectedItem.price_per_day.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">per day (inclusive of tax)</div>
                <div>
                  <Link href={`/availability/resort/${getCurrentResort().id}`}
                  >
                    <Button variant={'default'} className="bg-green-700 cursor-pointer mt-4">
                      Check Availability
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle>Check Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Check-in</Label>
                  <Input
                    type="date"
                    value={formData.check_in_date}
                    onChange={(e) => handleInputChange("check_in_date", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Check-out</Label>
                  <Input
                    type="date"
                    value={formData.check_out_date}
                    onChange={(e) => handleInputChange("check_out_date", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Adults</Label>
                    <Input
                      type="number"
                      min={1}
                      value={formData.no_of_adults}
                      onChange={(e) => handleInputChange("no_of_adults", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Children</Label>
                    <Input
                      className="mb-3"
                      type="number"
                      min={0}
                      value={formData.no_of_children}
                      onChange={(e) => handleInputChange("no_of_children", e.target.value)}
                    />
                  </div>
                </div>

                <RequestBookingDialog formData={formData} />
              </CardContent>
            </Card>


          </div>
          </div>

        </div>
      </div>
    )
  }