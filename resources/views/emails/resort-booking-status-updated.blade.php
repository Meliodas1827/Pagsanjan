<x-mail::message>
# Resort Booking Status Updated

Hello {{ $booking->user->name }},

Your resort booking status has been updated.

<x-mail::panel>
## Booking Information

**Resort:** {{ $resort->resort_name }}

**Booking ID:** {{ $booking->id }}

**Check-in Date:** {{ \Carbon\Carbon::parse($booking->date_checkin)->format('F d, Y') }}

**Check-out Date:** {{ \Carbon\Carbon::parse($booking->date_checkout)->format('F d, Y') }}

**Previous Status:** {{ ucfirst($oldStatus) }}

**New Status:** {{ ucfirst($newStatus) }}

@if($newStatus === 'accepted')
✅ **Great news!** Your booking has been confirmed. We look forward to welcoming you!
@elseif($newStatus === 'declined')
❌ **Unfortunately**, your booking request has been declined. Please contact the resort for more information.
@elseif($newStatus === 'cancelled')
⚠️ Your booking has been cancelled.
@endif
</x-mail::panel>

<x-mail::button :url="url('/my-bookings')">
View My Bookings
</x-mail::button>

If you have any questions, please contact the resort directly.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
