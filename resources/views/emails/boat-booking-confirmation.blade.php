<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boat Booking Confirmation</title>
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
            background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
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
            border-left: 4px solid #0284c7;
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
            background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .alert-box {
            background-color: #dbeafe;
            border: 1px solid #0284c7;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .icon {
            font-size: 48px;
            margin-bottom: 10px;
        }
        .highlight {
            background-color: #dbeafe;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
            border-left: 4px solid #0284c7;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="icon">⛵</div>
        <h1>Boat Booking Confirmed!</h1>
    </div>

    <div class="content">
        <p>Dear {{ $customer_name }},</p>

        <div class="alert-box">
            <strong>Success!</strong> Your boat booking has been confirmed.
        </div>

        <p>Thank you for booking with Pagsanjan Falls Resort. Your boat ride has been successfully reserved. Please review your booking details below:</p>

        <div class="booking-details">
            <h3 style="margin-top: 0; color: #0284c7;">Booking Details</h3>

            <div class="detail-row">
                <span class="detail-label">Boat Number:</span>
                <span class="detail-value" style="font-weight: bold; color: #0284c7;">Boat {{ $boat_no }}</span>
            </div>

            @if($bankero_name)
            <div class="detail-row">
                <span class="detail-label">Bankero (Boatman):</span>
                <span class="detail-value">{{ $bankero_name }}</span>
            </div>
            @endif

            <div class="detail-row">
                <span class="detail-label">Boat Capacity:</span>
                <span class="detail-value">{{ $capacity }} persons</span>
            </div>

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
                <span class="detail-value" style="font-weight: bold;">{{ $no_of_adults + $no_of_children }}</span>
            </div>
        </div>

        <div class="highlight">
            <h4 style="margin-top: 0; color: #0284c7;">💰 Payment Information</h4>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> <span style="font-size: 18px; color: #0284c7; font-weight: bold;">₱{{ number_format($total_amount, 2) }}</span></p>
            <p style="margin: 5px 0; font-size: 14px; color: #666;">
                Based on {{ $no_of_adults }} adult(s) at ₱{{ number_format($price_per_adult, 2) }} each
                @if($no_of_children > 0)
                    and {{ $no_of_children }} child(ren) at ₱{{ number_format($price_per_child, 2) }} each
                @endif
            </p>
        </div>

        <p><strong>Important Information:</strong></p>
        <ul>
            <li>Please complete the payment to confirm your reservation</li>
            <li>Your booking status is currently <strong style="color: #f59e0b;">PENDING</strong> until payment is received</li>
            <li>Arrive at the departure point 15 minutes before your scheduled time</li>
            <li>Bring valid identification and your booking confirmation</li>
            <li>Life jackets will be provided for all passengers</li>
        </ul>

        <div style="text-align: center;">
            <a href="{{ url('/my-bookings') }}" class="button">View My Bookings & Pay Now</a>
        </div>

        <p>If you need to make changes to your booking or have any questions, please contact us as soon as possible.</p>

        <p>We look forward to providing you with an unforgettable boat ride experience at Pagsanjan Falls!</p>

        <p>Best regards,<br>Pagsanjan Falls Resort Team</p>
    </div>

    <div class="footer">
        <p>This is an automated confirmation email. Please save this for your records.</p>
        <p>&copy; {{ date('Y') }} Pagsanjan Falls Resort. All rights reserved.</p>
    </div>
</body>
</html>
