<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking {{ ucfirst($status) }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: {{ $status === 'accepted' ? '#10b981' : '#ef4444' }};
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-radius: 0 0 8px 8px;
        }
        .booking-details {
            background-color: white;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            border-left: 4px solid {{ $status === 'accepted' ? '#10b981' : '#ef4444' }};
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: bold;
            color: #666;
        }
        .detail-value {
            color: #333;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: {{ $status === 'accepted' ? '#10b981' : '#ef4444' }};
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .alert-box {
            background-color: {{ $status === 'accepted' ? '#d1fae5' : '#fee2e2' }};
            border: 1px solid {{ $status === 'accepted' ? '#10b981' : '#ef4444' }};
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Booking {{ ucfirst($status) }}</h1>
    </div>

    <div class="content">
        <p>Dear {{ $customer_name }},</p>

        @if($status === 'accepted')
            <div class="alert-box">
                <strong>Good news!</strong> Your booking has been accepted and confirmed.
            </div>

            <p>We are pleased to inform you that your booking request has been accepted. Please find your booking details below:</p>
        @else
            <div class="alert-box">
                <strong>Unfortunately,</strong> your booking request has been declined.
            </div>

            <p>We regret to inform you that your booking request could not be accommodated at this time. This may be due to availability constraints or other operational reasons. Here are the details of your booking request:</p>
        @endif

        <div class="booking-details">
            <h3 style="margin-top: 0; color: {{ $status === 'accepted' ? '#10b981' : '#ef4444' }};">Booking Details</h3>

            <div class="detail-row">
                <span class="detail-label">Reference Number:</span>
                <span class="detail-value">{{ $reference_id }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Hotel:</span>
                <span class="detail-value">{{ $hotel_name }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Room:</span>
                <span class="detail-value">{{ $room_name }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Check-in Date:</span>
                <span class="detail-value">{{ $check_in }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Check-out Date:</span>
                <span class="detail-value">{{ $check_out }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Number of Nights:</span>
                <span class="detail-value">{{ $nights }} {{ $nights === 1 ? 'night' : 'nights' }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Guests:</span>
                <span class="detail-value">{{ $adults }} Adults, {{ $children }} Children</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Total Amount (50% deposit):</span>
                <span class="detail-value" style="font-weight: bold; color: {{ $status === 'accepted' ? '#10b981' : '#ef4444' }};">₱{{ $total_amount }}</span>
            </div>
        </div>

        @if($status === 'accepted')
            <p><strong>Next Steps:</strong></p>
            <ul>
                <li>Please complete the payment of ₱{{ $total_amount }} (50% deposit) to confirm your reservation</li>
                <li>Log in to your account to view your booking and make payment</li>
                <li>The remaining balance will be paid upon check-in</li>
                <li>Keep your reference number for future correspondence</li>
            </ul>

            <div style="text-align: center;">
                <a href="{{ url('/my-bookings') }}" class="button">View My Bookings</a>
            </div>
        @else
            <p>We apologize for any inconvenience this may cause. Please feel free to:</p>
            <ul>
                <li>Try booking for different dates</li>
                <li>Contact us directly for alternative options</li>
                <li>Browse other available accommodations</li>
            </ul>

            <div style="text-align: center;">
                <a href="{{ url('/welcome') }}" class="button">Browse Available Rooms</a>
            </div>
        @endif

        <p>If you have any questions or concerns, please don't hesitate to contact us.</p>

        <p>Thank you for choosing Pagsanjan Falls Resort!</p>
    </div>

    <div class="footer">
        <p>This is an automated email. Please do not reply directly to this message.</p>
        <p>&copy; {{ date('Y') }} Pagsanjan Falls Resort. All rights reserved.</p>
    </div>
</body>
</html>
