<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Boat Booking Notification</title>
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
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
            border-left: 4px solid #10b981;
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
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .alert-box {
            background-color: #d1fae5;
            border: 1px solid #10b981;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
        .highlight {
            background-color: #d1fae5;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            border-left: 4px solid #10b981;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="icon">⛵</div>
        <h1>New Boat Booking!</h1>
    </div>

    <div class="content">
        <p>Dear UBAAP Admin,</p>

        <div class="alert-box">
            <strong>New Booking Alert!</strong> A customer has booked a boat ride with their resort reservation.
        </div>

        <p>A customer has made a boat booking along with their resort reservation. Please review the details below:</p>

        <div class="booking-details">
            <h3 style="margin-top: 0; color: #10b981;">Booking Details</h3>

            <div class="detail-row">
                <span class="detail-label">Customer Name:</span>
                <span class="detail-value">{{ $customer_name }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ $customer_email }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Boat Number:</span>
                <span class="detail-value" style="font-weight: bold; color: #10b981;">Boat {{ $boat_no }}</span>
            </div>

            @if($bankero_name)
            <div class="detail-row">
                <span class="detail-label">Bankero (Boatman):</span>
                <span class="detail-value">{{ $bankero_name }}</span>
            </div>
            @endif

            <div class="detail-row">
                <span class="detail-label">Ride Date:</span>
                <span class="detail-value">{{ $ride_date }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Ride Time:</span>
                <span class="detail-value">{{ $ride_time }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Number of Adults:</span>
                <span class="detail-value">{{ $no_of_adults }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Number of Children:</span>
                <span class="detail-value">{{ $no_of_children }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Total Guests:</span>
                <span class="detail-value" style="font-weight: bold; color: #10b981;">{{ $no_of_adults + $no_of_children }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">#{{ $booking_id }}</span>
            </div>
        </div>

        <div class="highlight">
            <h4 style="margin-top: 0; color: #10b981;">💰 Payment Information</h4>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> <span style="font-size: 18px; color: #10b981; font-weight: bold;">₱{{ number_format($total_amount, 2) }}</span></p>
            <p style="margin: 5px 0; font-size: 14px; color: #666;">
                Based on {{ $no_of_adults }} adult(s) and {{ $no_of_children }} child(ren)
            </p>
        </div>

        <p><strong>Important Notes:</strong></p>
        <ul>
            <li>This boat booking was made along with a resort reservation</li>
            <li>The customer has already selected a specific boat (Boat {{ $boat_no }})</li>
            <li>Current booking status is <strong style="color: #f59e0b;">PENDING</strong></li>
            <li>You can view and manage this booking in your dashboard</li>
        </ul>

        <div style="text-align: center;">
            <a href="{{ url('/boat-bookings') }}" class="button">View Boat Bookings</a>
        </div>

        <p>Please ensure the boat is available for the scheduled date and time.</p>

        <p>Thank you,<br>Pagsanjan Falls Resort System</p>
    </div>

    <div class="footer">
        <p>This is an automated email notification from the booking system.</p>
        <p>&copy; {{ date('Y') }} Pagsanjan Falls Resort. All rights reserved.</p>
    </div>
</body>
</html>
