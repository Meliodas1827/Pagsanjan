<x-mail::message>
# New Landing Area Booking Request

Hello Admin,

A new booking request has been received for **{{ $landingArea->name }}**.

<x-mail::panel>
## Booking Details

**Customer Information:**
- Name: {{ $request->customer_name }}
- Email: {{ $request->customer_email ?? 'N/A' }}
- Phone: {{ $request->customer_phone }}

**Booking Information:**
- Pickup Date: {{ \Carbon\Carbon::parse($request->pickup_date)->format('F d, Y') }}
- Pickup Time: {{ $request->pickup_time }}
- Number of Adults: {{ $request->number_of_adults }}
- Number of Children: {{ $request->number_of_children }}
- Total People: {{ $request->number_of_adults + $request->number_of_children }}
- Status: {{ ucfirst($request->status) }}

@if($request->special_requirements)
**Special Requirements:**
{{ $request->special_requirements }}
@endif
</x-mail::panel>

<x-mail::button :url="url('/landing-area-requests')">
View All Requests
</x-mail::button>

Please log in to your admin panel to review and process this booking request.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
