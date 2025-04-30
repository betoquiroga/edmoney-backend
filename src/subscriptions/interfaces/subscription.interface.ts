import {
  Subscription,
  SubscriptionStatus,
} from '../entities/subscription.entity';

export interface ISubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date: Date;
  end_date?: Date;
  current_period_start?: Date;
  current_period_end?: Date;
  paypal_subscription_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ISubscriptionResponse {
  subscription: Subscription;
  message?: string;
}

export interface ISubscriptionsResponse {
  subscriptions: Subscription[];
}
