# Subscriptions Module

This module handles all operations related to user subscriptions in the EDMoney application.

## Features

- Create, read, update, and delete subscription records
- Track users' subscriptions to plans
- Manage subscription statuses (active, canceled, past_due, etc.)
- Support for PayPal subscription IDs
- Specialized endpoint to cancel subscriptions
- Tracking of billing periods

## Database Structure

The subscriptions table requires a migration to be created in Supabase:

```sql
CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "plan_id" UUID NOT NULL REFERENCES "plans"("id") ON DELETE RESTRICT,
  "status" VARCHAR NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'pending', 'expired')),
  "start_date" TIMESTAMP WITH TIME ZONE NOT NULL,
  "end_date" TIMESTAMP WITH TIME ZONE,
  "current_period_start" TIMESTAMP WITH TIME ZONE,
  "current_period_end" TIMESTAMP WITH TIME ZONE,
  "paypal_subscription_id" VARCHAR,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## API Endpoints

| Method | Endpoint                   | Description                                  |
|--------|----------------------------|----------------------------------------------|
| GET    | /subscriptions             | Get all subscriptions (with optional filters)|
| GET    | /subscriptions/:id         | Get a specific subscription by ID            |
| GET    | /subscriptions/user/:userId| Get all subscriptions for a specific user    |
| POST   | /subscriptions             | Create a new subscription                    |
| PATCH  | /subscriptions/:id         | Update an existing subscription              |
| PATCH  | /subscriptions/:id/cancel  | Cancel a subscription                        |
| DELETE | /subscriptions/:id         | Delete a subscription                        |

## Usage

All endpoints are protected by JWT authentication.

### Example: Create a new subscription

```typescript
// POST /subscriptions
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "plan_id": "550e8400-e29b-41d4-a716-446655440001",
  "status": "active",
  "start_date": "2023-10-01T00:00:00Z",
  "end_date": "2024-10-01T00:00:00Z",
  "current_period_start": "2023-10-01T00:00:00Z",
  "current_period_end": "2023-11-01T00:00:00Z"
}
```

### Example: Cancel a subscription

```
PATCH /subscriptions/550e8400-e29b-41d4-a716-446655440000/cancel
```

This will set the subscription status to 'canceled' while preserving the subscription record. 