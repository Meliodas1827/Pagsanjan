<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Boat Ride Request</title>
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
        .request-details {
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
    </style>
</head>
<body>
    <div class="header">
        <div class="icon">⛵</div>
        <h1>New Boat Ride Request</h1>
    </div>

    <div class="content">
        <p>Dear UBAAP Admin,</p>

        <div class="alert-box">
            <strong>Action Required!</strong> A new boat ride request has been submitted and requires boat assignment.
        </div>

        <p>A customer has submitted a boat ride request. Please review the details below and assign an appropriate boat:</p>

        <div class="request-details">
            <h3 style="margin-top: 0; color: #0284c7;">Request Details</h3>

            <div class="detail-row">
                <span class="detail-label">Customer Name:</span>
                <span class="detail-value">{{ $customer_name }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ $customer_email }}</span>
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
                <span class="detail-value" style="font-weight: bold; color: #0284c7;">{{ $no_of_adults + $no_of_children }}</span>
            </div>

            <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">#{{ $booking_id }}</span>
            </div>
        </div>

        <p><strong>Next Steps:</strong></p>
        <ul>
            <li>Review the customer's request and guest count</li>
            <li>Check boat availability for the requested date and time</li>
            <li>Assign an appropriate boat based on capacity requirements</li>
            <li>The system will automatically calculate the total amount based on the assigned boat's pricing</li>
        </ul>

        <div style="text-align: center;">
            <a href="{{ url('/boat-bookings') }}" class="button">Assign Boat Now</a>
        </div>

        <p>Please assign a boat as soon as possible to ensure customer satisfaction.</p>

        <p>Thank you,<br>Pagsanjan Falls Resort System</p>
    </div>

    <div class="footer">
        <p>This is an automated email notification from the booking system.</p>
        <p>&copy; {{ date('Y') }} Pagsanjan Falls Resort. All rights reserved.</p>
    </div>
</body>
</html>
