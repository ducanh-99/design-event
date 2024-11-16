# Explain

## Booking Feature

### Overview

The booking feature allows users to create and manage bookings for events. This feature includes endpoints for creating bookings and processing payments.

### Files

- `booking.service.ts`: Contains the logic for creating and managing bookings.
- `booking.controller.ts`: Handles HTTP requests related to bookings.
- `create-booking.dto.ts`: Defines the data transfer object for creating a booking.
- `booking.entity.ts`: Defines the booking entity used in the database.

### How It Works

1. **Creating a Booking**:

   - Endpoint: `POST /booking`
   - The user sends a request to create a booking with the necessary details (userId, eventId).
   - The `BookingService` handles the creation of the booking and sends a message to Kafka.

2. **Processing a Booking**:
   - The `OrderProcessorService` consumes the booking message from Kafka.
   - It checks if there are remaining tickets for the event.
   - If tickets are available, the booking status is updated to `approved`.
   - Update ticket to write database
   - The result is sent back to Kafka.

### Example

#### Create Booking Request

```http
POST /booking
Content-Type: application/json

{
  "userId": "123",
  "eventId": "456"
}
```

### Payment Feature

1. **Processing a Payment**:
   - Endpoint: `POST /pay`
   - The user sends a request to process a payment with the necessary details (userId, eventId, amount, currency, source).
   - The `PaymentService` handles the payment processing using Stripe.
   - The `stripe.createCharge` method is called to create a charge.
   - The payment status is updated in the repository.


