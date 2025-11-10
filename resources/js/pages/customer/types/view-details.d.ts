export interface BookingProps {
    boat_ride_status: {
        status: string;
    }
    entity_details: {
        reservation_type: string;
        resort_name: string;
        image_url: string;
        contact: string;
        email: string
        amenities: string
        booking_status: string;


    }
    booking_information: {
        id: number;
        created_at: string;
        updated_at: string;
        reference_id: string;
        service_date: string;
        check_in_date: string;
        check_out_date: string;
        no_of_nights: number;
        total_price: number;
        payment_status: string;
        payment_type: string;

    },

    boat_ride_data: {
        status: string;
        boat_no: number | null;
        ride_time: string;
        no_of_adults: number;
        no_of_children: number;
        price_per_adult: number;
        price_per_child: number;
        total_amount: number;
    },

    cancellation_options: {
        can_cancel: boolean;
        can_refund: boolean;
        refund_deadline: string;
    },
    [key: string]: any;
}


export const BoatRideStatusBadge = [
    { status: 'pending', color: 'yellow' },
    { status: 'cancelled', color: 'red' },
    { status: 'onride', color: 'completed' },
    { status: 'pending', color: 'declined' },
]