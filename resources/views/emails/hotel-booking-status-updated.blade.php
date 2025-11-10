<x-mail::message>
# Hotel Booking Status Updated

Hello {{ $booking->user?->name ?? 'Guest' }},

Your hotel room booking at **{{ $hotel?->hotel_name ?? 'our hotel' }}** has been updated.

<x-mail::panel>
## Status Change

Your booking status has been changed from **{{ ucfirst($oldStatus) }}** to **{{ ucfirst($newStatus) }}**.

@if($newStatus === 'accepted')
Great news! Your booking has been confirmed. We look forward to welcoming you!
@elseif($newStatus === 'done')
Thank you for staying with us! We hope you enjoyed your visit.
@elseif($newStatus === 'declined')
Unfortunately, your booking could not be confirmed. Please contact us for more information.
@elseif($newStatus === 'cancelled')
Your booking has been cancelled. If you have any questions, please contact us.
@endif
</x-mail::panel>

<x-mail::panel>
## Booking Details

**Reference ID:** {{ $booking->reference_id }}

**Hotel Information:**
- Hotel: {{ $hotel?->hotel_name ?? 'N/A' }}
- Room: {{ $room?->room_name ?? 'N/A' }}
- Room Type: {{ $room?->room_type ?? 'N/A' }}

**Check-in/Check-out:**
- Check-in: {{ \Carbon\Carbon::parse($booking->check_in_date)->format('F d, Y') }}
- Check-out: {{ \Carbon\Carbon::parse($booking->check_out_date)->format('F d, Y') }}

**Guest Information:**
- Adults: {{ $booking->no_of_adults }}
- Children: {{ $booking->no_of_children }}
- Total Guests: {{ $booking->no_of_adults + $booking->no_of_children }}

**Total Price:** ₱{{ number_format($booking->total_price, 2) }}

@if($booking->notes)
**Notes:**
{{ $booking->notes }}
@endif
</x-mail::panel>

<x-mail::button :url="url('/my-bookings')">
View My Bookings
</x-mail::button>

If you have any questions about your booking, please don't hesitate to contact us.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
