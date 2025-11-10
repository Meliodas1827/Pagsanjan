<x-mail::message>
# Booking Status Updated

Hello {{ $request->customer_name }},

Your boat ride booking to **{{ $landingArea->name }}** has been updated.

<x-mail::panel>
## Status Change

Your booking status has been changed from **{{ ucfirst($oldStatus) }}** to **{{ ucfirst($newStatus) }}**.

@if($newStatus === 'confirmed')
Great news! Your booking has been confirmed. We look forward to seeing you!
@elseif($newStatus === 'assigned')
Your boat has been assigned. You're all set for your trip!
@elseif($newStatus === 'completed')
Thank you for choosing us! We hope you enjoyed your boat ride.
@elseif($newStatus === 'cancelled')
Your booking has been cancelled. If you have any questions, please contact us.
@endif
</x-mail::panel>

<x-mail::panel>
## Booking Details

**Pickup Information:**
- Date: {{ \Carbon\Carbon::parse($request->pickup_date)->format('F d, Y') }}
- Time: {{ $request->pickup_time }}
- Location: {{ $landingArea->name }}

**Guest Information:**
- Adults: {{ $request->number_of_adults }}
- Children: {{ $request->number_of_children }}
- Total Guests: {{ $request->number_of_adults + $request->number_of_children }}

@if($request->boat)
**Assigned Boat:** {{ $request->boat->boat_no }}
@endif

@if($request->admin_notes)
**Admin Notes:**
{{ $request->admin_notes }}
@endif
</x-mail::panel>

<x-mail::button :url="url('/my-landing-area-bookings')">
View My Bookings
</x-mail::button>

If you have any questions about your booking, please don't hesitate to contact us.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
