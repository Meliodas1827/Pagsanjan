<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Notification</title>
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
            background-color: #18371e;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #f9f9f9;
            padding: 30px;
            border: 1px solid #ddd;
            border-top: none;
        }
        .booking-details {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            border-left: 4px solid #18371e;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: bold;
            color: #18371e;
        }
        .value {
            color: #555;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #777;
            font-size: 12px;
        }
        .highlight {
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0;">New Booking Received</h1>
        <p style="margin: 5px 0;">{{ $hotel_name }}</p>
    </div>

    <div class="content">
        <p>Hello,</p>
        <p>You have received a new booking for your hotel. Please find the details below:</p>

        <div class="booking-details">
            <h3 style="margin-top: 0; color: #18371e;">Customer Information</h3>
            <div class="detail-row">
                <span class="label">Customer Name:</span>
                <span class="value">{{ $customer_name }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">{{ $customer_email }}</span>
            </div>
        </div>

        <div class="booking-details">
            <h3 style="margin-top: 0; color: #18371e;">Booking Details</h3>
            <div class="detail-row">
                <span class="label">Reference ID:</span>
                <span class="value" style="font-weight: bold; color: #18371e;">{{ $reference_id }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Room:</span>
                <span class="value">{{ $room_name }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Check-in:</span>
                <span class="value">{{ $check_in }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Check-out:</span>
                <span class="value">{{ $check_out }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Number of Nights:</span>
                <span class="value">{{ $nights }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Adults:</span>
                <span class="value">{{ $adults }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Children:</span>
                <span class="value">{{ $children }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Boat Rental Included:</span>
                <span class="value">{{ $has_boat }}</span>
            </div>
            <div class="detail-row" style="border-top: 2px solid #18371e; margin-top: 10px; padding-top: 15px;">
                <span class="label" style="font-size: 16px;">Total Amount:</span>
                <span class="value" style="font-size: 18px; font-weight: bold; color: #18371e;">₱{{ $total_amount }}</span>
            </div>
        </div>

        <div class="highlight">
            <strong>Note:</strong> The customer has paid 50% of the total amount as a down payment. The remaining balance will be collected upon check-in.
        </div>

        <p style="margin-top: 20px;">
            <strong>Booking Date:</strong> {{ $booking_date }}
        </p>

        <p style="margin-top: 30px;">
            Please log in to your dashboard to view more details and manage this booking.
        </p>
    </div>

    <div class="footer">
        <p>This is an automated notification from Pagsanjan Falls Resort Booking System.</p>
        <p>&copy; {{ date('Y') }} Pagsanjan Falls Resort. All rights reserved.</p>
    </div>
</body>
</html>
