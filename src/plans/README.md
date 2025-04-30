# Plans Module

This module handles all operations related to subscription plans in the EDMoney application.

## Features

- Create, read, update, and delete plans
- Plans have different pricing tiers and feature limits
- Each plan defines maximum usage limits for users

## Database Structure

The plans table requires a migration to be created in Supabase:

```sql
-- Create plans table
CREATE TABLE IF NOT EXISTS "plans" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT NOT NULL,
  "price" NUMERIC(10,2) NOT NULL DEFAULT 0,
  "features" JSONB DEFAULT '{}'::JSONB,
  "maxUsage" INTEGER DEFAULT 0,
  "isActive" BOOLEAN DEFAULT TRUE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## API Endpoints

| Method | Endpoint     | Description            |
|--------|--------------|------------------------|
| GET    | /plans       | Get all plans          |
| GET    | /plans/:id   | Get a plan by ID       |
| POST   | /plans       | Create a new plan      |
| PATCH  | /plans/:id   | Update an existing plan|
| DELETE | /plans/:id   | Delete a plan          |

## Usage

All endpoints are protected by JWT authentication.

### Example: Create a new plan

```typescript
// POST /plans
{
  "name": "Business",
  "description": "Perfect for small businesses",
  "price": 49.99,
  "features": {
    "transactions": 2000,
    "categories": 50,
    "reports": true,
    "premium_support": true,
    "team_members": 5
  },
  "maxUsage": 2000,
  "isActive": true
}
``` 