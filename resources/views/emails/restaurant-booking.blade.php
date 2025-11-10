<x-mail::message>
# New Restaurant Booking

Hello Admin,

A new table reservation has been received for **{{ $restaurant->resto_name }}**.

<x-mail::panel>
## Booking Details

**Customer Information:**
- Name: {{ $customer->name }}
- Email: {{ $customer->email }}
@if($customer->phone)
- Phone: {{ $customer->phone }}
@endif

**Reservation Information:**
- Table Number: {{ $table->id }}
- Table Capacity: {{ $table->no_of_chairs }} seats
- Number of Guests: {{ $booking->no_of_guest }}
- Table Price: ₱{{ number_format($table->price, 2) }}
- Booking Date: {{ $booking->created_at->format('F d, Y h:i A') }}
- Status: {{ $booking->is_book_confirmed ? 'Confirmed' : 'Pending Confirmation' }}
</x-mail::panel>

<x-mail::button :url="url('/restaurant-portal')">
View All Bookings
</x-mail::button>

Please log in to your admin panel to review and confirm this table reservation.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
