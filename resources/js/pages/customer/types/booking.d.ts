export interface BookingData {
    id: number;
    reference_id: string;
    booking_status: string;
    check_in_date: string;
    check_out_date: string;
    total_price: number;
    created_at: string;
    no_of_adults: number;
    no_of_children: number;
}
