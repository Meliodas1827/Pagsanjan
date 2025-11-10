import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BoatPricing } from "./booking-request-form";

interface BoatRideFormProps {
  onDataChange: (data: any) => void;
  boat_pricing: BoatPricing
}

export interface boatRideProp {
  date_of_booking: string | null,
  time: string | null,
  no_of_adults: number | null,
  no_of_children: number | null
}

const BoatRideForm = ({ onDataChange, boat_pricing }: BoatRideFormProps) => {
  const [formData, setFormData] = useState({
    date_of_booking: "",
    time: "",
    no_of_adults: 0,
    no_of_children: 0
  });


const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, type } = e.target;
  
  const newData = {
    ...formData,
    [name]: type === 'number' ? Number(value) || 0 : value
  };
  
  setFormData(newData);
  onDataChange(newData);
};

  return (
    <Card>
      <CardContent className="pt-6">
        <CardTitle className="mb-4 flex items-center justify-between">
          <h1>
            Avail Boat Ride
          </h1>
          <h1 className="flex gap-2"> 
            <span>
              Adult: &#8369;{boat_pricing.price_per_adult}

            </span>
            <span>
              Child: &#8369;{boat_pricing.price_per_child}

            </span>

          </h1>
        </CardTitle>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              name="date_of_booking"
              value={formData.date_of_booking}
              onChange={handleChange}
              placeholder="Select date"
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="Select time"
            />
          </div>
          <div>
            <Label htmlFor="no_of_adults">Number of Adults</Label>
            <Input
              id="no_of_adults"
              type='number'
              name="no_of_adults"
              value={(formData.no_of_adults)}
              onChange={handleChange}
              placeholder="Number of adults"
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="children">Number of Children</Label>
            <Input
              id="children"
              type='number'
              name="no_of_children"
              value={(formData.no_of_children)}
              onChange={handleChange}
              placeholder="Number of Children"
              min="0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BoatRideForm;