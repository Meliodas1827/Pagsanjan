<x-mail::message>
# New Resort Booking

Hello Resort Admin,

A new booking has been received for **{{ $resort->resort_name }}**.

<x-mail::panel>
## Booking Details

**Customer Information:**
- Name: {{ $customer->name }}
- Email: {{ $customer->email }}
@if($customer->phone)
- Phone: {{ $customer->phone }}
@endif

**Reservation Information:**
- Booking ID: {{ $booking->id }}
- Check-in Date: {{ \Carbon\Carbon::parse($booking->date_checkin)->format('F d, Y') }}
- Check-out Date: {{ \Carbon\Carbon::parse($booking->date_checkout)->format('F d, Y') }}
- Status: {{ ucfirst($booking->status) }}
- Booking Date: {{ $booking->created_at->format('F d, Y h:i A') }}

@if($booking->payment_proof)
**Payment Proof:** Uploaded
@endif
</x-mail::panel>

<x-mail::button :url="url('/resort/bookings')">
View All Bookings
</x-mail::button>

Please log in to your admin panel to review and confirm this resort booking.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
